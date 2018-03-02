// server_mongodb.js
// ========

var MongoClient 	= require('mongodb').MongoClient;

const TvShowCollection	= require("./entity/TvShowCollection.js");
var Database_URL 		= "mongodb://localhost:27017/";
var TV_SHOW_DB			= "TvShowDB";
var TV_SHOW_COLLECTION 	= "TvShow";


// ----------###---------- All DB ----------###---------- 

exports.CreateDatabase					= function(name, callback) {
	var url = Database_URL + name;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		console.log("Database created!");
		db.close();
		callback();
	});	
}

exports.ListDatabases					= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(TV_SHOW_DB);
		var adminDb = dbo.admin();
		adminDb.listDatabases(function(err, dbs) {
			db.close();
			callback(dbs);
		});
	});	
}

exports.ListCollections_ByName			= function(namedb, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(namedb);
		dbo.listCollections().toArray(function(err, collect_list) {
			if (err) throw err;
			db.close();
			callback(collect_list);
		});
	});	
}


// ----------###---------- TvShowDB DB ----------###---------- 

exports.CreateCollection_TvShowDB	 	= function(collectName, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		dbo.createCollection(collectName, function(err, res) {
			if (err) throw err;
			console.log("Collection created!");
			db.close();
			callback();
		});
	});	
}

exports.ListCollections_TvShowDB		= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(TV_SHOW_DB);
		dbo.listCollections().toArray(function(err, collect_list) {
			if (err) throw err;
			db.close();
			callback(collect_list);
		});
	});	
}

exports.DropDatabase_TvShowDB			= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(TV_SHOW_DB);
		dbo.dropDatabase(function(err, result) {
			console.log("Remove Database: " + TV_SHOW_DB);
			db.close();
			callback(result);
		});
	});	
}

exports.FindAll_ByName					= function(collecName, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		dbo.collection(collecName).find({}).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			callback(result);
		});
	});	
}

exports.Sort_ByName						= function(collecName, varName, order, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		var mysort = {};
		mysort[varName] = order;
		dbo.collection(collecName).find().sort(mysort).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			callback(result);
		});
	});
}


// ----###---- TvShow Collection ----###---- 

exports.Insert_TvShow					= function(tvShow, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		dbo.collection(TV_SHOW_COLLECTION).insertOne(tvShow, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
			callback();
	  	});
	});
}

exports.InsertMany_TvShow				= function(manyArray, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		dbo.collection(TV_SHOW_COLLECTION).insertMany(manyArray, function(err, res) {
			if (err) throw err;
			console.log("Number of documents inserted: " + res.insertedCount);
			db.close();
			callback(res.insertedCount);
		});
	});
}

exports.FindFirst_TvShow 				= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		dbo.collection(TV_SHOW_COLLECTION).findOne({}, function(err, result) {
			if (err) throw err;
			db.close();
			callback(result);
		});
	});
}

exports.Find_TvShow						= function(query, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		dbo.collection(TV_SHOW_COLLECTION).find(query).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new TvShowCollection().Json2Object(result);
			callback(oldCollec);
		});
	});	
}

exports.FindAll_TvShow					= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		dbo.collection(TV_SHOW_COLLECTION).find({}).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new TvShowCollection().Json2Object(result);
			callback(oldCollec);
		});
	});	
}

exports.Sort_TvShow						= function(varName, order, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		var mysort = {};
		mysort[varName] = order;
		dbo.collection(TV_SHOW_COLLECTION).find().sort(mysort).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new TvShowCollection().Json2Object(result);
			callback(oldCollec);
		});
	});
}

exports.Delete_TvShow					= function(tvShow, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		var myquery  = { eztvId: tvShow.eztvId };
		dbo.collection(TV_SHOW_COLLECTION).deleteOne(myquery, function(err, obj) {
			if (err) throw err;
			console.log("1 document deleted");
			db.close();
			callback(obj);
		});
	});
}

exports.DeleteAll_TvShow				= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		var myquery  = { name: new RegExp("^") };
		dbo.collection(TV_SHOW_COLLECTION).deleteMany(myquery, function(err, obj) {
			if (err) throw err;
			console.log(obj.result.n + " items deleted.");
			db.close();
			callback();
		});
	});
}

exports.Update_TvShow					= function(tvShow, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(TV_SHOW_DB);
		var myquery  = { eztvId: tvShow.eztvId };
		dbo.collection(TV_SHOW_COLLECTION).updateOne(myquery, tvShow, function(err, obj) {
			if (err) throw err;
			console.log("1 document updated");
			db.close();
			callback(obj);
		});
	});
}

exports.DropCollection_TvShow 			= function(collectName, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(TV_SHOW_DB);
		dbo.collection(TV_SHOW_COLLECTION).drop(function(err, delOK) {
			if (err) throw err;
			if(delOK) {
				console.log("Collection deleted");
				db.close();
				callback(collect_list);
			}
		});
	});
}







