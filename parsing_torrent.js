
// parsing_torrent.js
// ========

var request		= require('request'),
	cheerio		= require('cheerio');
	

const Episode			= require("./entity/Episode.js");
const InfoTorrent		= require("./entity/InfoTorrent.js");
const TvShow 			= require("./entity/TvShow.js");
const TvShowCollection	= require("./entity/TvShowCollection.js");
const Server_MongoDB 	= require('./server_mongodb');
const tvShowNum = 2465;


// ----------###---------- EZTY TORRRENT WEB SIDE ----------###---------- 

exports.getTvShowList				= function(callback) {
	exports.tvShowCollection = new TvShowCollection();
	var url = "https://eztv.ag/showlist/";
	var requestOptions  = { encoding: null, method: "GET", uri: url};
	request(requestOptions, function (error, response, html) {
		if (!error) {
			console.log("INSIDE");
			var $ = cheerio.load(html);
			$(".forum_header_border").eq(1).find("tr").filter(function() {
				if($(this).attr("name") == "hover") {
					var name = $(this).find("a").text();
					var href = "https://eztv.ag" + $(this).find("a").attr("href");
					var rating = $(this).find("b").text();
					var state = $(this).find("font").text();
					var tvShow = new TvShow(name, href, state, rating);
					exports.tvShowCollection.add(tvShow);
				}
			});
			console.log("--> Getting all shows: " + exports.tvShowCollection.getLength());
			callback();
		} else {
			console.log(error);
		}
	});
}

exports.updateTvShowList			= function(callback) {
	exports.getTvShowList(function() {
		Server_MongoDB.FindAll_TvShow(function(result) {
			if(exports.tvShowCollection.getLength() > result.getLength()) {
				Server_MongoDB.DeleteAll_TvShow(function() {
					Server_MongoDB.InsertMany_TvShow(exports.tvShowCollection.getList(), function(newLength) {
						var diff = newLength - result.getLength();
						console.log("Updating List.... " + diff + " added");
						callback();
					});
				});
			} else {
				console.log("No update needed");
				callback();
			}
		});
	});
}

exports.getTvShowByUrl_OnlyEztv		= function(showUrl, callback) {
	var refName = "";
	var requestOptions  = { encoding: null, method: "GET", uri: showUrl };
	request(requestOptions, function (error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);
			var tables		= $(".section_thread_post").find("table");
			var name		= $(".section_post_header").find("span").text().split(" (")[0];
			var state		= $(".show_info_airs_status").find("b").eq(1).text();
			var rating		= $(".show_info_rating_score").find("span").eq(0).text();
			var img 	 	= tables.eq(0).find(".show_info_main_logo").find("img").attr("data-cfsrc");
			var torrents	= tables.eq(4).find("tr");
			if(!tables.eq(1).find("td").eq(0).find("div").eq(1).html())
				console.log("Show Info Text Undefinded. Try again later!");
			else 
				var infoText = tables.eq(1).find("td").eq(0).find("div").eq(1).html().split("<br>");
			
			var tvShow = new TvShow(name, showUrl, state, rating);
			tvShow.setImage(img);
			
			$("body").html("<span id='divConverter'></span>");
			for(var i = 0; i < infoText.length; i++) {
				if((!infoText[i].includes("<div")) && (!infoText[i].includes("TBA")) && (infoText[i].length > 0)) {
					var parts 	= infoText[i].split(" -- ");
					var num 	= parts[0].split("x")[1];
					var season 	= parts[0].split("x")[0];
					var date 	= parts[1];
					$("#divConverter").html(parts[2]);
					var name = $("#divConverter").text();
					var ch = new Chapter(season, num, name, date);
					tvShow.addChapter(ch);
				}		
			}
			torrents.filter(function() {
				if($(this).attr("name") == "hover") {
					var name = $(this).find("td").eq(1).find("a").text();
					var chpData	= parseEpisodeName(name);
					var magnet 	= $(this).find("td").eq(2).find("a").eq(0).attr("href");
					var file 	= $(this).find("td").eq(2).find("a").eq(1).attr("href");
					var size 	= $(this).find("td").eq(3).text();
					var torrCh 	= new InfoTorrent(chpData.type, magnet, file, size);
					tvShow.addInfoTorrent(chpData.season, chpData.num, torrCh);
				}
			});
			callback(tvShow);
		}
	});
	
	function parseEpisodeName(name) {
		var fpos = name.length - 5;
		for(var i = name.length - 5; i > -1; i--) {
			if((name[i] == "E") || (name[i] == "x")) {
				fpos = i + 4;
				var num = name[i+1] + name[i+2];
				if(!isNaN(parseFloat(num))) {
					if((name[i-2] == "S") || (name[i-2] == " ")) {
						var season = name[i-1];
						return { season: season, num: num, type: name.substring(fpos).split(" [eztv]")[0] };
					} else if((name[i-3] == "S") || (name[i-3] == " ")) {
						var season = name[i-2] + name[i-1];
						return { season: season, num: num, type: name.substring(fpos).split(" [eztv]")[0] };
					}
				}
			}
		}
		console.log("NOTHIG");
	}
}

