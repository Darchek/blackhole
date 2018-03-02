
    var id;
    var name;
    var points;
    var played;
    var win;
    var draw;
    var loss;
    var fgoals;
    var agoals;
    var shield;
    var href;
    var country;
    var webName;

	// Constructor
	function Team(name, points, played, win, draw, loss, fgoals, agoals, shield, country) {
        this.id = "";
		this.name = name;
		this.points = points;
		this.played = played;
		this.win = win;
		this.draw = draw;
		this.loss = loss;
		this.fgoals = fgoals;
        this.agoals = agoals;
        this.shield = shield;
        this.country = country;
        this.webName = "";
        this.href = "";
    }

    Team.prototype.createMatch      = function(name, shield, href) {
        this.name = name;
        this.shield = shield;
        this.href = href;
    }
    

    module.exports = Team;