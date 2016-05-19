
module.exports = function(Question) {
    Question.observe('before save', function(ctx, next) {
        //console.log('beforeSave');
        next();
     });
};
