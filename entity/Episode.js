	
	const InfoTorrentCollection = require("./InfoTorrentCollection.js");

	var season;
	var num;
	var name;
	var date;
	var href;
	var img;
	var rating;
	var infoTorrentCollection;


	// Constructor
	function Episode(season, num, name, date, href, img, rating) {
		this.season = parseFloat(season);
		this.num = parseFloat(num);
		this.name = name;
		this.date = this.editDate(date);
		this.href = href;
		this.img = img;
		this.rating = rating;
		//this.infoTorrentCollection = new InfoTorrentCollection();
	}

	Episode.prototype.editDate				= function(date) {
		//console.log("First : " + date);
		//console.log("After: " + new Date(newDate));
		return date;
	}

	Episode.prototype.addTorrentInfo		= function(infoTorrent) {
		if(infoTorrentCollection) {
			this.infoTorrentCollection.add(infoTorrent);
		} else {
			this.infoTorrentCollection = new InfoTorrentCollection();
			this.infoTorrentCollection.add(infoTorrent);
		}
	}
		
	module.exports = Episode;