var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('store.json');
var middlewares = jsonServer.defaults();

server.use(middlewares);

server.use("/ambrosia/api", router);

server.listen(2016);

