
	var id;
	var hash;
	var name;
	var displayName;
	var length;
	var downloaded;
	var speed;
	var progress;


	// Constructor
	function Torrent(id, displayName) {
		this.id = id;
		this.hash = "Pending Hash";
		this.name = "Pending Name";
		this.displayName = displayName;
		this.length = 0;
		this.downloaded = 0;
		this.speed = 0;
		this.progress = "Pendent";
	}

	Torrent.prototype.readyConstructor = function(hash, name, length) {
		this.hash = hash;
		this.name = name;
		this.length = this.getCompressBytes(length);
		this.downloaded = this.getCompressBytes(0);
		this.speed = this.getCompressBytes(0) + "/s";
		this.progress = (0 * 100).toFixed(2) + "%";
	}

	Torrent.prototype.setProgress = function(progress) {
		this.progress = (progress * 100).toFixed(2) + "%";
	}
	
	Torrent.prototype.getTorrentByJson = function(txtTorrent) {
		var jsonTorrent = JSON.parse(txtTorrent);
		this.id = jsonTorrent.id;
		this.hash = jsonTorrent.hash;
		this.name = jsonTorrent.name;
		this.displayName = jsonTorrent.displayName;
		this.length = jsonTorrent.length;
		this.downloaded = jsonTorrent.downloaded;
		this.speed = jsonTorrent.speed;
		this.progress = jsonTorrent.progress;
		return this;
	}
	
	Torrent.prototype.updateDownload = function(downloaded, speed, progress) {
		this.downloaded = this.getCompressBytes(downloaded);
		this.speed = this.getCompressBytes(speed) + "/s";
		this.progress = (progress * 100).toFixed(2) + "%";
	}
				
	Torrent.prototype.getCompressBytes = function(numBytes) {
		var converterNum = 1024;
		var length = parseFloat(numBytes).toFixed(2) + " B";
		if (numBytes <= converterNum) {
			length = parseFloat(numBytes).toFixed(2) + " B";
		} else if (numBytes <= Math.pow(converterNum, 2)) {
			length = parseFloat(numBytes/converterNum).toFixed(2) + " KB";
		} else if (numBytes <= Math.pow(converterNum, 3)) {
			length = parseFloat(numBytes/Math.pow(converterNum, 2)).toFixed(2) + " MB";
		} else if (numBytes <= Math.pow(converterNum, 4)) {
			length = parseFloat(numBytes/Math.pow(converterNum, 3)).toFixed(2) + " GB";
		}
		return length;	
	}
		
	
	module.exports = Torrent;
