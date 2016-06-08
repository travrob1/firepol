'use strict';

var _ = require('lodash'),
    countries = require('country-data').countries,
    yesNo = [
        'yes',
        'no'
    ],
    definition = [
        { label: 'Gender',
          member: 'sex',
          category: 'personal',
          type: 'radio',
          options: [
              'male',
              'female'
          ],
          allowNull: true,
          message: 'invalid sex option'
        },
        { label: 'Education level',
          member: 'educationLevel',
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
        { label: 'Country',
          member: 'country',
          category: 'personal',
          type: 'select',
          message: 'invalid country choice',
          allowNull: true,
          options: _.map(countries.all, 'name')
        },
        { label: 'NFPA 72',
          member: 'fBuildingCodeNFPA72',
          category: 'building code familiarities',
          type: 'radio',
          message: 'invalid NFPA72 building code choice',
          allowNull: true,
          options: yesNo
        },
        { label: '2006 international building code',
          member: 'fBuildingCode2006internationalBuildingCode',
          category: 'building code familiarities',
          type: 'radio',
          message: 'invalid 2006 internation building code choice',
          allowNull: true,
          options: yesNo
        },
        { label: 'Wood',
          member: 'fBuildingMaterialWood',
          category: 'building material familiarities',
          type: 'radio',
          message: 'invalid building material choice with wood',
          allowNull: true,
          options: yesNo
        },
        { label: 'Brick',
          member: 'fBuildingMaterialBrick',
          category: 'building material familiarities',
          type: 'radio',
          message: 'invalid building material choice with brick',
          allowNull: true,
          options: yesNo
        },
        { label: 'Steel',
          member: 'fBuildingMaterialSteel',
          category: 'building material familiarities',
          type: 'radio',
          message: 'invalid building material choice with steel',
          allowNull: true,
          options: yesNo
        },
        { label: '1 & 2 level',
          member: 'fBuildingHeight1n2level',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning 1 and 2 story buildings',
          allowNull: true,
          options: yesNo
        },
        { label: '3 level',
          member: 'fBuildingHeight3level',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning 3 level buildings',
          allowNull: true,
          options: yesNo
        },
        { label: 'Lowrise',
          member: 'fBuildingHeightLowrise',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning lowrise buildings',
          allowNull: true,
          options: yesNo
        },
        { label: 'Highrise',
          member: 'fBuildingHeightHighrise',
          category: 'building height familiarities',
          type: 'radio',
          message: 'invalid choice concerning highrise buildings',
          allowNull: true,
          options: yesNo
        },
        { label: 'Home occupancy',
          member: 'fGeneralHomeOccupancy',
          category: 'general familiarities',
          type: 'checkbox',
          allowNull: true,
          options: [
              'single family detached',
              'single family attached',
              'multiple families living together'
          ],
          memberOptions: [
              'fGeneralHomeOccupancy_singleFamilyDetached',
              'fGeneralHomeOccupancy_singleFamilyAttached',
              'fGeneralHomeOccupancy_multipleFamiliesLivingTogether'
          ],
          message: 'invalid home occupancy familiarity option'
        },
        { label: 'Mixed zoning',
          member: 'fGeneralZoningMix',
          category: 'general familiarities',
          type: 'checkbox',
          allowNull: true,
          options: [
              'residental',
              'industrial',
              'mixed residential and industrial'
          ],
          memberOptions: [
              'fGeneralZoningMix_residental',
              'fGeneralZoningMix_industrial',
              'fGeneralZoningMix_mixedResidentialAndIndustrial'
          ],
          message: 'invalid zoning mix familiarity option'
        },
        { label: 'Disaster',
          member: 'fGeneralDisaster',
          category: 'general familiarities',
          type: 'checkbox',
          allowNull: true,
          options: [
              'fire',
              'earthquakes',
              'tsunamis',
              'tornadoes',
              'hurricanes',
              'sinkholes'
          ],
          memberOptions: [
              'fGeneralDisaster_fire',
              'fGeneralDisaster_earthquakes',
              'fGeneralDisaster_tsunamis',
              'fGeneralDisaster_tornadoes',
              'fGeneralDisaster_hurricanes',
              'fGeneralDisaster_sinkholes'
          ],
          message: 'invalid disaster familiarity option'
        },
        { label: 'Probability & Statistics',
          member: 'fGeneralProbablityStatistics',
          category: 'general familiarities',
          type: 'checkbox',
          allowNull: true,
          options: [
              'some self taught',
              'some coursework',
              'more than two courses',
              'undergrad major',
              'post graduate',
              'expert or doctor'
          ],
          memberOptions: [
              'fGeneralProbablityStatistics_someSelfTaught',
              'fGeneralProbablityStatistics_someCoursework',
              'fGeneralProbablityStatistics_moreThanTwoCourses',
              'fGeneralProbablityStatistics_undergradMajor',
              'fGeneralProbablityStatistics_postGraduate',
              'fGeneralProbablityStatistics_expertOrDoctor'
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
