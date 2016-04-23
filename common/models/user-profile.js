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
          category: 'personal',
          type: 'radio',
          options: [
              'male',
              'female'
          ],
          message: 'invalid sex option'
        },
        { member: 'EducationLevel',
          category: 'personal',
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
          category: 'personal',
          type: 'select',
          message: 'invalid country choice',
          options: countries.all
        },
        { member: 'F_BuildingCode_NFPA72',
          category: 'building code familiarities',
          type: 'checkbox',
          message: 'invalid NFPA72 building code choice',
          options: yesNo
        },
        { member: 'F_BuildingCode_2006internationalBuildingCode',
          category: 'building code familiarities',
          type: 'checkbox',
          message: 'invalid 2006 internation building code choice',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_wood',
          category: 'building material familiarities',
          type: 'checkbox',
          message: 'invalid building material choice with wood',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_brick',
          category: 'building material familiarities',
          type: 'checkbox',
          message: 'invalid building material choice with brick',
          options: yesNo
        },
        { member: 'F_BuildingMaterial_steel',
          category: 'building material familiarities',
          type: 'checkbox',
          message: 'invalid building material choice with steel',
          options: yesNo
        },
        { member: 'F_BuildingHeight_1n2level',
          category: 'building height familiarities',
          type: 'checkbox',
          message: 'invalid choice concerning 1 and 2 story buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_3level',
          category: 'building height familiarities',
          type: 'checkbox',
          message: 'invalid choice concerning 3 level buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_lowrise',
          category: 'building height familiarities',
          type: 'checkbox',
          message: 'invalid choice concerning lowrise buildings',
          options: yesNo
        },
        { member: 'F_BuildingHeight_highrise',
          category: 'building height familiarities',
          type: 'checkbox',
          message: 'invalid choice concerning highrise buildings',
          options: yesNo
        },
        { member: 'F_General_HomeOccupancy',
          category: 'general familiarities',
          type: 'select',
          options: [
              'single family detached',
              'single family attached',
              'multiple families living together'
          ],
          message: 'invalid home occupancy familiarity option'
        },
        { member: 'F_General_ZoningMix',
          category: 'general familiarities',
          type: 'select',
          options: [
              'residental',
              'industrial',
              'mixed residential and industrial'
          ],
          message: 'invalid zoning mix familiarity option'
        },
        { member: 'F_General_Disaster',
          category: 'general familiarities',
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
          category: 'general familiarities',
          type: 'select',
          options: [
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

    /* validations */
    _.forEach(definition, function(def) {
        UserProfile.validatesInclusionOf(def.member, {in: def.options});
    });

    /* provide definition to UI */
    UserProfile.getUserProfileDefinition = function (cb) {
        cb(null, definition);
    };
    UserProfile.remoteMethod('getUserProfileDefinition', {
        //accepts: {arg: 'msg', type: 'string'},
        returns: {arg: 'userProfileDefinition', type: 'array'}
    });
};
