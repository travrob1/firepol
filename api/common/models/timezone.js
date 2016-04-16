'use strict';

var moment = require('moment-timezone');

module.exports = function(Timezone) {
    Timezone.getZones = function(cb) {
      cb(null, moment.tz.names());
    };

    Timezone.remoteMethod(
        'getZones', 
        {
          //accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'zoneList', type: 'array'}
        }
    );
};
