
    var teamCollection;

	// Constructor
	function TeamCollection() {
        this.teamCollection = [];
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