const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(3000, function(){
    console.log('server listening on port', 3000);
})

app.use(express.static(__dirname+'/public'));

//SERIAL COMMUNICATION
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({
    path: 'COM5',
    baudRate: 9600,
    parser: new ReadlineParser('\r\n')
});



port.on('open', function(){
    console.log('Connection is opened');
});

port.on('data', function(data){
    console.log(data.toString());
    io.emit('temp', data.toString());
})

port.on('error', function (err){
    console.log(err)
})
