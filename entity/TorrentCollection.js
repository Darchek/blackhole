
	var downloadCollection;
	
	function TorrentCollection() {
		this.downloadCollection = [];
	}
	
	TorrentCollection.prototype.getLength 			= function() {
		return this.downloadCollection.length;
	}
	
	TorrentCollection.prototype.getPendentLength 	= function() {
		return this.getAllPendent().length;
	}
	
	TorrentCollection.prototype.add 				= function(torrent) {
		this.downloadCollection.push(torrent);
	}
	
	TorrentCollection.prototype.get 				= function(num) {
		return this.downloadCollection[num];
	}

	TorrentCollection.prototype.getById				= function(idOrHash) {
		return this.downloadCollection.find(function(trr) {
			return ((trr.id == idOrHash) || (trr.hash == idOrHash));
		});
	}

	TorrentCollection.prototype.getAllDownloads		= function() {
		return this.downloadCollection;
	}

	TorrentCollection.prototype.getAllPendent		= function() {
		var pendents = this.downloadCollection.filter(function(trr) {
			return (trr.progress == "Pendent");
		});
		return pendents;
	}
	
	TorrentCollection.prototype.update 				= function(torrent) {
		for(var i = 0; i < this.downloadCollection.length; i++) {
			if(this.downloadCollection[i].hash == torrent.hash) {
				this.downloadCollection[i] = torrent;
				break;
			}							
		}
	}

	TorrentCollection.prototype.removeById			= function(idOrHash) {
		for(var i = 0; i < this.downloadCollection.length; i++) {
			if((this.downloadCollection[i].id == idOrHash) || (this.downloadCollection[i].hash == idOrHash)) {
				this.downloadCollection.splice(i, 1);
				break;
			}							
		}
	}
	
	TorrentCollection.prototype.removeAllPendent	= function() {
		for(var i = 0; i < this.downloadCollection.length; i++) {
			if(this.downloadCollection[i].process == "Process") {
				this.downloadCollection.splice(i, 1);
				break;
			}							
		}
	}
	
	TorrentCollection.prototype.print				= function() {
		console.log(downloadCollection);
	}
	
	module.exports = TorrentCollection;