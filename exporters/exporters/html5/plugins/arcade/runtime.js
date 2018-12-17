// ECMAScript 5 strict mode
"use strict";
/////////////////////////////////////
// Plugin class
cr.plugins_.ScirraArcade = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	function parsm(){ if(!window.postMessage)return;window.parent.postMessage("score-submitted", "http://www.scirra.com");window.parent.postMessage("score-submitted", "https://www.scirra.com");window.parent.postMessage("score-submitted", "http://scirra.com");window.parent.postMessage("score-submitted", "https://scirra.com");};function ss2Param(a,c){
	var b="userID="+gpbn("u")+"&gameID="+gpbn("gameID")+"&score="+a+"&time="+c,d=rs(b.length,"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.[]{}/;&-=+_"),b=dx(sccc(b),d);jQuery.ajax({type:"POST",url:"http://www.scirra.com/handlers/arcadeProcessScore.ashx",data:"k="+b,success:function(a){a=dx(a,d);ss(a)},dataType:"text"})}function ss(a){
	jQuery.ajax({type:"POST",url:"http://www.scirra.com/handlers/arcadeProcessScore.ashx",data:"s="+a,success:function(){parsm()},dataType:"text"})}function sccc(a){for(var c="",b=0;b<a.length;b++)c+=a.charCodeAt(b)+",";return c.substring(0,c.length-1)}function rs(a,c){for(var b="",d=a;0<d;--d)b+=c[Math.round(Math.random()*(c.length-1))];return b}function cts(a){a=a.split(",");for(var c="",b=0;b<a.length;b++)c+=String.fromCharCode(a[b]);return c}
	function dx(a,c){for(var b=a.split(","),d="",e=0;e<b.length;e++)var f=String.fromCharCode(b[e]),g=c.charAt(e),f=f.charCodeAt(0)^g.charCodeAt(0),d=d+(f.toString()+",");return d.substring(0,d.length-1)}function gpbn(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=RegExp("[\\?&]"+a+"=([^&#]*)").exec(window.location.search);return null==a?"":decodeURIComponent(a[1].replace(/\+/g," "))};

	/////////////////////////////////////
	var pluginProto = cr.plugins_.ScirraArcade.prototype;
		
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
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnReceiveScores = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SubmitSingleScore = function (score)
	{
		if (!this.is_arcade)
			return;
		
		ss2Param(score, 0);
	};
	
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
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
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
	
	pluginProto.exps = new Exps();

}());