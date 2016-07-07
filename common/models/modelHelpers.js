'use strict';

var $q = require('bluebird');

var app;
function getAppReference(model) {
    return new $q( function(resolve, reject) {
        if (! app) {
            model.getApp(function(err, theApp) {
                if (err) { reject(err); }
                else { resolve(theApp); }
            });
        } else {
            resolve(app);
        }
    });
}

function timestamp(model, id, attribute) {
    // if we ever need it, this should return a promise that resolves when update is complete
    if (!attribute) { attribute='modified';}
    var update = {};
    update[attribute] = Date.now();
    model.findById(id, setTimestamp);
    function setTimestamp(err, modelInstance) {
        modelInstance.updateAttributes(update);
    }
}

function logErrorsThenCall(cb) {
    return function (err, info) {
        if(err){console.log(err);}
        cb();
    };
}

module.exports = {
    getAppReference: getAppReference,
    timestamp: timestamp,
    logErrorsThenCall: logErrorsThenCall
};