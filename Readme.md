# Real Time Chat Application

This application used the WebSocket Protocol to create a real time chat application. Features of the chat room include:
- Real time user tracking (to see who is in a particular chatroom)
- Real time messaging
- Prevention of users joining a room with the same username
- Smart autoscrolling
- Location sharing

Features of the WebSocket Protocol:
- Both the client and server are able to initiate communications with one another (full-duplex communication).
- Seperate protocol from HTTP
- The connection is persistent between client and server

The library used in this application is the [socket.io](https://socket.io/) library.

## Tools Used

A list of some of the tools used for this application can be found below.

### Geolocation API

[MDN Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

## Profanity Filter

This app used the [bad-words](https://www.npmjs.com/package/bad-words) module to filter bad words from the application!

## Timestamp Formatting

This appliction uses [moment](https://momentjs.com/) to format timestamps.

## Additional Tools

Some of the tools used to deploy the server were used in my [task manager application](https://github.com/matthew-william-lock/task-manager-application). A more detailed explanation of how these two applications were deployed can be found there.