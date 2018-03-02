
// server_torrent.js
// ========

var WebTorrent	= require('webtorrent'),
	fs			= require("fs");

var client 				= new WebTorrent();
const Torrent 			= require("./entity/Torrent.js");
const TorrentCollection	= require("./entity/TorrentCollection.js");


exports.torrentCollection 			= new TorrentCollection();

exports.insertTorrent				= function(torrentURL, displayName, callback) {
	var opt = { tmp: "./torrents", path: "./torrents/" };
	
	var pendent = new Torrent(torrentURL, displayName);
	exports.torrentCollection.add(pendent);
	
	console.log("--> Adding Torrent. Current: " + exports.torrentCollection.getLength());
	client.add(torrentURL, opt, function (torrent) {
		//console.log('Client is downloading:', torrent.name);
		var newTorrent = exports.torrentCollection.getById(torrentURL);
		newTorrent.readyConstructor(torrent.infoHash, torrent.name, torrent.length);
		exports.torrentCollection.update(newTorrent);
		callback(newTorrent);
		
		client.on('torrent', function (readyTorrent) {
			//console.log("-------- The Torrents Are Ready");
		});
		
		torrent.on('done', function () {
			console.log('Torrent download finished: ' + torrent.name);
			exports.torrentCollection.removeByHash(torrent.infoHash);
		});
		
	});
	
	client.on('error', function (err) {
		console.log("------------------ Error ------------------");
		console.log(err);
	});
}

exports.removeTorrentById			= function(torrentId, callback) {
	client.remove(torrentId, function(err) {
		if(!err) {
			var torrent = exports.torrentCollection.getById(torrentId);
			exports.torrentCollection.removeById(torrentId);
			fs.exists("torrents/" + torrent.name, function(exists) {
				if(exists) {
				  fs.unlink("torrents/" + torrent.name);
				} else {
				  console.log(gutil.colors.red('File not found, so not deleting.'));
				}
			});
			console.log(" - - - - - - - Remove OK  - - - - - - - ");
			callback();
		} else {
			console.log(err);
			callback("Remove Error");
		}
	});
}

exports.removeAllPendent			= function(callback) {
	var torrPendents = exports.torrentCollection.getAllPendent();
	for(var i = 0; i < torrPendents.getLength(); i++) {
		var torrentId = exports.torrPendents.get(i).id;
		client.remove(torrentId, function(err) {
			if(err != null) {
				console.log(" - - - - - - - Remove OK " + i + "- - - - - - - ");
			} else {
				console.log(err);
				callback("Remove Error");
			}
		});
	}
	exports.torrentCollection.removeAllPendent();
}

exports.getDownloadByTorrent		= function(torrent) {
	var t = client.get(torrent.hash);
	torrent.updateDownload(t.downloaded, t.downloadSpeed, t.progress);
	exports.torrentCollection.update(torrent);
	return torrent;
}

exports.updateCurrentDownloads		= function() {
	for(var i = 0; i < exports.torrentCollection.getLength(); i++) {
		var t = client.get(exports.torrentCollection.get(i).hash);
		if(t)
			exports.torrentCollection.get(i).updateDownload(t.downloaded, t.downloadSpeed, t.progress);
	}
}

exports.convertJson2Torrent			= function(torrentText) {
	return new Torrent().getTorrentByJson(torrentText);	
}