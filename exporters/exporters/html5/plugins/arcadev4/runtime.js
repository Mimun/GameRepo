// ECMAScript 5 strict mode
"use strict";
/////////////////////////////////////
// Plugin class
cr.plugins_.ScirraArcadeV4 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.ScirraArcadeV4.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.hiscoreResult = {};
		
		this.is_arcade = (typeof window["is_scirra_arcade"] !== "undefined");
	};
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	/*
	Cnds.prototype.OnReceiveScores = function ()
	{
		return true;
	};
	*/
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SubmitScore = function (leaderboardID, score)
	{
		if (!this.is_arcade || (!this.runtime.isRunningEvents && this.runtime.trigger_depth === 0)) return;
		var b=new XMLHttpRequest;b.onreadystatechange=function(){if(4===b.readyState&&200===b.status){var a=new XMLHttpRequest;a.onreadystatechange=function(){4===a.readyState&&200===a.status&&parent.postMessage("highscore|"+a.responseText.split("|")[1],"*")};a.open("POST","/handlers/leaderboard.ashx",!0);a.send("mode=auth&token="+b.responseText.split("|")[1])}};b.open("POST","/handlers/leaderboard.ashx",!0);
		b.send("gameID="+window["V4Arcade"]["gameID"]+"&token="+window["V4Arcade"]["playIdentity"]+"&leaderboard="+leaderboardID+"&score="+score+"&mode=init");
	};
	
	/*
	Acts.prototype.SubmitTimeScore = function(s)
	{
		if (!this.is_arcade)
			return;
		
		ss2Param(0, Math.round(s * 1000));
	};
	
	Acts.prototype.SubmitSingleScoreTimed = function(score, s)
	{
		if (!this.is_arcade)
			return;
		
		ss2Param(score, Math.round(s * 1000));
	};
	
	Acts.prototype.RequestHiScores = function(resultsPerPage, pageNum, guests)
	{
		if (!this.is_arcade)
			return;
		
		var self = this;
		
		jQuery.ajax({
			"type": 'GET',
			"url": 'http://www.scirra.com/handlers/getArcadeHighScores.ashx?gameID=' + getParameterByName('gameID') + '&page=' + pageNum + '&recordsPerPage=' + resultsPerPage + '&guests=' + guests,
			"success": function (returnData)
			{
				self.hiscoreResult = JSON.parse(returnData);
				self.runtime.trigger(cr.plugins_.ScirraArcade.prototype.cnds.OnReceiveScores, self);
			},
			"dataType": 'text'
		});
	};
	*/
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	/*
	Exps.prototype.HiScoreCount = function (ret)
	{
		if (this.hiscoreResult["scores"])
			ret.set_int(this.hiscoreResult["scores"].length);
		else
			ret.set_int(0);
	};
	
	Exps.prototype.HiScoreAt = function (ret, i)
	{
		i = Math.floor(i);
		
		if (this.hiscoreResult["scores"])
		{
			if (i < 0 || i >= this.hiscoreResult["scores"].length)
				ret.set_float(0);
			else
				ret.set_float(this.hiscoreResult["scores"][i]["Score"]);
		}
		else
			ret.set_float(0);
	};
	
	Exps.prototype.HiScoreNameAt = function (ret, i)
	{
		i = Math.floor(i);
		
		if (this.hiscoreResult["scores"])
		{
			if (i < 0 || i >= this.hiscoreResult["scores"].length)
				ret.set_string(0);
			else
				ret.set_string(this.hiscoreResult["scores"][i]["Username"]);
		}
		else
			ret.set_int(0);
	};
	
	Exps.prototype.HiScoreTimeAt = function (ret, i)
	{
		i = Math.floor(i);
		
		if (this.hiscoreResult["scores"])
		{
			if (i < 0 || i >= this.hiscoreResult["scores"].length)
				ret.set_float(0);
			else
				ret.set_float(this.hiscoreResult["scores"][i]["Time"] / 1000.0);
		}
		else
			ret.set_float(0);
	};
	
	Exps.prototype.HiScoreRankAt = function (ret, i)
	{
		i = Math.floor(i);
		
		if (this.hiscoreResult["scores"])
		{
			if (i < 0 || i >= this.hiscoreResult["scores"].length)
				ret.set_int(0);
			else
				ret.set_int(this.hiscoreResult["scores"][i]["Rank"]);
		}
		else
			ret.set_int(0);
	};
	*/
	
	pluginProto.exps = new Exps();

}());