exports.getTvShowByUrl_IMDB			= function(showUrl, callback) {
	var requestOptions  = { encoding: null, method: "GET", uri: showUrl };
	request(requestOptions, function (error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);
			var tables		= $(".section_thread_post").find("table");
			var name		= $(".section_post_header").find("span").text().split(" (")[0];
			var state		= $(".show_info_airs_status").find("b").eq(1).text();
			var rating		= $(".show_info_rating_score").find("span").eq(0).text();
			var imdb_href	= $(".show_info_rating_score").find("a").eq(0).attr("href");
			var img 	 	= tables.eq(0).find(".show_info_main_logo").find("img").attr("data-cfsrc");
			var torrents	= tables.eq(4).find("tr");

			var tvShow = new TvShow(name, showUrl, state, rating);
			tvShow.setImage(img);
			tvShow.setImdbHref(imdb_href);
			parsingIMDB(tvShow, function() {
				torrents.filter(function() {
					if($(this).attr("name") == "hover") {
						var name = $(this).find("td").eq(1).find("a").text();
						var epData	= parseEpisodeName(tvShow, name);
						if(epData) {
							var magnet 	= $(this).find("td").eq(2).find("a").eq(0).attr("href");
							var file 	= $(this).find("td").eq(2).find("a").eq(1).attr("href");
							var size 	= $(this).find("td").eq(3).text();
							var torrCh 	= new InfoTorrent(epData.type, magnet, file, size);
							tvShow.addInfoTorrent(epData.season, epData.num, torrCh);
						}
					}
				});
				callback(tvShow);
			});
		} else {
			console.log("Error in ETZV");
			console.log(error);
		}
	});

	function parsingIMDB(tvShow, callback) {
		var url = tvShow.imdb_href + "episodes";
		var requestOptions  = { encoding: null, method: "GET", uri: url };
		request(requestOptions, function (error, response, html) {
			if (!error) {
				var $ = cheerio.load(html);
				var seasons_num = $("#bySeason").find("option").length;
				console.log(" ### Total season: " + seasons_num);
				$("#bySeason").find("option").filter(function() {
					var season = $(this).val();
					goToSeason(tvShow, season, function(parsed_season) {
						seasons_num--;
						console.log("  #  Parsed season: " + parsed_season);
						if(seasons_num == 0) {
							callback();
						}
					});
				});
			} else {
				console.log("Error in IMDB");
				console.log(error);
			}
		});
	}

	function goToSeason(tvShow, ep_season, callback) {
		var url = tvShow.imdb_href + "episodes?season=" + ep_season;
		var requestOptions  = { encoding: null, method: "GET", uri: url };
		request(requestOptions, function (error, response, html) {
			if (!error) {
				var $ = cheerio.load(html);
				$(".list.detail.eplist").find(".list_item").filter(function() {
					var ep_href	 = "http://www.imdb.com" + $(this).find("a").eq(0).attr("href");
					var ep_title = $(this).find("a").eq(0).attr("title");
					var ep_img	 = $(this).find("img").eq(0).attr("src");
					var ep_rating = $(this).find(".ipl-rating-star__rating").eq(0).text();
					var ep_date = $(this).find(".airdate").text().replace(/(^[\s]+|[\s]+$)/g, '');
					var ep_num	= $(this).find("meta").eq(0).attr("content");
					var ep = new Episode(ep_season, ep_num, ep_title, ep_date, ep_href, ep_img, ep_rating);
					tvShow.addEpisode(ep);
				});
				callback(ep_season);
			}
		});
	}

	function parseEpisodeName(tvShow, name) {
		var fpos = name.length - 5;
		for(var i = name.length - 5; i > -1; i--) {
			if((name[i] == "E") || (name[i] == "x")) {
				fpos = i + 4;
				var num = name[i+1] + name[i+2];
				if(!isNaN(parseFloat(num))) {
					if((name[i-2] == "S") || (name[i-2] == " ")) {
						var season = name[i-1];
						return { season: season, num: num, type: name.substring(fpos).split(" [eztv]")[0] };
					} else if((name[i-3] == "S") || (name[i-3] == " ")) {
						var season = name[i-2] + name[i-1];
						return { season: season, num: num, type: name.substring(fpos).split(" [eztv]")[0] };
					}
				}
			}
		}
		var ep = tvShow.findNameInEpisodes(name);
		if(ep) {
			var type = name.split(ep.name + " ")[1];
			return { season: ep.season, num: ep.num, type: type };
		} else 
			return undefined;
	}
}

