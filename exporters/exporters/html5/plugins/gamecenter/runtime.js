// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.gamecenter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.gamecenter.prototype;
		
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
	
	var isSupported = false;
	var hadSuccessfulAuth = false;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		isSupported = (typeof window["gamecenter"] !== "undefined");
		
		if (!isSupported)
		{
			cr.logexport("[C2] Note: Game Center plugin not supported on this platform (only iOS via Cordova)");
		}
		
		this.userAlias = "";
		this.playerId = "";
		this.displayName = "";
		this.playerImageURL = "";
		this.achievementList = [];
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
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
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		/*
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
		*/
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		//if (name === "My property")
		//	this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnAuthSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAuthFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPlayerImageSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPlayerImageError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnScoreSubmitSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnScoreSubmitFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnShowLeaderboardSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnShowLeaderboardError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementReportSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementReportError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementResetSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementResetError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementList = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementListError = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Auth = function ()
	{
		if (!isSupported)
			return;
		
		var self = this;
		
		window["gamecenter"]["auth"](function (user)
		{
			// success
			self.userAlias = user["alias"] || "";
			self.playerId = user["playerID"] || "";
			self.displayName = user["displayName"] || "";
			hadSuccessfulAuth = true;
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAuthSuccess, self);
			
		}, function ()
		{
			// error
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAuthFail, self);
		});
	};
	
	Acts.prototype.RequestPlayerImage = function ()
	{
		if (!isSupported || !hadSuccessfulAuth)
			return;
		
		var self = this;
		
		window["gamecenter"]["getPlayerImage"](function (path)
		{
			// success
			self.playerImageURL = path || "";
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnPlayerImageSuccess, self);
			
		}, function ()
		{
			// error
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnPlayerImageError, self);
		});
	};
	
	Acts.prototype.SubmitScore = function (score_, leaderboardId_)
	{
		if (!isSupported || !hadSuccessfulAuth)
			return;
		
		var self = this;
		
		var data = {
			"score": score_,
			"leaderboardId": leaderboardId_
		};
		
		window["gamecenter"]["submitScore"](function ()
		{
			// success
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnScoreSubmitSuccess, self);
			
		}, function ()
		{
			// error
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnScoreSubmitFail, self);
		}, data);
	};
	
	Acts.prototype.ShowLeaderboard = function (leaderboardId_)
	{
		if (!isSupported || !hadSuccessfulAuth)
			return;
		
		var self = this;
		
		var data = {
			"leaderboardId": leaderboardId_
		};
		
		window["gamecenter"]["showLeaderboard"](function ()
		{
			// success
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnShowLeaderboardSuccess, self);
			
		}, function ()
		{
			// error
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnShowLeaderboardError, self);
		}, data);
	};
	
	Acts.prototype.ReportAchievement = function (achievementId_, percent_)
	{
		if (!isSupported || !hadSuccessfulAuth)
			return;
		
		var self = this;
		
		var data = {
			"achievementId": achievementId_,
			"percent": Math.floor(percent_).toString()		// doc says to use string, source code corroborates
		};
		
		window["gamecenter"]["reportAchievement"](function ()
		{
			// success
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAchievementReportSuccess, self);
			
		}, function ()
		{
			// error
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAchievementReportError, self);
		}, data);
	};
	
	Acts.prototype.ResetAchievements = function ()
	{
		if (!isSupported || !hadSuccessfulAuth)
			return;
		
		var self = this;
		
		window["gamecenter"]["resetAchievements"](function ()
		{
			// success
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAchievementResetSuccess, self);
			
		}, function ()
		{
			// error
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAchievementResetError, self);
		});
	};
	
	Acts.prototype.RequestAchievements = function ()
	{
		if (!isSupported || !hadSuccessfulAuth)
			return;
		
		var self = this;
		
		window["gamecenter"]["getAchievements"](function (result)
		{
			self.achievementList.length = 0;
			
			if (result)
			{
				for (var i = 0; i < result.length; ++i)
				{
					self.achievementList.push(result[i] || "");
				}
			}
			
			// success
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAchievementList, self);
			
		}, function ()
		{
			// error
			self.runtime.trigger(cr.plugins_.gamecenter.prototype.cnds.OnAchievementListError, self);
		}, {});
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.UserAlias = function (ret)
	{
		ret.set_string(this.userAlias);
	};
	
	Exps.prototype.PlayerID = function (ret)
	{
		ret.set_string(this.playerId);
	};
	
	Exps.prototype.UserDisplayName = function (ret)
	{
		ret.set_string(this.displayName);
	};
	
	Exps.prototype.PlayerImageURL = function (ret)
	{
		ret.set_string(this.playerImageURL);
	};
	
	Exps.prototype.AchievementCount = function (ret)
	{
		ret.set_int(this.achievementList.length);
	};
	
	Exps.prototype.AchievementAt = function (ret, i)
	{
		i = Math.floor(i);
		
		if (i < 0 || i > this.achievementList.length)
		{
			ret.set_string("");
		}
		else
		{
			ret.set_string(this.achievementList[i]);
		}
	};
	
	pluginProto.exps = new Exps();

}());