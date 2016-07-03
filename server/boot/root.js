module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', function(req, res){
    res.render('index', {config: JSON.stringify({user: req.user || false})});
  });
  server.use(router);
};