exports.getTvShowByUrl_IMDB_WithProgress	= function(showUrl, callback) {
	var requestOptions  = { encoding: null, method: "GET", uri: showUrl };
	request(requestOptions, function (error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);
			var tables		= $(".section_thread_post").find("table");
			var name		= $(".section_post_header").find("span").text().split(" (")[0];
			var state		= $(".show_info_airs_status").find("b").eq(1).text();
			var rating		= $(".show_info_rating_score").find("span").eq(0).text();
			var imdb_href	= $(".show_info_rating_score").find("a").eq(0).attr("href");
			var img 	 	= tables.eq(0).find(".show_info_main_logo").find("img").attr("data-cfsrc");
			var torrents	= tables.eq(4).find("tr");

			var tvShow = new TvShow(name, showUrl, state, rating);
			tvShow.setImage(img);
			tvShow.setImdbHref(imdb_href);
			parsingIMDB(tvShow, function() {
				torrents.filter(function() {
					if($(this).attr("name") == "hover") {
						var name = $(this).find("td").eq(1).find("a").text();
						var epData	= parseEpisodeName(tvShow, name);
						if(epData) {
							var magnet 	= $(this).find("td").eq(2).find("a").eq(0).attr("href");
							var file 	= $(this).find("td").eq(2).find("a").eq(1).attr("href");
							var size 	= $(this).find("td").eq(3).text();
							var torrCh 	= new InfoTorrent(epData.type, magnet, file, size);
							tvShow.addInfoTorrent(epData.season, epData.num, torrCh);
						}
					}
				});
				callback("TvShow", tvShow);
			});
		} else {
			console.log("Error in ETZV");
			console.log(error);
		}
	});

	function parsingIMDB(tvShow, childCallback) {
		var url = tvShow.imdb_href + "episodes";
		var requestOptions  = { encoding: null, method: "GET", uri: url };
		request(requestOptions, function (error, response, html) {
			if (!error) {
				var $ = cheerio.load(html);
				var seasons_num = $("#bySeason").find("option").length;
				tvShow.setTotalSeasons(seasons_num);
				callback("total" , seasons_num);
				$("#bySeason").find("option").filter(function() {
					var season = $(this).val();
					goToSeason(tvShow, season, function(parsed_season) {
						seasons_num--;
						callback("season", parseFloat(parsed_season));
						if(seasons_num == 0) {
							childCallback();
						}
					});
				});
			} else {
				console.log("Error in IMDB");
				console.log(error);
			}
		});
	}

	function goToSeason(tvShow, ep_season, callback) {
		var url = tvShow.imdb_href + "episodes?season=" + ep_season;
		var requestOptions  = { encoding: null, method: "GET", uri: url };
		request(requestOptions, function (error, response, html) {
			if (!error) {
				var $ = cheerio.load(html);
				$(".list.detail.eplist").find(".list_item").filter(function() {
					var ep_href	 = "http://www.imdb.com" + $(this).find("a").eq(0).attr("href");
					var ep_title = $(this).find("a").eq(0).attr("title");
					var ep_img	 = $(this).find("img").eq(0).attr("src");
					var ep_rating = $(this).find(".ipl-rating-star__rating").eq(0).text();
					var ep_date = $(this).find(".airdate").text().replace(/(^[\s]+|[\s]+$)/g, '');
					var ep_num	= $(this).find("meta").eq(0).attr("content");
					var ep = new Episode(ep_season, ep_num, ep_title, ep_date, ep_href, ep_img, ep_rating);
					tvShow.addEpisode(ep);
				});
				callback(ep_season);
			} else {
				console.log("Error in parsing season number " + ep_season);
				console.log(error);
			}
		});
	}

	function parseEpisodeName(tvShow, name) {
		var fpos = name.length - 5;
		for(var i = name.length - 5; i > -1; i--) {
			if((name[i] == "E") || (name[i] == "x")) {
				fpos = i + 4;
				var num = name[i+1] + name[i+2];
				if(!isNaN(parseFloat(num))) {
					if((name[i-2] == "S") || (name[i-2] == " ")) {
						var season = name[i-1];
						return { season: season, num: num, type: name.substring(fpos).split(" [eztv]")[0] };
					} else if((name[i-3] == "S") || (name[i-3] == " ")) {
						var season = name[i-2] + name[i-1];
						return { season: season, num: num, type: name.substring(fpos).split(" [eztv]")[0] };
					}
				}
			}
		}
		var ep = tvShow.findNameInEpisodes(name);
		if(ep) {
			var type = name.split(ep.name + " ")[1];
			return { season: ep.season, num: ep.num, type: type };
		} else 
			return undefined;
	}
}




exports.DeleteAndWriteShows		= function() {
	Server_MongoDB.DeleteAll_TvShow(function() {
		exports.getTvShowList(function() {
			Server_MongoDB.InsertMany_TvShow(exports.tvShowCollection.getList(), function() {

			});
		});
	});
}

exports.simpleRequest			= function() {
	var requestOptions  = { encoding: null, method: "GET", uri: "https://eztv.ag/shows/42/castle-2009/" };
	request(requestOptions, function (error, response, html) {
		console.log("DONE");
	});
}




