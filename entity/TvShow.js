
	const EpisodeCollection = require("./EpisodeCollection.js");

	var eztvId;
	var name;
	var href;
	var state;
	var rating;
	var img;
	var imdb_href;
	var episodeCollection;


	// Constructor
	function TvShow(name, href, state, rating) {
		this.eztvId = this.getEztvIdByHref(href);
		this.name = name;
		this.href = href;
		this.state = this.editState(state);
		this.rating = rating;
		this.img = "";
		this.imdb_href = "";
		this.episodeCollection = new EpisodeCollection();
	}

	TvShow.prototype.Json2Object				= function(json) {
		this.eztvId = json.eztvId;
		this.name = json.name;
		this.href = json.href;
		this.state = json.state;
		this.rating = json.rating;
		this.img = json.img;
		this.imdb_href = json.imdb_href;
		this.episodeCollection = json.episodeCollection;
		return this;
	}
	
	TvShow.prototype.editState					= function(state) {
		if(state) {
			if(state.includes("On break")) { 
				state = "On break";
			} else if(state.includes("Pending")) {
				state = "Pending";
			} else if(state.includes("Ended")) {
				state = "Ended";
			} else if(state.includes("Airing")) {
				state = "Airing";
			}
		}
		return state;
	}
	
	TvShow.prototype.getEztvIdByHref 			= function(href) {
		if(href) {
			var txtID = href.split("/")[4];
			return parseFloat(txtID);
		}
		return "";
	}
	
	TvShow.prototype.setImage					= function(img) {
		this.img = "https://eztv.ag" + img;		
	}

	TvShow.prototype.setImdbHref				= function(imdb_href) {
		this.imdb_href = imdb_href;
	}
	
	TvShow.prototype.addEpisode 				= function(episode) {
		this.episodeCollection.add(episode);
	}

	TvShow.prototype.getEpisodesLength			= function() {
		return this.episodeCollection.getLength();
	}

	TvShow.prototype.findNameInEpisodes			= function(name) {
		return this.episodeCollection.findNameInEpisodes(name);
	}
	
	TvShow.prototype.addInfoTorrent				= function(season, num, infoTorrent) {
		for(var i = this.episodeCollection.getLength() - 1; i > -1; i--) {
			if((this.episodeCollection.get(i).season == season) && (this.episodeCollection.get(i).num == num)) {
				this.episodeCollection.get(i).addTorrentInfo(infoTorrent);
				break;
			}
		}		
	}
	
	TvShow.prototype.findEpisodeBySeasonNum		= function(season, num) {
		return this.episodeCollection.findEpisodeBySeasonNum(season, num);
	}

	TvShow.prototype.getLastSeason				= function() {
		var season = this.episodeCollection[this.episodeCollection.length - 1].season;
		var episodes = this.episodeCollection.filter(function(ch) {
			return (ch.season == season);
		});
		return episodes;
	}

	TvShow.prototype.getBySeason 				= function(season) {
		var episodes = this.episodeCollection.filter(function(ch) {
			return (ch.season == season);
		});
		return episodes;
	}

	TvShow.prototype.setTotalSeasons			= function(total_seasons) {
		this.episodeCollection.setTotalSeasons(total_seasons);
	}
	
	module.exports = TvShow;