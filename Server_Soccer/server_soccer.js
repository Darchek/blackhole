
// server_soccer.js
// ========

var request		= require('request'),
    cheerio		= require('cheerio');

const Team		        = require("../entity/Team.js");
const Match		        = require("../entity/Match.js");
const TeamCollection	= require("../entity/TeamCollection.js");   
const MatchCollection	= require("../entity/MatchCollection.js");   

exports.init_ServerSoccer			= function() {

    exports.parsing3Days(function(matches) {
		console.log(matches.getLength());
	});
}


exports.parsingClasification        = function(callback) {
    var teams = new TeamCollection();
    var url = "https://resultados.as.com/resultados/futbol/primera/clasificacion/";
	var requestOptions  = { encoding: null, method: "GET", uri: url};
	request(requestOptions, function (error, response, html) {
		if (!error) {
            var $ = cheerio.load(html);
            $(".tabla-datos.table-hover").find("tbody").find("tr").filter(function() {
                var name    = $(this).find(".nombre-equipo").text();
                var shield  = $(this).find(".cont-img-escudo").find("img").attr("src");
                var points  = parseFloat($(this).find("td").eq(0).text());
                var played  = parseFloat($(this).find("td").eq(1).text());
                var win     = parseFloat($(this).find("td").eq(2).text());
                var draw    = parseFloat($(this).find("td").eq(3).text());
                var loss    = parseFloat($(this).find("td").eq(4).text());
                var fgoals  = parseFloat($(this).find("td").eq(5).text());
                var agoals  = parseFloat($(this).find("td").eq(6).text());
                var t = new Team(name, points, played, win, draw, loss, fgoals, agoals, shield, "Spain");
                teams.add(t);
            });
            callback(teams);
        }
    });
}

exports.parsingMatchesByDay         = function(date, callback) {
	var matches	    = new MatchCollection();
	var day 		= date.getDate();
	var month 		= date.getUTCMonth() + 1;
	var year 		= date.getUTCFullYear();
	var url 		= "https://resultados.as.com/resultados/" + year + "/" + month + "/" + day + "/";
	var requestOptions  = { encoding: null, method: "GET", uri: url};
	request(requestOptions, function (error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);
			$(".cont-modulo.resultados").filter(function() {
				if(!$(this)[0].attribs.id.includes("futbol")) return;
				var league	= processCompeInfo($(this).find(".txt-competicion").text().replace(/(^[\s]+|[\s]+$)/g, ''));
				var round	= processStageInfo($(this).find(".txt-jornada"));
				if(!league) return;
				$(this).find(".list-resultado").filter(function() {
					var result 		= $(this).find("div").eq(1).find(".resultado").text().replace(/(^[\s]+|[\s]+$)/g, '');
					var startTime 	= $(this).find("div").eq(3).find("time").attr("content");
					var timeText	= $(this).find("div").eq(1).attr("class");
					var href 		= $(this).find("div").eq(1).find(".resultado").attr("href");
					var nChannels	= $(this).find("div").eq(3).find(".cont-tv").find("li").find("img");
					var channels 	= [];
					for(var i = 0; i < nChannels.length; i++) {
						channels.push(nChannels.eq(i).attr("alt"));
					}
				
					var homeName 	= $(this).find("div").eq(0).find(".nombre-equipo").text();
					var homeHref 	= $(this).find("div").eq(0).find("a").attr("href");
					var homeShield 	= $(this).find("div").eq(0).find(".cont-img-escudo").find("img").attr("src");
					var homeGoals 	= (result != "-") ? result.substr(0, 1) : "";
					var homeTeam 	= new Team().createMatch(homeName, homeShield, homeHref);
					//homeTeam		= Database.teamCollection.findTeamByName(homeTeam);
					
					var awayName 	= $(this).find("div").eq(2).find(".nombre-equipo").text();
					var awayHref 	= $(this).find("div").eq(2).find("a").attr("href");
					var awayShield 	= $(this).find("div").eq(2).find(".cont-img-escudo").find("img").attr("src");
					var awayGoals 	= (result != "-") ? result.substr(-1) : "";
					var awayTeam 	= new Team().createMatch(awayName, awayShield, awayHref);
					//awayTeam		= Database.teamCollection.findTeamByName(awayTeam);
					
					var match 		= new Match(league, round, new Date(startTime), homeTeam, awayTeam, href, channels);
					match.getMatchGoals(homeGoals, awayGoals);
					matches.add(match);
				});
			});
			if(matches.length != 0) {
				callback(matches);
			} else {
				console.log("NO MATCHES");
				callback("NO MATCHES");
			}
		}
	});
	
	function processCompeInfo(leagueName) {
		var league = exports.findFollowLeagues(leagueName);
		if(league) return league.name;
		return;	
	}
	
	function processStageInfo(stage) {
		var stageTxt 	= stage.text().replace(/(^[\s]+|[\s]+$)/g, '').split(" ");
		var matchNum	= (stageTxt[2] == "Ida") ? 1 : 2;		
		if(stageTxt[0] == "Jornada") {
			return stageTxt[1];
		} else if(stageTxt[0] == "Fase") {
			var hrefTxt	= stage.find("a").attr("href").split("grupos_a_");
			return hrefTxt[1];
		} else {
			if (stageTxt[0] == "Dieciseisavos") {
				return "16-" + matchNum;
			} else if (stageTxt[0] == "Octavos") {
				return "8-" + matchNum;
			} else if (stageTxt[0] == "Cuartos") {
				return "4-" + matchNum;
			} else if (stageTxt[0] == "Semifinal") {
				return "2-" + matchNum;
			} else if (stageTxt[0] == "Final") {
				return "1-" + matchNum;
			}
		}
	}

}

exports.parsing3Days                = function(callback) {
    var done_num = 3;
    var num_day = 1000*60*60*24;
	var now 	= new Date();
	exports.parsingMatchesByDay(now, callbackDay);
	exports.parsingMatchesByDay(new Date(now.getTime() + num_day), callbackDay);
	exports.parsingMatchesByDay(new Date(now.getTime() + 2*num_day), callbackDay);

    var matchCollection = new MatchCollection();
	function callbackDay(matches) {
        done_num--;
        matchCollection.concat(matches);
		if(done_num == 0) {
            callback(matchCollection);
		}		
	}
}


// ----------------- OTHERS -----------------------
	
exports.FollowLeagues       = [ 
    { name: "LaLiga Santander", type: "League" },
    { name: "LaLiga 1,2,3", 	type: "League" },
    { name: "Premier League", 	type: "League" },
    { name: "Champions League", type: "League&Round" },
    { name: "Europa League", 	type: "League&Round" }
];

exports.seasonYears         = "2017_2018";

exports.findFollowLeagues   = function(leagueName) {
    var league = exports.FollowLeagues.find(function(l) {
        return l.name == leagueName;		
    });
    if(league) {
        return league;
    }
}