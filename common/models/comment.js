// 'use strict';
// var modelHelpers = require('./modelHelpers');

// module.exports = function(Comment) {
//     Comment.observe('before save', function(ctx, next) {
//         function run(app) {
//             var accessToken = ctx.options.accessToken;
//             var dataOrInstance = ctx.instance || ctx.data;
//             if (accessToken === null) {
//                 next(new Error('must be logged in to leave comment'));
//             } else {
//                 // modelHelpers.timestamp(app.models.Question, dataOrInstance.questionId);
//                 // dataOrInstance.ownerId = accessToken.userId;
//                 // app.models.FirepolUser.findById(accessToken.userId, function(err, usr){
//                 //     if(usr){
//                 //         dataOrInstance.name = usr.username;
//                 //         dataOrInstance.fill = usr.fill;
//                 //         dataOrInstance.avatarIndx = usr.avatarIndx;
//                 //     }
//                 //     next();
//                 // });
//             }
//             dataOrInstance.time = Date.now();
//         }
//         modelHelpers.getAppReference(Comment).then(run);
//      });
// };
