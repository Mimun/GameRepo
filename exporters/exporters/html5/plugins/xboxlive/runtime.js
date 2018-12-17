"use strict";

/////////////////////////////////////
// Plugin class
cr.plugins_.XboxLive = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// Check WinRT APIs are supported
	var isWinRT = !!window["Windows"];
	var Microsoft = window["Microsoft"];
	var MicrosoftXbox = null;
	var MicrosoftXboxServices = null;
	var xboxUser = null;
	var xboxLiveContext = null;
	var didAddLocalUser = false;
	
	// Saved profile info
	var profileAppDisplayName = "";
	var profileGameDisplayName = "";
	var profileAppPictureUri = "";
	var profileGamePictureUri = "";
	var profileGamerScore = "";
	
	var isXboxLiveAvailable = (isWinRT && Microsoft && Microsoft["Xbox"] && Microsoft["Xbox"]["Services"]);
	if (isXboxLiveAvailable)
	{
		MicrosoftXbox = Microsoft["Xbox"];
		MicrosoftXboxServices = MicrosoftXbox["Services"];
	}
	
	function getStatisticsManager()
    {
        return MicrosoftXboxServices["Statistics"]["Manager"]["StatisticManager"]["singletonInstance"];
    }
	
	var pluginProto = cr.plugins_.XboxLive.prototype;
		
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
		
		this.errorMessage = "";
		
		this.titleId = 0;
		this.scid = "";
		
		this.achievementList = [];
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// NOTE: in C2, the title ID is stored as text to ensure it can handle the full range of title IDs, which are
		// uint32s in the Xbox Live SDK (which neither ept_integer or ept_float can handle the full range for).
		// Convert the title ID back to a number when loading the property.
		this.titleId = parseFloat(this.properties[0].trim());
	    this.scid = this.properties[1];
		
		// Verify Xbox Live APIs are available
		if (isWinRT)
		{
			if (isXboxLiveAvailable)
			{
				console.info("[Xbox Live] Xbox Live Services appear to be available.");
				
				this.runtime.tickMe(this);		// tick to update APIs like stats manager
			}
			else
			{
				console.warn("[Xbox Live] WinRT is available, but Xbox Live is not available. Check the SDK dependencies are configured.");
			}
		}
		else
		{
			console.warn("[Xbox Live] WinRT is not available. Export as UWP app to use Xbox Live features.");
		}
	};
	
	instanceProto.tick = function ()
	{
		if (!xboxLiveContext || !xboxUser)
			return;

		var events = getStatisticsManager()["doWork"]();

		for (var i = 0, len = events.length; i < len; ++i)
		{
			var ev = events[i];
			var eventType = "unknown";
			switch (ev["eventType"]) {
			case 0:             // local user added
				eventType = "Local user added";
				this.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnLocalUserAdded, this);
				break;
			case 1:             // local user removed
				eventType = "Local user removed";
				break;
			case 2:             // stat update complete
				eventType = "Stat update complete";
				break;
			case 3:             // get leaderboard complete
				eventType = "Get leaderboard complete";
				this.lastLeaderboard = ev["eventArgs"]["result"];
				this.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnLeaderboardSuccess, this);
				break;
			}
			
			var errorState = "success";
			if (ev["errorCode"] !== 0)
			{
				errorState = "Error " + ev["errorCode"] + ": " + ev["errorMessage"];
			}
			
			console.log("[Xbox Statistics] Event: " + eventType + " (" + errorState + ")");
		}
	};
	
	instanceProto.getLeaderboardRowAt = function (i)
	{
		if (!this.lastLeaderboard)
			return null;
		
		var rows = this.lastLeaderboard["rows"];
		
		i = Math.floor(i);
		if (i < 0 || i >= rows.length)
			return null;
		
		return rows[i];
	};
	
	instanceProto.getAchievementAt = function (i)
	{
		i = Math.floor(i);
		if (i < 0 || i > this.achievementList.length)
			return null;
		
		return this.achievementList[i];
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

	Cnds.prototype.IsXboxLiveAvailable = function ()
	{
		return isXboxLiveAvailable;
	};
	
	Cnds.prototype.OnSignInSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnSignInError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnSilentSignInSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnSilentSignInError = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsSignedIn = function ()
	{
		return xboxUser && xboxUser["isSignedIn"];
	};
	
	Cnds.prototype.OnPresenceUpdateSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPresenceUpdateError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnProfileInfoSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnProfileInfoError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnLeaderboardSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnLocalUserAdded = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnUpdateAchievementSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnUpdateAchievementError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementListLoaded = function ()
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

	Acts.prototype.SignIn = function ()
	{
		if (!isXboxLiveAvailable || xboxLiveContext)
			return;
		
		var self = this;
		
		if (!xboxUser)
			xboxUser = new MicrosoftXboxServices["System"]["XboxLiveUser"]();
		
		xboxUser["signInAsync"](null).then(function (signInResult)
		{
			if (signInResult["status"] == MicrosoftXboxServices["System"]["SignInStatus"]["success"])
			{
				xboxLiveContext = new MicrosoftXboxServices["XboxLiveContext"](xboxUser);
				
				if (!didAddLocalUser)		// only call addLocalUser() once
				{
					getStatisticsManager()["addLocalUser"](xboxUser);
					didAddLocalUser = true;
				}
				
				self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnSignInSuccess, self);
			}
			else
			{
				self.errorMessage = "" + signInResult["status"];
				self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnSignInError, self);
			}
		}, function (err)
		{
			self.errorMessage = err["message"];
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnSignInError, self);
		});
	};
	
	Acts.prototype.SignInSilently = function ()
	{
		if (!isXboxLiveAvailable || xboxLiveContext)
			return;
		
		var self = this;
		
		if (!xboxUser)
			xboxUser = new MicrosoftXboxServices["System"]["XboxLiveUser"]();
		
		xboxUser["signInSilentlyAsync"](null).then(function (signInResult)
		{
			if (signInResult["status"] == MicrosoftXboxServices["System"]["SignInStatus"]["success"])
			{
				xboxLiveContext = new MicrosoftXboxServices["XboxLiveContext"](xboxUser);
				
				if (!didAddLocalUser)		// only call addLocalUser() once
				{
					getStatisticsManager()["addLocalUser"](xboxUser);
					didAddLocalUser = true;
				}
				
				self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnSilentSignInSuccess, self);
			}
			else
			{
				self.errorMessage = "" + signInResult["status"];
				self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnSilentSignInError, self);
			}
		}, function (err)
		{
			self.errorMessage = err["message"];
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnSilentSignInError, self);
		});
	};
	
	Acts.prototype.SetPresence = function (p)
	{
		if (!isXboxLiveAvailable || !xboxLiveContext)
			return;
		
		var self = this;
		xboxLiveContext["presenceService"]["setPresenceAsync"](!!p).then(function ()
		{
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnPresenceUpdateSuccess, self);
		}, function (err)
		{
			self.errorMessage = err["message"];
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnPresenceUpdateError, self);
		});
	};
	
	Acts.prototype.RequestProfileInfo = function ()
	{
		if (!isXboxLiveAvailable || !xboxLiveContext || !xboxUser)
			return;
		
		var self = this;
		xboxLiveContext["profileService"]["getUserProfileAsync"](xboxUser["xboxUserId"]).then(function (profileResult)
		{
			profileAppDisplayName = profileResult["applicationDisplayName"];
			profileGameDisplayName = profileResult["gameDisplayName"];
			profileAppPictureUri = profileResult["applicationDisplayPictureResizeUri"].toString();
			profileGamePictureUri = profileResult["gameDisplayPictureResizeUri"].toString();
			profileGamerScore = profileResult["gamerscore"];
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnProfileInfoSuccess, self);
		}, function (err)
		{
			self.errorMessage = err["message"];
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnProfileInfoError, self);
		});
	};
	
	Acts.prototype.SetStatistic = function (statId, type, value)
	{
		if (!isXboxLiveAvailable || !xboxLiveContext || !xboxUser)
			return;
		
		try {
			if (type === 0)			// integer
			{
				if (typeof value === "string")
					value = parseInt(value, 10);
				
				getStatisticsManager()["setStatisticIntegerData"](xboxUser, statId, Math.floor(value));
			}
			else if (type === 1)	// float
			{
				if (typeof value === "string")
					value = parseFloat(value);
				
				getStatisticsManager()["setStatisticNumberData"](xboxUser, statId, value);
			}
			else if (type === 2)	// string
			{
				getStatisticsManager()["setStatisticStringData"](xboxUser, statId, value.toString());
			}
		}
		catch (err)
		{
			console.error("[Xbox Live] Error setting statistic: ", err);
		}
	};
	
	Acts.prototype.RequestFlushStatsToService = function ()
	{
		if (!isXboxLiveAvailable || !xboxLiveContext || !xboxUser)
			return;
		
		getStatisticsManager()["requestFlushToService"](xboxUser);
	};
	
	Acts.prototype.GetLeaderboard = function (statId, skipToRank, maxItems, socialGroup)
	{
		if (!isXboxLiveAvailable || !xboxLiveContext || !xboxUser)
			return;
		
		try {
			var query = new MicrosoftXboxServices["Leaderboard"]["LeaderboardQuery"];
			if (skipToRank === -1)
				query["skipResultToMe"] = true;
			else
				query["skipResultToRank"] = skipToRank;

			query["maxItems"] = maxItems;
			query["order"] = 1;             // high to low
			
			if (socialGroup === 0)			// global
			{
				getStatisticsManager()["getLeaderboard"](xboxUser, statId, query);
			}
			else if (socialGroup === 1)		// favorites
			{
				getStatisticsManager()["getSocialLeaderboard"](xboxUser, statId, MicrosoftXboxServices["Social"]["SocialGroupConstants"]["favorite"], query);
			}
			else if (socialGroup === 2)		// people
			{
				getStatisticsManager()["getSocialLeaderboard"](xboxUser, statId, MicrosoftXboxServices["Social"]["SocialGroupConstants"]["people"], query);
			}
		}
		catch (err)
		{
			console.error("[Xbox Live] Error getting leaderboard: ", err);
		}
	};
	
	Acts.prototype.UpdateAchievement = function (achievementId, percentComplete)
	{
		if (!isXboxLiveAvailable || !xboxLiveContext || !xboxUser)
			return;
		
		percentComplete = cr.clamp(Math.floor(percentComplete), 0, 100);
		var self = this;
		
		xboxLiveContext["achievementService"]["updateAchievementAsync"](xboxUser["xboxUserId"], achievementId, percentComplete)
		.then(function ()
		{
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnUpdateAchievementSuccess, self);
		}, function (err)
		{
			console.error("[Xbox Live] Achievement update error: ", err);
			
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnUpdateAchievementError, self);
		});
	};
	
	Acts.prototype.GetAchievementList = function (which, skip, maxItems)
	{
		if (!isXboxLiveAvailable || !xboxLiveContext || !xboxUser)
			return;
		
		var unlockedOnly = (which === 1);
		skip = Math.floor(skip);
		maxItems = Math.floor(maxItems);
		var self = this;
		
		xboxLiveContext["achievementService"]["getAchievementsForTitleIdAsync"](
            xboxUser["xboxUserId"],
            this.titleId,
            MicrosoftXboxServices["Achievements"]["AchievementType"]["all"],
            unlockedOnly,
            MicrosoftXboxServices["Achievements"]["AchievementOrderBy"]["default"],
            skip,
            maxItems
        )
        .then(function (result)
        {
            self.achievementList = result.items;
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnAchievementListLoaded, self);
        }, function (err)
        {
            console.error("[Xbox Live] getAchievementsForTitleAsync error: ", err);
			self.runtime.trigger(cr.plugins_.XboxLive.prototype.cnds.OnAchievementListError, self);
        });
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(this.errorMessage);
	};
	
	Exps.prototype.AgeGroup = function (ret)
	{
		ret.set_string(xboxUser ? xboxUser["ageGroup"] : "");
	};
	
	Exps.prototype.GamerTag = function (ret)
	{
		ret.set_string(xboxUser ? xboxUser["gamertag"] : "");
	};
	
	Exps.prototype.WebAccountId = function (ret)
	{
		ret.set_string(xboxUser ? xboxUser["webAccountId"] : "");
	};
	
	Exps.prototype.XboxUserId = function (ret)
	{
		ret.set_string(xboxUser ? xboxUser["xboxUserId"] : "");
	};
	
	Exps.prototype.UserAppDisplayName = function (ret)
	{
		ret.set_string(profileAppDisplayName);
	};
	
	Exps.prototype.UserGameDisplayName = function (ret)
	{
		ret.set_string(profileGameDisplayName);
	};
	
	Exps.prototype.UserAppDisplayPictureUri = function (ret)
	{
		ret.set_string(profileAppPictureUri);
	};
	
	Exps.prototype.UserGameDisplayPictureUri = function (ret)
	{
		ret.set_string(profileGamePictureUri);
	};
	
	Exps.prototype.GamerScore = function (ret)
	{
		ret.set_string(profileGamerScore);
	};
	
	Exps.prototype.GetStatistic = function (ret, statId)
	{
		if (!isXboxLiveAvailable || !xboxLiveContext || !xboxUser)
		{
			ret.set_int(0);
			return;
		}

		try {
			var value = getStatisticsManager()["getStatistic"](xboxUser, statId);
			if (value["dataType"] === 1)		// number
				ret.set_any(value["asNumber"]);
			else								// string
				ret.set_any(value["asString"]);
		}
		catch (err)
		{
			ret.set_int(0);
		}
	};
	
	Exps.prototype.LeaderboardDisplayName = function (ret)
	{
		ret.set_string(this.lastLeaderboard ? this.lastLeaderboard["displayName"] : "");
	};
	
	Exps.prototype.LeaderboardTotalRows = function (ret)
	{
		ret.set_int(this.lastLeaderboard ? this.lastLeaderboard["totalRowCount"] : 0);
	};
	
	Exps.prototype.LeaderboardResultCount = function (ret)
	{
		ret.set_int(this.lastLeaderboard ? this.lastLeaderboard["rows"].length : 0);
	};
	
	Exps.prototype.LeaderboardResultGamerTagAt = function (ret, i)
	{
		var row = this.getLeaderboardRowAt(i);
		ret.set_string(row ? row["gamertag"] : "");
	};
	
	Exps.prototype.LeaderboardResultXboxUserIdAt = function (ret, i)
	{
		var row = this.getLeaderboardRowAt(i);
		ret.set_string(row ? row["xboxUserId"] : "");
	};
	
	Exps.prototype.LeaderboardResultRankAt = function (ret, i)
	{
		var row = this.getLeaderboardRowAt(i);
		ret.set_int(row ? row["rank"] : 0);
	};
	
	Exps.prototype.LeaderboardResultValueAt = function (ret, i)
	{
		var row = this.getLeaderboardRowAt(i);
		ret.set_string(row ? row["values"][0] : "");
	};
	
	Exps.prototype.AchievementListCount = function (ret)
	{
		ret.set_int(this.achievementList.length);
	};
	
	Exps.prototype.AchievementIDAt = function (ret, i)
	{
		var a = this.getAchievementAt(i);
		ret.set_string(a ? a["id"] : "");
	};
	
	Exps.prototype.AchievementNameAt = function (ret, i)
	{
		var a = this.getAchievementAt(i);
		ret.set_string(a ? a["name"] : "");
	};
	
	Exps.prototype.AchievementLockedDescAt = function (ret, i)
	{
		var a = this.getAchievementAt(i);
		ret.set_string(a ? a["lockedDescription"] : "");
	};
	
	Exps.prototype.AchievementUnlockedDescAt = function (ret, i)
	{
		var a = this.getAchievementAt(i);
		ret.set_string(a ? a["unlockedDescription"] : "");
	};
	
	Exps.prototype.AchievementVisibilityAt = function (ret, i)
	{
		var a = this.getAchievementAt(i);
		if (!a)
		{
			ret.set_string("");
			return;
		}
		
		ret.set_string(a["isSecret"] ? "secret" : "public");
	};
	
	pluginProto.exps = new Exps();

}());