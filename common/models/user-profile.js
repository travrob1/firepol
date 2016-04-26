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
          allowNull: true,
          message: 'invalid sex option'
        },
        { member: 'EducationLevel',
          category: 'personal',
          type: 'select',
          allowNull: true,
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
          allowNull: true,
          options: countries.all
        },
        { member: 'F_BuildingCode_NFPA72',
          category: 'building code familiarities',
          type: 'radio',
          message: 'invalid NFPA72 building code choice',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingCode_2006internationalBuildingCode',
          category: 'building code familiarities',
          type: 'radio',
          message: 'invalid 2006 internation building code choice',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingMaterial_wood',
          category: 'building material familiarities',
          type: 'radio',
          message: 'invalid building material choice with wood',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingMaterial_brick',
          category: 'building material familiarities',
          type: 'radio',
          message: 'invalid building material choice with brick',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingMaterial_steel',
          category: 'building material familiarities',
          type: 'radio',
          message: 'invalid building material choice with steel',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingHeight_1n2level',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning 1 and 2 story buildings',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingHeight_3level',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning 3 level buildings',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingHeight_lowrise',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning lowrise buildings',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_BuildingHeight_highrise',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning highrise buildings',
          allowNull: true,
          options: yesNo
        },
        { member: 'F_General_HomeOccupancy',
          category: 'general familiarities',
          type: 'select',
          allowNull: true,
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
          allowNull: true,
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
          allowNull: true,
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
          allowNull: true,
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
    UserProfile.validatesPresenceOf('userId');
    _.forEach(definition, function(def) {
        UserProfile.validatesInclusionOf(def.member, {in: def.options, allowNull: def.allowNull});
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
