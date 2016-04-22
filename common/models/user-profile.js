'use strict';

var _ = require('lodash'),
    countries = require('country-data').countries,
    yesNo = {
        Y: 'yes',
        N: 'no'
    },
    fieldValidations = [
        { member: 'Sex',
          options: {
              M:'male',
              F:'female',
              TM:'transition to male',
              TF:'transition to female'
          },
          message: 'invalid sex option'
        },
        { member: 'EducationLevel',
          options: {
              usls: 'less than highschool',
              ushs: 'highschool or equivalent',
              usad: 'associates degree',
              usba: 'bachelor of arts',
              usbs: 'bachelor of science',
              usma: 'masters',
              usdg: 'doctorate or greater'
          },
          message: 'invalid education level option'
        },
        { member: 'Country',
          message: 'invalid country choice',
          options: countries.all
        },
        { member: 'F_BuildingCode_NFPA72',
          message: 'invalid NFPA72 building code choice',
          options: yesNo
        },
        { member: 'F_BuildingCode_2006internationalBuildingCode',
          message: 'invalid 2006 internation building code choice',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_wood',
          message: 'invalid building material choice with wood',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_brick',
          message: 'invalid building material choice with brick',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_steel',
          message: 'invalid building material choice with steel',
          options: yesNo
        },
        { member: 'F_BuildingHeight_1n2level',
          message: 'invalid choice concerning 1 and 2 story buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_3level',
          message: 'invalid choice concerning 3 level buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_lowrise',
          message: 'invalid choice concerning lowrise buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_highrise',
          message: 'invalid choice concerning highrise buildings',
          options: yesNo
        },
        { member: 'F_General_HomeOccupancy',
          options: {
              sd: 'single family detached',
              sa: 'single family attached',
              mf: 'multiple families living together'
          },
          message: 'invalid home occupancy familiarity option'
        },
        { member: 'F_General_ZoningMix',
          options: {
              r: 'residental',
              i: 'industrial',
              m: 'mixed residential and industrial'
          },
          message: 'invalid zoning mix familiarity option'
        },
        { member: 'F_General_Disaster',
          options: {
              fi: 'fire',
              eq: 'earthquakes',
              ts: 'tsunamis',
              td: 'tornadoes',
              hu: 'hurricanes',
              sh: 'sinkholes'
          },
          message: 'invalid disaster familiarity option'
        },
        { member: 'F_General_ProbablityStatistics',
          options: {
              10: 'none',
              20: 'some self taught',
              30: 'some coursework',
              40: 'more than 2 courses',
              50: 'undergrad major',
              60: 'post graduate',
              70: 'expert or doctor'
          }
        }
    ];

module.exports = function(UserProfile) {
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
