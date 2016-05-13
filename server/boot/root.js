module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', function(req, res, next){
    console.log('something', req.user);
    res.render('index', req.user);
  });
  server.use(router);
};
