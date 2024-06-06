const SerialPort = require('serialport');
const WebSocket = require('ws');
const Readline = require('@serialport/parser-readline');

// Replace with your Arduino's serial port name
const port = new SerialPort('COM3', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  
  parser.on('data', (data) => {
    console.log('Received data from Arduino:', data);
    ws.send(data);
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

console.log('WebSocket server listening on ws://localhost:8080');
