const dgram = require('dgram');

const PORT = 41234; // NOTE: should be .
const HOST = '127.0.0.1'; // NOTE: aka 'localhost' or '0.0.0.0'.

// creating a udp server (or client)
const client = dgram.createSocket('udp4'); // NOTE: 'udp4' means we're using IPv4.
// buffer msg
const message = Buffer.from('My KungFu is Good!');

// sending msg
client.send(message, 0, message.length, PORT, HOST, (err) => {
  if (err) throw err;

  console.log(`UDP message sent to ${HOST} : ${PORT}`);
  // close connection
  client.close();
});
