const http = require('http');

const { getReqData } = require('./helpers');

const host = 'localhost';
const port = 3030;

const REQUEST_OPTIONS = [
  {
    host,
    port,
    method: 'GET',
    path: '/',
  }, {
    host,
    port,
    method: 'GET',
    path: '/users',
  }, {
    host,
    port,
    method: 'POST',
    path: '/users',
    headers: {
      'content-type': 'application/json',
    },
    reqData: JSON.stringify({
      name: 'Jet Li',
    }),
  }, {
    host,
    port,
    method: 'POST',
    path: '/users',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    reqData: 'name=Jet Li',
  }, {
    host,
    port,
    method: 'PUT',
    path: '/users/2',
    headers: {
      'content-type': 'application/json',
    },
    reqData: JSON.stringify({
      name: 'Bill Murray',
    }),
  }, {
    host,
    port,
    method: 'PATCH',
    path: '/users/1',
    headers: {
      'content-type': 'application/json',
    },
    reqData: JSON.stringify({
      name: 'Wes Anderson',
      dob: 'May 1, 1969',
    }),
  }, {
    host,
    port,
    method: 'DELETE',
    path: '/users/1',
  }, {
    host,
    port,
    method: 'GET',
    path: '/users/1',
  }, {
    host,
    port,
    method: 'GET',
    path: '/users',
  },
];

const handleError = (e) => {
  console.error(`Got error: ${e.message}`);
};

const requestCallback = async (res) => {
  console.log(`REQUEST ${res.req.method} http://${host}:${port}${res.req.path}`);
  console.log('statusCode', res.statusCode);

  const resData = await getReqData(res);
  console.log('resData', resData);
};

REQUEST_OPTIONS.forEach((reqOption) => {
  const request = http.request(reqOption, requestCallback);
  request.on('error', handleError);
  if (reqOption.reqData) {
    request.write(reqOption.reqData);
  }
  request.end();
});
