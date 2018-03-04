
	var matchCollection;
	var startDate;
	var endDate;
	
	function MatchCollection() {
		this.matchCollection = [];
	}

	MatchCollection.prototype.Json2Object			= function(jsonCollection) {
		for(var i = 0; i < jsonCollection.length; i++) {
			var match = new Match().Json2Object(jsonCollection[i]);
			this.add(match);
		}
		return this;
	} 
	
	MatchCollection.prototype.getLength 			= function() {
		return this.matchCollection.length;
	}
	
	MatchCollection.prototype.getTodayMatches 		= function() {
		var today	= new Date();
		var matches	= this.matchCollection.filter(function(m) {
			return ((m.date.getDate() == today.getDate()) && (m.date.getMonth() == today.getMonth()) && (m.date.getFullYear() == today.getFullYear()));
		});
		return matches;
	}
	
	MatchCollection.prototype.getStageMatches 		= function(stageNum) {
		var matches = this.matchCollection.filter(function(m) {
			return (m.stage == stageNum);
		});
		return new MatchCollection(matches);
	}
	
	MatchCollection.prototype.getStartDate 			= function() {
		if(this.matchCollection.length > 0) {
			var start = this.matchCollection[0].date;
			for(var i = 0; i < this.matchCollection.length; i++) {			
				if(this.matchCollection[i].date.getTime() < start.getTime())
					start = this.matchCollection[i].date;
			}
			return start;
		}
		return null;
	}
	
	MatchCollection.prototype.getEndDate 			= function() {
		if(this.matchCollection.length > 0) {
			var end = this.matchCollection[0].date;
			for(var i = 0; i < this.matchCollection.length; i++) {			
				if(this.matchCollection[i].date.getTime() > end.getTime())
					end = this.matchCollection[i].date;
			}
			return end;
		}
		return null;
	}
	
	MatchCollection.prototype.add				    = function(match) {
        this.matchCollection.push(match);
        this.startDate = this.getStartDate();
		this.endDate = this.getEndDate();
	}

	MatchCollection.prototype.concat				= function(matches) {
        this.matchCollection = this.matchCollection.concat(matches.matchCollection);
	}
	
	MatchCollection.prototype.updateEventsByMatchId	= function(matchId, eHome, eAway) {
		for(var i = 0; i < this.matchCollection.length; i++) {
			if(this.matchCollection[i].id == matchId)
				this.matchCollection[i].setAllEvents(eHome, eAway);
		}		
	}
	
	MatchCollection.prototype.sortMatchCollection	= function(mCollec) {
		var totalMatches = [];
		for(var i = 0; i < Database.followingLeagues.length; i++) {
			var leagueMatches = [];
			for(var j = 0; j < mCollec.length; j++) {
				if(Database.followingLeagues[i].name == mCollec[j].league) {
					leagueMatches.push(mCollec[j]);
				}					
			}
			leagueMatches.sort(function(a, b) {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			});
			totalMatches = totalMatches.concat(leagueMatches);
		}
		return totalMatches;
	}
	
	module.exports = MatchCollection;