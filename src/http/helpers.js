const ROUTE_PARAMS_REGEX = /\{(\w+)\}/g;
const ROUTE_PARAMS_REPLACE_REGEX_STR = '([\\w-]+)';

const routeKeyParse = (routeKey) => {
  const match = routeKey.match(/^(ANY|GET|POST|PUT|PATCH|DELETE|OPTIONS|):{0,1}(\/.*)/);
  if (match === null) {
    throw new Error(`routeKeyParse failed to parse "${routeKey}".`);
  }
  let routeParamsArr;
  let path = match[2];
  if (path.indexOf('{') > -1) {
    routeParamsArr = path.match(ROUTE_PARAMS_REGEX);
    if (routeParamsArr !== null) {
      routeParamsArr = routeParamsArr.map((el) => el.replace(/[{|}]/g, ''));
      path = path.replace(ROUTE_PARAMS_REGEX, ROUTE_PARAMS_REPLACE_REGEX_STR);
    }
  }
  return {
    method: match[1] || 'ANY',
    path,
    routeParamsArr: routeParamsArr || [],
  };
};

const isMethodMatches = (routeMethod, reqMethod) => routeMethod === 'ANY' || routeMethod.toUpperCase() === reqMethod.toUpperCase();

const getPathMatch = (routePath, reqPath) => reqPath.match(`^${routePath}$`);

const getPathPart = (reqPath) => `/${reqPath.split('/').filter((el) => el.length > 0)[0] || ''}`;

const findRoute = (routes, req, reqPath) => {
  if (req.routeParams === undefined) {
    req.routeParams = {};
  }
  const reqMethod = req.method;
  const reqPathPart = getPathPart(reqPath);
  const routesKeys = Object.keys(routes);
  for (let i = 0; i < routesKeys.length; i += 1) {
    const routeKey = routesKeys[i];
    const routeKeyParsed = routeKeyParse(routeKey);
    const pathMatch = getPathMatch(routeKeyParsed.path, reqPathPart);
    if (
      routeKeyParsed
      && isMethodMatches(routeKeyParsed.method, reqMethod)
        && pathMatch !== null
    ) {
      routeKeyParsed.routeParamsArr.forEach((routeParamsItem, routeParamsIndex) => {
        if (pathMatch[routeParamsIndex + 1] !== undefined) {
          req.routeParams[routeParamsItem] = pathMatch[routeParamsIndex + 1];
        }
      });
      if (routes[routeKey].routes instanceof Object) {
        return findRoute(routes[routeKey].routes, req, reqPath.substr(routeKeyParsed.path.length) || '/');
      }
      return routes[routeKey];
    }
  }
  return null;
};

const SUPPORTED_CONTENT_TYPES = ['application/json', 'application/x-www-form-urlencoded'];
const getReqContentType = (req) => (req.headers['content-type'] || '').toLowerCase();
const getReqContentLength = (req) => parseInt(req.headers['content-length'], 10);

const checkReqContentType = (req) => {
  const reqContentType = getReqContentType(req);
  if (SUPPORTED_CONTENT_TYPES.indexOf(reqContentType) === -1) {
    throw new Error(`Unsupported Request Content-Type "${reqContentType}".`);
  }
};

const parseReqData = (req, data) => {
  if (getReqContentLength(req) === 0) {
    return null;
  }
  const reqContentType = getReqContentType(req);
  switch (reqContentType) {
    case 'application/json':
      return JSON.parse(data.toString());
    case 'application/x-www-form-urlencoded':
      return Object.fromEntries(new URLSearchParams(data.toString()));
    default:
      throw new Error(`Unsupported Request Content-Type "${reqContentType}".`);
  }
};

const getReqData = (req) => new Promise((resolve) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const data = Buffer.concat(chunks);
    resolve(parseReqData(req, data));
  });
});

const resWriteRouteNotFound = (res) => {
  res.statusCode = 404;
  res.write(JSON.stringify({
    message: 'Route Not Found.',
  }));
};

const resWriteResourceNotFound = (res) => {
  res.statusCode = 404;
  res.write(JSON.stringify({
    message: 'Resource Not Found.',
  }));
};

const resWriteServerError = (res) => {
  res.statusCode = 500;
  res.write(JSON.stringify({
    message: 'Internal Server Error.',
  }));
};

module.exports = {
  findRoute,
  checkReqContentType,
  getReqData,
  resWriteRouteNotFound,
  resWriteResourceNotFound,
  resWriteServerError,
};
