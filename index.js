
var express = require('express'),
    app = express(),
	server = require('http').createServer(app),
	bodyParser = require('body-parser'),
	io = require("socket.io").listen(server),
	fs = require('fs'),
	exec = require('child_process').exec;
	
const Server_Torrent = require('./server_torrent');
const Parsing_Torrent = require('./parsing_torrent');
const Server_MongoDB = require('./server_mongodb');
const Server_Soccer  = require("./Server_Soccer/server_soccer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

server.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));

	Server_Soccer.init_ServerSoccer();
});

app.get('/', function(req, res) {
	res.send("Ubuntu PC Enabled \n");
});

app.get('/shutdown', function(req, res) {
	exec('sudo halt -p', function(error, stdout, stderr){ 
		console.log(error);
		console.log(stdout);
		console.log(stderr);
		res.send("Shutdown\n");
	});
});

app.get('/is_on', function(req, res) {
	res.send("Server is ON\n");
});


// ----------###---------- Torrent Server ----------###---------- 

app.get('/torrentClient', function(req, res) {
	Server_Torrent.updateCurrentDownloads();
	res.render('index', { "downloads" : JSON.stringify(Server_Torrent.downloadCollection) });
});

app.post('/torrentClient/insert', function(req, res){
	var id = req.body.torrentId;
	var name = req.body.name;
	Server_Torrent.insertTorrent(id, name, function(torrent) {
		console.log("--> Torrent Added: " + torrent.name);
		Server_Torrent.updateCurrentDownloads();
		res.send(JSON.stringify(Server_Torrent.downloadCollection));
	});
});

app.post('/torrentClient/remove', function(req, res){
	var hash = req.body.torrentIdHash;
	Server_Torrent.removeTorrentByHash(hash, function() {
		console.log("--> Torrent Removed...");
		Server_Torrent.updateCurrentDownloads();
		res.send(JSON.stringify(Server_Torrent.downloadCollection));
	});
});

app.post('/torrentClient/removeAllPendent', function(req, res){
	Server_Torrent.removeAllPendentTorrents(function() {
		console.log("--> All Pendent Torrents Removed");
		Server_Torrent.updateCurrentDownloads();
		res.send(JSON.stringify(Server_Torrent.downloadCollection));
	});
});

app.post('/torrentClient/getCurrentDownloads', function(req, res){
	Server_Torrent.updateCurrentDownloads();
	console.log("--> Updating...");
	res.send(JSON.stringify(Server_Torrent.downloadCollection));
});

app.post('/torrentClient/getPendent', function(req, res) {
	var allPendent = Server_Torrent.torrentCollection.getAllPendent();
	res.send(JSON.stringify(allPendent));
});

app.post('/tvShow/getList', function(req, res) {
	Parsing_Torrent.FindAll_TvShow(function(result) {
		console.log(" --> Getting Show List...");
		res.send(JSON.stringify(result));
	});	
});

app.post('/tvShow/getListByName', function(req, res) {
	var re = new RegExp("^" + req.body.name, "i");
	var query = { name: re };
	Server_MongoDB.Find_TvShow(query, function(result) {
		console.log(" --> Getting Show " + result.getLength() + " Items...");
		res.send(JSON.stringify(result));
	});	
});

app.post('/tvShow/getItem', function(req, res) {
	var showUrl = req.body.showUrl;
	console.log("Recived Request. Getting show: " + showUrl);
	Parsing_Torrent.getTvShowByUrl_IMDB(showUrl, function(tvShow) {
		console.log(" --> Getting TV Show... " + showUrl);
		res.send(JSON.stringify(tvShow));
	});	
});

app.post('/tvShow/getItemWithProgress', function(req, res) {
	var showUrl = req.body.showUrl;
	console.log("Recived Request. Getting show: " + showUrl);
	Parsing_Torrent.getTvShowByUrl_IMDB_WithProgress(showUrl, function(type, data) {
		var sendTxt = { type: type, data: data };
		console.log(sendTxt);
		res.write(JSON.stringify(sendTxt));
	});	
});

