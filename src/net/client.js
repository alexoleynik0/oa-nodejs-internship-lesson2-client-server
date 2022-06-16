const net = require('net');

const port = 3000; // NOTE: same port as the server uses.

// net.connect is alias to net.createConnection()
// see https://nodejs.org/api/net.html#net_net_createconnection
const client = net.connect({
  port, // NOTE: a port the socket should connect to.
}, () => {
  console.log('connected to server!');
});

// The server can also receive data from the client by reading from its socket.
client.on('data', (data) => {
  console.log(data.toString());
  client.end(); // NOTE: half-closes the socket (sends a FIN packet).
});

// When the client requests to end the TCP connection with the server, the server
// ends the connection.
client.on('end', () => {
  console.log('disconnected from server');
});
