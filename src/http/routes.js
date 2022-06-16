const usersController = require('./usersController').default;

module.exports.default = {
  'GET:/': (_req, res) => {
    res.write(JSON.stringify({
      hello: 'world',
    }));
  },
  '/users': {
    routes: {
      'GET:/': usersController.getAll,
      'POST:/': usersController.create,
      'GET:/{id}': usersController.getOne,
      'PUT:/{id}': usersController.put,
      'PATCH:/{id}': usersController.patch,
      'DELETE:/{id}': usersController.remove,
    },
  },
};
