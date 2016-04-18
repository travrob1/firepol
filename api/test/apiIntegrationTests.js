'use strict';

/* globals describe, it */

var expect = require('chai').expect,
    request = require('supertest')('http://localhost:3000');

describe('timezone', function() {
    it('should return an array of timezones', function(done) {
        request.get('/api/timezones/getZones')
            .expect(200, function(err) {
                if (err)
                    console.log(err);
            })
            .expect(function(data) {
                expect(data.body.zoneList).to.exist;
                expect(data.body.zoneList).to.be.array;
                 done();
            });
    });
});