
    var request	= require('request'),
    cheerio		= require('cheerio');

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
	function Team(name, country, href, shield) {
        this.name = name;
        this.country = country;
        this.href = href;
        this.shield = shield;

        this.id = "";
		this.points = 0;
		this.played = 0;
		this.win = 0;
		this.draw = 0;
		this.loss = 0;
		this.fgoals = 0;
        this.agoals = 0;
        this.webName = "";
    }

    Team.prototype.Json2Object				= function(json) {
		this.id = json._id;
        this.name = json.name;
        this.points = json.points;
        this.played = json.played;
        this.win = json.win;
        this.draw = json.draw;
        this.loss = json.loss;
        this.fgoals = json.fgoals;
        this.agoals = json.agoals;
        this.shield = json.shield;
        this.href = json.href;
        this.country = json.country;
        this.webName = json.webName;
		return this;
	}

    Team.prototype.addTeamInfo  = function(points, played, win, draw, loss, fgoals, agoals) {
        this.points = points;
		this.played = played;
		this.win = win;
		this.draw = draw;
		this.loss = loss;
		this.fgoals = fgoals;
        this.agoals = agoals;
    }

    Team.prototype.completeInfo = function() {
        var requestOptions  = { encoding: null, method: "GET", uri: this.href };
        request(requestOptions, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
            }
        });
    }
    

    module.exports = Team;