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


io.on('connection', (client)=>{
  console.log('established websocket connection');

  // client.on('message', (message) => {
  //   console.log('message received: ', message);
  // });
});

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
});

app.delete('/webhookServer', (req, res) => {
  console.log('Server Is Off!');
  ngrok.kill();
  return res.status(200).json('the server has been deleted');
});

app.post('/webhook', (req, res) => {
  const data = {headers: req.headers, body: req.body}
  io.emit('response', data);
  return res.status(200).json(req.body);
})


app.get('/signup/github/callback', authController.getToken, authController.getUserInfo, (req, res) => {
  res.cookie('auth', res.locals.access_token);
  console.log('callback cookies', req.cookies);
  return res.status(200).redirect('http://localhost:8080');
});

app.get('/api/getUserData', authController.checkForCookie, authController.getProfile, authController.getRepos, authController.getSwellFile, (req, res) => {
  console.log(res.locals.github)
  return res.status(200).send(res.locals.github);
})

app.get('/api/import', (req, res) => {
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