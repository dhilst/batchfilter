const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient 
const uri = "mongodb://localhost/batchfilter";

module.exports = {
	connect(callback) {
    return MongoClient.connect(uri, (err, db) => {
      if (err) throw err;
      return callback(db, db.db("batchfilter"));
    });
  },

  savedfilters(callback) {
    return MongoClient.connect(uri, (err, db) => {
      if (err) throw err;
      return callback(db, db.db("batchfilter").collection("savedfilters"));
    });
  },

  toId(id) {
    return mongodb.ObjectId(id);
  }
}
