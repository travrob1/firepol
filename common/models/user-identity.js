
module.exports = function(userIdentity) {
    userIdentity.observe('before save', function(ctx, next) {
        var dataOrInstance = ctx.instance || ctx.data;

        dataOrInstance.profile.photos[0].value = dataOrInstance.profile.photos[0].value.replace('sz=50', 'sz=200');
        next();
     });
};