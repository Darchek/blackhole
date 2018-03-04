
	const Team = require("./Team.js");
	
	var teamCollection;

	// Constructor
	function TeamCollection() {
        this.teamCollection = [];
	}
	
	TeamCollection.prototype.Json2Object			= function(jsonCollection) {
		for(var i = 0; i < jsonCollection.length; i++) {
			var team = new Team().Json2Object(jsonCollection[i]);
			this.add(team);
		}
		return this;
	} 

    TeamCollection.prototype.getLength 				= function() {
		return this.teamCollection.length;
	}
	
	TeamCollection.prototype.add 					= function(team) {
		this.teamCollection.push(team);
	}
	
	TeamCollection.prototype.get 					= function(num) {
		return this.teamCollection[num];
	}
    

    module.exports = TeamCollection;