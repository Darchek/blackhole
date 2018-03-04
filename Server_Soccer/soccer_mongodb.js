// soccer_mongodb.js
// ========

var MongoClient 	= require('mongodb').MongoClient;

const MatchCollection	= require("../entity/MatchCollection.js");
const TeamCollection	= require("../entity/TeamCollection.js");
var Database_URL 		= "mongodb://localhost:27017/";
var SOCCER_DB			= "SoccerDB";
var MATCH_COLLECTION 	= "MatchCollection";
var TEAM_COLLECTION 	= "TeamCollection";


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
		var dbo = db.db(SOCCER_DB);
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


// ----------###---------- Soccer DB ----------###---------- 

exports.CreateCollection_SoccerDB	 	= function(collectName, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.createCollection(collectName, function(err, res) {
			if (err) throw err;
			console.log("Collection created!");
			db.close();
			callback();
		});
	});	
}

exports.ListCollections_SoccerDB		= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(SOCCER_DB);
		dbo.listCollections().toArray(function(err, collect_list) {
			if (err) throw err;
			db.close();
			callback(collect_list);
		});
	});	
}

exports.DropDatabase_SoccerDB			= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(SOCCER_DB);
		dbo.dropDatabase(function(err, result) {
			console.log("Remove Database: " + SOCCER_DB);
			db.close();
			callback(result);
		});
	});	
}

exports.FindAll_ByName					= function(collecName, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
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
		var dbo = db.db(SOCCER_DB);
		var mysort = {};
		mysort[varName] = order;
		dbo.collection(collecName).find().sort(mysort).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			callback(result);
		});
	});
}


// ----------###---------- Match Collection ----------###---------- 

exports.Insert_Match					= function(match, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(MATCH_COLLECTION).insertOne(match, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
			callback();
	  	});
	});
}

exports.InsertMany_Match				= function(manyArray, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(MATCH_COLLECTION).insertMany(manyArray, function(err, res) {
			if (err) throw err;
			console.log("Number of documents inserted: " + res.insertedCount);
			db.close();
			callback(res.insertedCount);
		});
	});
}

exports.FindFirst_Match 				= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(MATCH_COLLECTION).findOne({}, function(err, result) {
			if (err) throw err;
			db.close();
			callback(result);
		});
	});
}

exports.Find_Match						= function(query, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(MATCH_COLLECTION).find(query).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new MatchCollection().Json2Object(result);
			callback(oldCollec);
		});
	});	
}

exports.FindAll_Match					= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(MATCH_COLLECTION).find({}).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new MatchCollection().Json2Object(result);
			callback(oldCollec);
		});
	});	
}

exports.Sort_Match						= function(varName, order, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		var mysort = {};
		mysort[varName] = order;
		dbo.collection(MATCH_COLLECTION).find().sort(mysort).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new MatchCollection().Json2Object(result);
			callback(oldCollec);
		});
	});
}

exports.Delete_Match					= function(match, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		var myquery  = { id: match.id };
		dbo.collection(MATCH_COLLECTION).deleteOne(myquery, function(err, obj) {
			if (err) throw err;
			console.log("1 document deleted");
			db.close();
			callback(obj);
		});
	});
}

exports.DeleteAll_Match				    = function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		var myquery  = { id: new RegExp("^") };
		dbo.collection(MATCH_COLLECTION).deleteMany(myquery, function(err, obj) {
			if (err) throw err;
			console.log(obj.result.n + " items deleted.");
			db.close();
			callback();
		});
	});
}

exports.Update_Match					= function(match, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		var myquery  = { id: match.id };
		dbo.collection(MATCH_COLLECTION).updateOne(myquery, match, function(err, obj) {
			if (err) throw err;
			console.log("1 document updated");
			db.close();
			callback(obj);
		});
	});
}

exports.DropCollection_Match 			= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(SOCCER_DB);
		dbo.collection(MATCH_COLLECTION).drop(function(err, delOK) {
			if (err) throw err;
			if(delOK) {
				console.log("Collection deleted");
				db.close();
				callback();
			}
		});
	});
}


// ----------###---------- Team Collection ----------###---------- 

exports.Insert_Team					    = function(team, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(TEAM_COLLECTION).insertOne(team, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
			callback();
	  	});
	});
}

exports.InsertMany_Team				    = function(manyArray, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(TEAM_COLLECTION).insertMany(manyArray, function(err, res) {
			if (err) throw err;
			console.log("Number of documents inserted: " + res.insertedCount);
			db.close();
			callback(res.insertedCount);
		});
	});
}

exports.FindFirst_Team 				    = function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(TEAM_COLLECTION).findOne({}, function(err, result) {
			if (err) throw err;
			db.close();
			callback(result);
		});
	});
}

exports.Find_Team						= function(query, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(TEAM_COLLECTION).find(query).toArray(function(err, result) {
			if (err) throw err;
            db.close();
			callback(new TeamCollection().Json2Object(result));
		});
	});	
}

exports.FindAll_Team					= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		dbo.collection(TEAM_COLLECTION).find({}).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new TeamCollection().Json2Object(result);
			callback(oldCollec);
		});
	});	
}

exports.Sort_Team						= function(varName, order, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		var mysort = {};
		mysort[varName] = order;
		dbo.collection(TEAM_COLLECTION).find().sort(mysort).toArray(function(err, result) {
			if (err) throw err;
			db.close();
			var oldCollec = new TeamCollection().Json2Object(result);
			callback(oldCollec);
		});
	});
}

exports.Delete_Team					    = function(team, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		var myquery  = { id: team.id };
		dbo.collection(TEAM_COLLECTION).deleteOne(myquery, function(err, obj) {
			if (err) throw err;
			console.log("1 document deleted");
			db.close();
			callback(obj);
		});
	});
}

exports.DeleteAll_Team				    = function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
		var myquery  = { name: new RegExp("^") };
		dbo.collection(TEAM_COLLECTION).deleteMany(myquery, function(err, obj) {
			if (err) throw err;
			console.log(obj.result.n + " items deleted.");
			db.close();
			callback();
		});
	});
}

exports.Update_Team					    = function(team, callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db(SOCCER_DB);
        var myquery  = { "_id": team.id };
		dbo.collection(TEAM_COLLECTION).update(myquery, team, function(err, obj) {
			if (err) throw err;
			console.log("1 document updated");
			db.close();
			callback(obj);
		});
	});
}

exports.DropCollection_Team 			= function(callback) {
	MongoClient.connect(Database_URL, function(err, db) {
		var dbo = db.db(SOCCER_DB);
		dbo.collection(TEAM_COLLECTION).drop(function(err, delOK) {
			if (err) throw err;
			if(delOK) {
				console.log("Collection deleted");
				db.close();
				callback();
			}
		});
	});
}

