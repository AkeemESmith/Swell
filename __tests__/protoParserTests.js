import protoParser from '../src/client/components/composer/protos/protoParser';
import {remote} from "electron";


beforeEach(() => {
const protoFile = `syntax = 'proto3';

package helloworld;

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
  rpc SayHelloCS (stream HelloRequest) returns (HelloReply) {}
  rpc SayHellos (HelloRequest) returns (stream HelloReply) {}
  rpc SayHelloBidi (stream HelloRequest) returns (stream HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}

// The request message containing the user's name.
message HelloHowOldRequest {
  int32 age = 1;
}
message HelloAge {
  int32 age = 1;
}`
})