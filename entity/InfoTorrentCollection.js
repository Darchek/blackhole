
	var infoTorrentCollection;
	
	function InfoTorrentCollection() {
		this.infoTorrentCollection = [];
    }
    
    InfoTorrentCollection.prototype.getLength 				= function() {
		return this.infoTorrentCollection.length;
	}
	
	InfoTorrentCollection.prototype.add 					= function(infoTorrent) {
		this.infoTorrentCollection.push(infoTorrent);
	}
	
	InfoTorrentCollection.prototype.get 					= function(num) {
		return this.infoTorrentCollection[num];
	}

	module.exports = InfoTorrentCollection;