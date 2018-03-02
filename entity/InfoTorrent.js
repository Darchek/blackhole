
	var type;
	var magnet;
	var file;
	var size;


	// Constructor
	function InfoTorrent(type, magnet, file, size) {
		this.type = type;
		this.magnet = magnet;
		this.file = file;
		this.size = size;
	}

	module.exports = InfoTorrent;