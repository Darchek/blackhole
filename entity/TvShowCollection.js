
	const TvShow = require("./TvShow.js");
	
	var tvShowCollection;
	
	function TvShowCollection() {
		this.tvShowCollection = [];
	}

	TvShowCollection.prototype.Json2Object			= function(jsonCollection) {
		for(var i = 0; i < jsonCollection.length; i++) {
			var tvShow = new TvShow().Json2Object(jsonCollection[i]);
			this.add(tvShow);
		}
		return this;
	} 
	
	TvShowCollection.prototype.getLength 			= function() {
		return this.tvShowCollection.length;
	}
	
	TvShowCollection.prototype.add 					= function(tvShow) {
		this.tvShowCollection.push(tvShow);
	}
	
	TvShowCollection.prototype.get					= function(num) {
		return this.tvShowCollection[num];
	}

	TvShowCollection.prototype.getList				= function() {
		return this.tvShowCollection;
	}

	TvShowCollection.prototype.getByEztvId			= function(eztvId) {
		return this.tvShowCollection.find(function(ts) {
			return (ts.eztvId == eztvId);
		});
	}

	TvShowCollection.prototype.getByName			= function(name) {
		return this.tvShowCollection.find(function(ts) {
			return (ts.name.toLowerCase().includes(name.toLowerCase()));
		});
	}

	TvShowCollection.prototype.sortByName			= function() {
		var sortCollec = this.tvShowCollection;
		sortCollec.sort(function(a, b) {
			return (a.name.localeCompare(b.name));
		});
		return new TvShowCollection().Json2Object(sortCollec);
	}
	
	TvShowCollection.prototype.updateByEztvId		= function(tvShow) {
		for(var i = 0; i < this.tvShowCollection.length; i++) {
			if(this.tvShowCollection[i].eztvId == tvShow.eztvId) {
				this.tvShowCollection[i] = tvShow;
				break;
			}							
		}
	}

	TvShowCollection.prototype.removeByEztvId		= function(eztvId) {
		for(var i = 0; i < this.tvShowCollection.length; i++) {
			if(this.tvShowCollection[i].eztvId == eztvId) {
				this.tvShowCollection.splice(i, 1);
				break;
			}							
		}
	}

	TvShowCollection.prototype.getNameStrings		= function() {
		var names = [];
		for(var i = 0; i < this.tvShowCollection.length; i++) {
			names.push(this.tvShowCollection[i].name);
		}
		return names;
	}
	
	module.exports = TvShowCollection;