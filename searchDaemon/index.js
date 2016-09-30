var MongoClient = require('mongodb').MongoClient,
  test = require('assert'),
  _ = require('lodash'),
  objectId = require('mongodb').ObjectID;

// Connection url
var url = 'mongodb://firepol:firepol@localhost/firepol';

MongoClient.connect(url, function(err, db) {
    var cancelWork;
    function scheduleWork() {
        checkForUnindexedData(db);
        cancelWork = setTimeout(_.partial(scheduleWork), 2000);
    }
    if (err) {
        console.log(err);
    } else {
        scheduleWork();
    }
});

function checkForUnindexedData(db) {
    // Create a collection we want to drop later
    var collection = db.collection('Post');
    var findResult = collection.find({indexed: {$ne: true}});
    findResult.toArray(function(err, items) {
        _.forEach(items, function(item) {
            var updateCompletePromise = collection.update({_id: objectId(item._id)}, {$set: {indexed: true}});
            // TODO: Post to elastic
        });
    });
}

