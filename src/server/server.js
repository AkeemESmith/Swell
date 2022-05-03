const path = require('path');
const express = require('express');
const ngrok = require('ngrok');
require('dotenv').config();

const port = 3000;
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.static(path.resolve(__dirname, '../../build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));


app.use(cookieParser());
// app.use(function(req, res, next) {
//   res.set("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
//   res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// require controllers
const authController = require('./controllers/authController');

// TODO: why did previous groups decide to use socket.io?
// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
// create a plain Node.JS HTTP server using the request handler functions generated by invoking express()
const server = require('http').createServer(app); 

// https://www.npmjs.com/package/socket.io
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

// if u want to use routers, set socket io then google the rest
// https://stackoverflow.com/questions/47249009/nodejs-socket-io-in-a-router-page
app.set('socketio', io);


// io.on('connection', (client)=>{
//   console.log('established websocket connection');

//   // client.on('message', (message) => {
//   //   console.log('message received: ', message);
//   // });
// });

app.get('/', (req, res) => res.send('Hello World!'));

app.use(express.static(path.resolve(__dirname, '../../build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({origin: 'http://localhost:8080'}))

app.post('/webhookServer', (req, res) => {
  console.log('Server Is On!');
  ngrok
    .connect({
      proto: 'http',
      addr: '3000',
    })
    .then((url) => {
      console.log(`ngrok tunnel opened at: ${url}/webhook`);
      return res.status(200).json(url);
    });
  // return res.status(200).json('Hi! I am a test!');
});

app.delete('/webhookServer', (req, res) => {
  console.log('Server Is Off!');
  ngrok.kill();
  return res.status(200).json('the server has been deleted');
});

// listening for stuff
app.post('/webhook', (req, res) => {
  // console.log("this is the req", req.headers);
  // console.log(req.body);
  const data = {headers: req.headers, body: req.body}
  io.emit('response', data);
  return res.status(200).json(req.body);
})

app.get('/signup/github/callback', authController.getToken, (req, res) => {
  console.log('clicked the login button');
  res.cookie('auth', res.locals.access_token);
  console.log('callback cookies', req.cookies)
  // return res.status(200).json(res.locals.swellFile);
  // return res.status(200).send(res.locals.access_token);
  return res.status(200).redirect('http://localhost:8080');
  // const url = `http://github.com/login/oauth/authorize?scope=repo&redirect_uri=http://localhost:3000/signup/github/callback/&client_id=${process.env.GITHUB_CLIENT_ID}`;
  // return res.status(301).redirect(url);
});

app.get('/api/import', authController.getProfile, authController.getRepos, authController.getSwellFile, (req, res) => {
  console.log('swell file:', res.locals.swellFile);
  return res.status(200).send(res.locals.swellFile);
})

// //inital error handler, needs work
app.use('*', (req,res) => {
  res.status(404).send('Not Found');
});

// Global Handler, needs work
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = {...defaultErr, ...err}
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

module.exports = server.listen(port, () => console.log(`Listening on port ${port}`));