// Include Nodejs' net module.
const net = require('net');

// The port on which the server is listening.
const port = 3000; // NOTE: any free port [1025..65535].

// Create a new TCP server.
const server = net.createServer((connection) => {
  // NOTE: this is connectionListener callback function.
  // NOTE: same as do ```server.on('connection', (connection) => {...});```.
  // NOTE: `connection` is instance of net.Socket.

  console.log('client connected');

  connection.on('end', () => {
    console.log('client disconnected');
  });

  // Now that a TCP connection has been established, the server can send data to
  // the client by writing to its socket.
  connection.write('Hello World!\r\n');

  // NOTE: pipe reads from a readable stream and writes to a writeable stream.
  // NOTE: same as do ```connection.on('data', (chunk) => { connection.write(chunk); });```.
  // NOTE: in our example this is ECHO server (it writes everything that it reads).
  connection.pipe(connection);
});

// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, () => { // NOTE: a port to use.
  console.log('server is listening');
});
