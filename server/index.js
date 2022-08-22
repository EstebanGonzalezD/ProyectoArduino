const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { postMarcaciones, getMarcaciones, informeExcel } = require("./database/marcaciones");
let dtmFechaDesde;
let dtmFechaHasta;
let status = true;

server.listen(3000, function () {
  console.log("server listening on port", 3000);
});

app.use(express.static(__dirname + "/public"));

//SERIAL COMMUNICATION
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = new SerialPort({
  path: "COM6",
  baudRate: 9600,
  parser: new ReadlineParser("\r\n"),
});

port.on("open", function () {
  console.log("Connection is opened");
});

port.on("data", function (data) {
  if(status){
    postMarcaciones(data);
    enviarMarcaciones();
    io.emit("temp", data.toString());
  }
});

port.on("error", function (err) {
  console.log(err);
});

function enviarMarcaciones(){
  const resultado = getMarcaciones().then(rs => 
    io.emit("distancias", rs)
    );

}

io.on('connection', (socket) => {

  socket.on('dtmFechaDesde', (msg) => {
      dtmFechaDesde = msg;
  })

  socket.on('dtmFechaHasta', (msg) => {
    dtmFechaHasta = msg;
    informeExcel(dtmFechaDesde, dtmFechaHasta).then(rs => {
      io.emit('informeExcel', rs)
    });
  })

  socket.on('Detener', (msg) => {
    status = false;
  })

  socket.on('Iniciar', (msg) => {
    status = true;
  })

  
});





