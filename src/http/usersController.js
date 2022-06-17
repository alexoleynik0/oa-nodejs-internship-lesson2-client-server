const { checkReqContentType, getReqData, resWriteResourceNotFound } = require('./helpers');

const USERS_STORE_DEFAULT = [{ id: 1, name: 'John Doe' }];
let usersStore = [...USERS_STORE_DEFAULT];

module.exports.default = {
  reset: (_req, res) => {
    usersStore = [...USERS_STORE_DEFAULT];
    res.statusCode = 200;
  },

  getAll: (_req, res) => {
    res.statusCode = 200;
    res.write(JSON.stringify(usersStore));
  },

  create: async (req, res) => {
    checkReqContentType(req);
    const reqData = await getReqData(req);
    const newUser = {
      ...reqData,
      id: usersStore.length + 1,
    };
    usersStore.push(newUser);

    res.statusCode = 201;
    res.write(JSON.stringify(newUser));
  },

  getOne: (req, res) => {
    const id = parseInt(req.routeParams.id, 10);
    const foundUser = usersStore.find((user) => user.id === id);
    if (!foundUser) {
      resWriteResourceNotFound(res);
      return;
    }
    res.statusCode = 200;
    res.write(JSON.stringify(foundUser));
  },

  put: async (req, res) => {
    checkReqContentType(req);
    const reqData = await getReqData(req);
    const id = parseInt(req.routeParams.id, 10);
    const foundUser = usersStore.find((user) => user.id === id);
    if (!foundUser) {
      resWriteResourceNotFound(res);
      return;
    }
    if (reqData.id === undefined) {
      reqData.id = id;
    }
    usersStore = usersStore.map((user) => {
      if (user.id === id) {
        return reqData;
      }
      return user;
    });
    res.statusCode = 200;
    res.write(JSON.stringify(reqData));
  },

  patch: async (req, res) => {
    checkReqContentType(req);
    const reqData = await getReqData(req);
    const id = parseInt(req.routeParams.id, 10);
    const foundUser = usersStore.find((user) => user.id === id);
    if (!foundUser) {
      resWriteResourceNotFound(res);
      return;
    }
    const patchedUser = {
      ...foundUser,
      ...reqData,
    };
    usersStore = usersStore.map((user) => {
      if (user.id === id) {
        return patchedUser;
      }
      return user;
    });
    res.statusCode = 200;
    res.write(JSON.stringify(patchedUser));
  },

  remove: (req, res) => {
    const id = parseInt(req.routeParams.id, 10);
    const foundUser = usersStore.find((user) => user.id === id);
    if (!foundUser) {
      resWriteResourceNotFound(res);
      return;
    }
    usersStore = usersStore.filter((user) => user.id !== id);
    res.statusCode = 200;
    res.write(JSON.stringify(foundUser));
  },
};
