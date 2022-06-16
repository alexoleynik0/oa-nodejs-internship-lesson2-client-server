const http = require('http');
const { URL } = require('url');

const ROUTES = require('./routes').default;
const { findRoute, resWriteRouteNotFound, resWriteServerError } = require('./helpers');

const PORT = 3030;
const HOST = 'localhost';

// create a local server to receive data from
const server = http.createServer();

// listen to the request event
server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`request ${req.method} ${req.url}`);

  // default response data
  res.setHeader('Content-Type', 'application/json');

  try {
    // "router"
    const foundRouteCb = findRoute(ROUTES, req, url.pathname);
    if (foundRouteCb !== null) {
      await foundRouteCb(req, res);
    } else {
      resWriteRouteNotFound(res);
    }
  } catch (error) {
    console.error(error);
    resWriteServerError(res);
  }

  // end response
  res.end();
});

// show in console that server is running
server.on('listening', () => {
  console.log(`server is listening ${HOST}:${PORT}`);
});

// run server on host:port
server.listen(PORT, HOST);
