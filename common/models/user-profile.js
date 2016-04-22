'use strict';

var _ = require('lodash'),
    countries = require('country-data').countries,
    yesNo = [
        'yes',
        'no',
        null
    ],
    definition = [
        { member: 'Sex',
          type: 'radio',
          options: [
              'male',
              'female'
          ],
          message: 'invalid sex option'
        },
        { member: 'EducationLevel',
          type: 'select',
          options: [
              'less than highschool',
              'highschool or equivalent',
              'associates degree',
              'bachelor of arts',
              'bachelor of science',
              'masters',
              'doctorate or greater'
          ],
          message: 'invalid education level option'
        },
        { member: 'Country',
          type: 'select',
          message: 'invalid country choice',
          options: countries.all
        },
        { member: 'F_BuildingCode_NFPA72',
          type: 'checkbox',
          message: 'invalid NFPA72 building code choice',
          options: yesNo
        },
        { member: 'F_BuildingCode_2006internationalBuildingCode',
          type: 'checkbox',
          message: 'invalid 2006 internation building code choice',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_wood',
          type: 'checkbox',
          message: 'invalid building material choice with wood',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_brick',
          type: 'checkbox',
          message: 'invalid building material choice with brick',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_steel',
          type: 'checkbox',
          message: 'invalid building material choice with steel',
          options: yesNo
        },
        { member: 'F_BuildingHeight_1n2level',
          type: 'checkbox',
          message: 'invalid choice concerning 1 and 2 story buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_3level',
          type: 'checkbox',
          message: 'invalid choice concerning 3 level buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_lowrise',
          type: 'checkbox',
          message: 'invalid choice concerning lowrise buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_highrise',
          type: 'checkbox',
          message: 'invalid choice concerning highrise buildings',
          options: yesNo
        },
        { member: 'F_General_HomeOccupancy',
          type: 'select',
          options: [
              'single family detached',
              'single family attached',
              'multiple families living together'
          ],
          message: 'invalid home occupancy familiarity option'
        },
        { member: 'F_General_ZoningMix',
          type: 'select',
          options: [
              'residental',
              'industrial',
              'mixed residential and industrial'
          ],
          message: 'invalid zoning mix familiarity option'
        },
        { member: 'F_General_Disaster',
          type: 'select',
          options: [
              'fire',
              'earthquakes',
              'tsunamis',
              'tornadoes',
              'hurricanes',
              'sinkholes'
          ],
          message: 'invalid disaster familiarity option'
        },
        { member: 'F_General_ProbablityStatistics',
          type: 'select',
          options: [
              'none',
              'some self taught',
              'some coursework',
              'more than 2 courses',
              'undergrad major',
              'post graduate',
              'expert or doctor'
          ]
        }
    ];

module.exports = function(UserProfile) {
    UserProfile.getUserProfileDefinition = function (cb) {
        cb(null, definition);
    };
    UserProfile.remoteMethod('getUserProfileDefinition', {
        //accepts: {arg: 'msg', type: 'string'},
        returns: {arg: 'userProfileDefinition', type: 'array'}
    });
    return;
    UserProfile.observe('before save', function(ctx, next) {
        var userProfile = ctx.data || ctx.instance,
            errors = [];
        _.forEach(fieldValidations, function(fieldV) {
            if (! _.includes(
                  Object.keys(fieldV.options), userProfile[fieldV.member])) {
                errors.append(fieldV.msg);
            }
        });

        if (errors) {
            throw new RangeError(errors.join(','));
        }
        next();
     });

    _.forEach(fieldValidations, function(fieldV) {
        var funcName = 'get' + fieldV.member;
        UserProfile[funcName] = function (cb) {
            cb(null, fieldV.options);
        };
        UserProfile.remoteMethod(funcName, {
            //accepts: {arg: 'msg', type: 'string'},
            returns: {arg: 'list' + fieldV.member, type: 'object'}
        });
    });
};
