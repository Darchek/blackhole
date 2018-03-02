
	var id;
	var league;
	var round;
	var date;
	var homeTeam;
	var awayTeam;
	var homeGoals;
	var awayGoals;
	var href;
	var channels;

	// Constructor
	function Match(league, round, date, homeTeam, awayTeam, href, channels) {
		this.id = "";
		this.league = league;
		this.round = round;
		this.date = date;
		this.homeTeam = homeTeam;
		this.awayTeam = awayTeam;
		this.href = href;
		this.homeGoals = 0;
		this.awayGoals = 0;
		this.channels = channels;
	}
	
	Match.prototype.getMatchGoals = function(hGoals, aGoals) {
		if(hGoals > 0)
			this.homeGoals = hGoals;
		if(aGoals > 0)
			this.awayGoals = aGoals;
	}
	
	module.exports = Match;