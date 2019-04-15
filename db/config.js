const MongoClient = require('mongodb').MongoClient 
const uri = "mongodb://localhost/batchfilter";

module.exports = {
	connect(callback) {
		return MongoClient.connect(uri, callback);
	}
}
