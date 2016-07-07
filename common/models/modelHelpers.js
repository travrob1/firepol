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

var internalApiToken = (function() {
    var token = 'zombo___YouCanDoAnything____' + Math.floor(Math.random() * 100000000000);
    return function() {
        return token;
    };
}
)();
function internalApiTokenize(obj) {
    obj[internalApiToken()] = true;
    return obj;
}
function internalApiConsumeToken(obj) {
    if ( obj[internalApiToken()] ) {
        delete obj[internalApiToken()];
        return true;
    } else {
        return false;
    }
}
module.exports = {
    getAppReference: getAppReference,
    timestamp: timestamp,
    logErrorsThenCall: logErrorsThenCall,
    internalApiToken: internalApiToken,
    internalApiTokenize: internalApiTokenize,
    internalApiConsumeToken: internalApiConsumeToken
};