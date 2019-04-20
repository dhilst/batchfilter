const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient 
//const uri = "mongodb://localhost/batchfilter";
const uri = process.env.MONGODB_URI;
const dbname  = uri.split('/').reverse()[0];

module.exports = {
	connect(callback) {
    return MongoClient.connect(uri, (err, db) => {
      if (err) throw err;
      return callback(db, db.db(dbname));
    });
  },

  savedfilters(callback) {
    return MongoClient.connect(uri, (err, db) => {
      if (err) throw err;
      return callback(db, db.db(dbname).collection("savedfilters"));
    });
  },

  toId(id) {
    return mongodb.ObjectId(id);
  }
}