app.post('/tvShow/updateList', function(req, res) {
	Parsing_Torrent.updateTvShowList(function() {

	});
});

app.get('/test', function(req, res) {
	console.log("TEST SOCKET");
	res.write("TEST ONE\n");
	res.write("TEST TWO\n");
	setTimeout(test, 4000);

	function test() {
		res.write("END");
		res.end();
	}
	
});


// ----------###---------- Soccer Server ----------###---------- 

app.post('/getClasification_LaLiga', function(req, res) {
	Server_Soccer.parsingClasification(function(clasif) {
		console.log(" --> Getting La Liga Clasification");
		res.send(JSON.stringify(clasif));
	});
});

app.post('/getNextDayMatches', function(req, res) {
	var num_day = 1000*60*60*24;
	var now 	= new Date().getTime();
	Server_Soccer.parsingMatchesByDay(now, callbackDay);
	Server_Soccer.parsingMatchesByDay(new Date(now + num_day), callbackDay);
	Server_Soccer.parsingMatchesByDay(new Date(now + 2*num_day), callbackDay);

	var done_num = 0;
	function callbackDay(matches) {
		done_num++;
		if(done_num == 3) {

		}		
	}
});



// ----------###---------- Database REST ----------###---------- 

app.get('/mongodb', function(req, res) {
	Server_MongoDB.ListDatabases(function(result) {
		res.render('mongodb_index', { "db_list" : JSON.stringify(result) });
	});
});


// ----------###---------- Sockets ----------###---------- 

io.sockets.on('connection', function(socket) {

	console.log("Socket in");

	socket.on('addTorrent', function(uriTorrent, name) {
		Server_Torrent.insertTorrent(uriTorrent, name, function(torrent) {
			console.log("--> Adding (Sockets)... " + torrent.name);
			Server_Torrent.updateCurrentDownloads();
			io.sockets.emit('addTorrentResponse', Server_Torrent.torrentCollection);
		});
	});
	
	socket.on('currentDownloads', function() {
		Server_Torrent.updateCurrentDownloads();
		//console.log("--> Updating (Sockets)...");
		io.sockets.emit('currentDownloadsResponse', Server_Torrent.torrentCollection);
	});
	
	socket.on('removeAllPendentTorrents', function() {
		Server_Torrent.removeAllPendentTorrents(function() {
			console.log("--> All Pendent Torrents Removed (Sockets)...");
			Server_Torrent.updateCurrentDownloads();
			io.sockets.emit('removeAllPendentTorrentsResponse', Server_Torrent.torrentCollection);
		});
	});

	socket.on('currentTvShows', function() {
		if(Parsing_Torrent.tvShowCollection) {
			io.sockets.emit('currentTvShowsResponse', Parsing_Torrent.tvShowCollection.getNameStrings());
		}
	});

	socket.on('getTvShowsByName', function(name) {
		var tvShow = Parsing_Torrent.tvShowCollection.getByName(name);
		Parsing_Torrent.getTvShowByUrl(tvShow.href, function(showComplete) {
			var lastSeason = showComplete.getLastSeason();
			io.sockets.emit('getTvShowsByNameResponse', lastSeason);
		});
	});
	
	socket.on('removeTorrentById', function(torrentId) {
		Server_Torrent.removeTorrentById(torrentId, function() {
			Server_Torrent.updateCurrentDownloads();
			io.sockets.emit('removeTorrentByIdResponse', Server_Torrent.torrentCollection);
		});
	});


	// ----------###---------- Database REST (Sockets) ----------###---------- 

	socket.on('getCollections', function(db_name) {
		Server_MongoDB.ListCollections_ByName(db_name, function(collect_list) {
			io.sockets.emit('getCollectionsResponse', collect_list);
		});
	});

	socket.on('getCollection', function(collec_name) {
		Server_MongoDB.FindAll_ByName(collec_name, function(collection) {
			io.sockets.emit('getCollectionResponse', collection);
		});
	});

	socket.on('sortCollection', function(data) {
		Server_MongoDB.Sort_ByName(data.collec, data.varName, data.order, function(collection) {
			io.sockets.emit('getCollectionResponse', collection);
		});
	});

});

