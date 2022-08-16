const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

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
})

port.on('error', function (err){
    console.log(err)
})
