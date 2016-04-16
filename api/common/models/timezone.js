module.exports = function(Timezone) {
    Timezone.getZones = function(cb) {
      cb(null, 'Greetings... ');
    };
     
    Timezone.remoteMethod(
        'getZones', 
        {
          //accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
        }
    );
};
