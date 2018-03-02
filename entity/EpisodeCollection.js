
	var episodeCollection;
	var totalSeasons;
	
	function EpisodeCollection() {
		this.episodeCollection = [];
		this.totalSeasons = 0;
    }
    
    EpisodeCollection.prototype.getLength 				= function() {
		return this.episodeCollection.length;
	}
	
	EpisodeCollection.prototype.add 					= function(episode) {
		this.episodeCollection.push(episode);
	}
	
	EpisodeCollection.prototype.get 					= function(num) {
		return this.episodeCollection[num];
	}

	EpisodeCollection.prototype.findEpisodeBySeasonNum	= function(season, num) {
		return this.episodeCollection.find(function(ep) {
			return 	((ep.season == season) && (ep.num == num));		
		});	
	}

	EpisodeCollection.prototype.findNameInEpisodes		= function(name) {
		var ep = this.episodeCollection.find(function(ep) {
			return name.includes(ep.name);
		});
		if(!ep) {
			console.log("-------------> Episode not found: " + name);
		}
		return ep;
	}

	EpisodeCollection.prototype.setTotalSeasons 		= function(total_seasons) {
		this.totalSeasons = total_seasons;
	}



	module.exports = EpisodeCollection;