// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.googleplay = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.googleplay.prototype;
		
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

	var applicationId = "";
	var clientId = "";
	var clientSecret = "";
	var isLoaded = false;
	var fireLoadedFirstTick = false;
	var isSignedIn = false;
	var lastError = "";
	var theInst = null;
	
	// Player details
	var my_playerid = "";
	var my_displayname = "";
	var my_avatarurl = "";
	var my_givenname = "";
	var my_familyname = "";
	
	// Hi-scores response
	var hiscores_total = 0;
	var hiscores_mybest = 0;
	var hiscores_myformattedbest = "";
	var hiscores_mybesttag = "";
	var hiscores_myrank = 0;
	var hiscores_myformattedrank = "";
	var hiscores_page = null;
	
	// Achievements response
	var achievements_page = null;
	var achievements_by_id = {};
	var achievement_trigger_id = "";
	
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	function addMetaTag(name, content)
	{
		var meta = document.createElement("meta");
		meta["name"] = name;
		meta["content"] = content;
		document.head.appendChild(meta);
	};
	
	function addScriptTag(src)
	{
		var s = document.createElement("script");
		s["type"] = "text/javascript";
		s["async"] = true;
		s["src"] = src;
		document.head.appendChild(s);
	};
	
	window["googlePlayLoadCallback"] = function ()
	{
		isLoaded = true;
		
		// If the script loads instantly (perhaps when cached) and there is not yet a running
		// layout, fire 'On loaded' on the first tick instead. Otherwise fire it right away.
		if (theInst.runtime.running_layout)
		{
			theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnLoaded, theInst);
		}
		else
		{
			fireLoadedFirstTick = true;
		}
	};
	
	window["googlePlaySigninCallback"] = function (auth)
	{
		if (auth["status"] && auth["status"]["signed_in"])
		{
			isSignedIn = true;
			theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnSignedIn, theInst);
		}
		else if (auth["error"] === "user_signed_out")
		{
			isSignedIn = false;
			lastError = "user_signed_out";
			theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnSignedOut, theInst);
		}
		else if (auth["error"] === "immediate_failed")
		{
			isSignedIn = false;
			lastError = "immediate_failed";
			theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAutoSignInFailed, theInst);
		}
		else
		{
			isSignedIn = false;
			lastError = auth["error"].toString();
			theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
		}
	};

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		applicationId = this.properties[0];
		clientId = this.properties[1];
		clientSecret = this.properties[2];
		
		if (this.runtime.isDomFree)
			return;		// cannot add meta tags in dom-free wrappers
		
		theInst = this;
		
		// Inject required meta tags
		addMetaTag("google-signin-clientid", clientId);
		addMetaTag("google-signin-cookiepolicy", "single_host_origin");
		addMetaTag("google-signin-callback", "googlePlaySigninCallback");
		addMetaTag("google-signin-scope", "https://www.googleapis.com/auth/games");
		
		// Start loading client script
		addScriptTag("https://apis.google.com/js/client.js?onload=googlePlayLoadCallback");
		
		this.runtime.tickMe(this);
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
	
	instanceProto.onLayoutChange = function ()
	{
		// When switching layout re-trigger 'On loaded' and 'On signed in' as appropriate
		if (isLoaded)
			this.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnLoaded, this);
		
		if (isSignedIn)
			this.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnSignedIn, this);
	};
	
	instanceProto.tick = function ()
	{
		if (fireLoadedFirstTick)
		{
			fireLoadedFirstTick = false;
			this.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnLoaded, this);
		}
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

	Cnds.prototype.OnLoaded = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsLoaded = function ()
	{
		return isLoaded;
	};
	
	Cnds.prototype.OnSignedIn = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnSignedOut = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsSignedIn = function ()
	{
		return isSignedIn;
	};
	
	Cnds.prototype.OnError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPlayerDetails = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAutoSignInFailed = function ()
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
	
	Cnds.prototype.OnHiScoreRequestSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnHiScoreRequestFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementsRequestSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementsRequestFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.CompareAchievementState = function (i, s)
	{
		var a = getAchievementAt(i);
		
		if (!a)
			return false;
		
		var str = a["achievementState"];
		
		if (s === 0)
			return str === "HIDDEN";
		if (s === 1)
			return str === "REVEALED";
		if (s === 2)
			return str === "UNLOCKED";
		
		return false;
	};
	
	Cnds.prototype.OnAchievementsMetadataSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementsMetadataFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnAchievementRevealed = function (id)
	{
		return achievement_trigger_id === id;
	};
	
	Cnds.prototype.OnAchievementUnlocked = function (id)
	{
		return achievement_trigger_id === id;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	function getErrorString(err)
	{
		if (typeof err === "string")
			return err;
		else if (typeof err["message"] === "string")
			return err["message"]
		else
			return "unknown";
	};
	
	Acts.prototype.RequestPlayerDetails = function ()
	{
		if (!isSignedIn)
			return;
		
		gapi["client"]["request"]({
			"path": "/games/v1/players/me",
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				my_playerid = response["playerId"] || "";
				my_displayname = response["displayName"] || "";
				my_avatarurl = response["avatarImageUrl"] || "";
				
				if (response["name"])
				{
					my_givenname = response["name"]["givenName"] || "";
					my_familyname = response["name"]["familyName"] || "";
				}
				else
				{
					my_givenname = "";
					my_familyname = "";
				}
				
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnPlayerDetails, theInst);
			}
		});
	};
	
	Acts.prototype.SignIn = function ()
	{
		if (!isLoaded || isSignedIn)
			return;
		
		// Hack to sign in with a web view
		if (this.runtime.isCordova)
		{
			jQuery["oauth2"]({
				"auth_url": 'https://accounts.google.com/o/oauth2/auth',
				"response_type": "code",
				"token_url": "https://accounts.google.com/o/oauth2/token",
				"logout_url": "https://accounts.google.com/logout",
				"client_id": clientId,			
				"client_secret": clientSecret,
				"redirect_uri": "http://localhost",
				"other_params": {"scope": "https://www.googleapis.com/auth/games"}		
			}, function(token, response) {
				gapi["auth"]["setToken"](response);
				
				isSignedIn = true;
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnSignedIn, theInst);			
			}, function(error, response) {
				isSignedIn = false;
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);			
			}); 
		}
		else
		{
			// Normal web-browser based sign-in flow
			gapi["auth"]["signIn"]({
				"callback": window["googlePlaySigninCallback"]
			});
		}
	};
	
	Acts.prototype.SignOut = function ()
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		// Hack to sign out with a web view
		if (this.runtime.isCordova)
		{
			gapi["auth"]["setToken"](null);
		
			isSignedIn = false;
			lastError = "user_signed_out";
			this.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnSignedOut, this);	
		}
		else
		{
			// normal web browser sign-out
			gapi["auth"]["signOut"]();
		}
	};
	
	Acts.prototype.SubmitScore = function (leaderboardId, score, tag)
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		var params = {
			"leaderboardId": leaderboardId,
			"score": score
		};
		
		if (tag)
			params["scoreTag"] = tag;
		
		gapi["client"]["request"]({
			"path": "/games/v1/leaderboards/" + leaderboardId + "/scores",
			"params": params,
			"method": "post",
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnScoreSubmitFail, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnScoreSubmitFail, theInst);
					return;
				}
				
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnScoreSubmitSuccess, theInst);
			}
		});
	};
	
	Acts.prototype.RequestHiScores = function (leaderboardId, collection, timespan, maxresults, type)
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		var collectionstr = (collection === 0 ? "PUBLIC" : "SOCIAL");
		var timespanstr = "ALL_TIME";
		
		if (timespan === 1)
			timespanstr = "WEEKLY";
		else if (timespan === 2)
			timespanstr = "DAILY";
		
		var params = {
			"leaderboardId": leaderboardId,
			"collection": collectionstr,
			"timeSpan": timespanstr,
			"maxResults": maxresults
		};
		
		var typestr = "scores";
		
		if (type === 1)
			typestr = "window";
		
		gapi["client"]["request"]({
			"path": "/games/v1/leaderboards/" + leaderboardId + "/" + typestr + "/" + collectionstr,
			"params": params,
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnHiScoreRequestFail, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnHiScoreRequestFail, theInst);
					return;
				}
				
				hiscores_total = parseInt(response["numScores"], 10) || 0;
				
				if (response["playerScore"])
				{
					hiscores_mybest = parseInt(response["playerScore"]["scoreValue"], 10) || 0;
					hiscores_myformattedbest = response["playerScore"]["formattedScore"] || "";
					hiscores_mybesttag = response["playerScore"]["scoreTag"] || "";
					hiscores_myrank = parseInt(response["playerScore"]["scoreRank"], 10) || 0;
					hiscores_myformattedrank = response["playerScore"]["formattedScoreRank"] || "";
				}
				else
				{
					hiscores_mybest = 0;
					hiscores_myformattedbest = "";
					hiscores_mybesttag = "";
					hiscores_myrank = 0;
					hiscores_myformattedrank = "";
				}
				
				hiscores_page = response["items"];
				
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnHiScoreRequestSuccess, theInst);
			}
		});
	};
	
	Acts.prototype.RequestAchievements = function (which)
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		var whichstr = "ALL";
		
		if (which === 1)
			whichstr = "HIDDEN";
		else if (which === 2)
			whichstr = "REVEALED";
		else if (which === 3)
			whichstr = "UNLOCKED";
		
		gapi["client"]["request"]({
			"path": "/games/v1/players/me/achievements",
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementsRequestFail, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementsRequestFail, theInst);
					return;
				}
				
				achievements_page = response["items"];
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementsRequestSuccess, theInst);
			}
		});
	};
	
	Acts.prototype.RequestAchievementMetadata = function ()
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		gapi["client"]["request"]({
			"path": "/games/v1/achievements",
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementsMetadataFail, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementsMetadataFail, theInst);
					return;
				}
				
				// Map returned data by achievement ID
				achievements_by_id = {};
				
				var i, len, a, items = response["items"];
				
				for (i = 0, len = items.length; i < len; ++i)
				{
					a = items[i];
					
					achievements_by_id[a["id"]] = {
						name: a["name"],
						description: a["description"],
						type: a["achievementType"],
						totalSteps: a["totalSteps"],
						revealedUrl: a["revealedIconUrl"],
						unlockedUrl: a["unlockedIconUrl"]
					};
				}
				
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementsMetadataSuccess, theInst);
			}
		});
	};
	
	Acts.prototype.RevealAchievement = function (id)
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		gapi["client"]["request"]({
			"path": "/games/v1/achievements/" + id + "/reveal",
			"method": "post",
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				achievement_trigger_id = id;
				theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementRevealed, theInst);
			}
		});
	};
	
	Acts.prototype.UnlockAchievement = function (id)
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		gapi["client"]["request"]({
			"path": "/games/v1/achievements/" + id + "/unlock",
			"method": "post",
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["newlyUnlocked"])
				{
					achievement_trigger_id = id;
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementUnlocked, theInst);
				}
			}
		});
	};
	
	Acts.prototype.IncrementAchievement = function (id, steps)
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		gapi["client"]["request"]({
			"path": "/games/v1/achievements/" + id + "/increment",
			"method": "post",
			"params": {
				"stepsToIncrement": steps
			},
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["newlyUnlocked"])
				{
					achievement_trigger_id = id;
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementUnlocked, theInst);
				}
			}
		});
	};
	
	Acts.prototype.SetStepsAchievement = function (id, steps)
	{
		if (!isLoaded || !isSignedIn)
			return;
		
		gapi["client"]["request"]({
			"path": "/games/v1/achievements/" + id + "/setStepsAtLeast",
			"method": "post",
			"params": {
				"steps": steps
			},
			"callback": function (response)
			{
				if (!response)
				{
					lastError = "no_response";
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["error"])
				{
					lastError = getErrorString(response["error"]);
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnError, theInst);
					return;
				}
				
				if (response["newlyUnlocked"])
				{
					achievement_trigger_id = id;
					theInst.runtime.trigger(cr.plugins_.googleplay.prototype.cnds.OnAchievementUnlocked, theInst);
				}
			}
		});
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(lastError);
	};
	
	Exps.prototype.MyID = function (ret)
	{
		ret.set_string(my_playerid);
	};
	
	Exps.prototype.MyDisplayName = function (ret)
	{
		ret.set_string(my_displayname);
	};
	
	Exps.prototype.MyAvatarUrl = function (ret)
	{
		ret.set_string(my_avatarurl);
	};
	
	Exps.prototype.MyGivenName = function (ret)
	{
		ret.set_string(my_givenname);
	};
	
	Exps.prototype.MyFamilyName = function (ret)
	{
		ret.set_string(my_familyname);
	};
	
	Exps.prototype.HiScoreTotalCount = function (ret)
	{
		ret.set_int(hiscores_total);
	};
	
	Exps.prototype.HiScoreMyBest = function (ret)
	{
		ret.set_int(hiscores_mybest);
	};
	
	Exps.prototype.HiScoreMyBestTag = function (ret)
	{
		ret.set_string(hiscores_mybesttag);
	};
	
	Exps.prototype.HiScoreMyFormattedBest = function (ret)
	{
		ret.set_string(hiscores_myformattedbest);
	};
	
	Exps.prototype.HiScoreMyBestRank = function (ret)
	{
		ret.set_int(hiscores_myrank);
	};
	
	Exps.prototype.HiScoreMyBestFormattedRank = function (ret)
	{
		ret.set_string(hiscores_myformattedrank);
	};
	
	Exps.prototype.HiScoreCount = function (ret)
	{
		ret.set_int(hiscores_page ? (hiscores_page.length || 0) : 0);
	};
	
	function getScoreAt(i)
	{
		if (!hiscores_page)
			return null;
		
		i = Math.floor(i);
		
		if (i < 0 || i >= hiscores_page.length)
			return null;
		
		return hiscores_page[i];
	};
	
	Exps.prototype.HiScoreNameAt = function (ret, i)
	{
		var s = getScoreAt(i);
		ret.set_string((s && s["player"]) ? (s["player"]["displayName"] || "") : "");
	};
	
	Exps.prototype.HiScoreRankAt = function (ret, i)
	{
		var s = getScoreAt(i);
		ret.set_int(s ? (parseInt(s["scoreRank"], 10) || 0) : 0);
	};
	
	Exps.prototype.HiScoreAt = function (ret, i)
	{
		var s = getScoreAt(i);
		ret.set_int(s ? (parseInt(s["scoreValue"], 10) || 0) : 0);
	};
	
	Exps.prototype.HiScoreTagAt = function (ret, i)
	{
		var s = getScoreAt(i);
		ret.set_string((s && s["scoreTag"]) ? (s["scoreTag"] || "") : "");
	};
	
	Exps.prototype.HiScoreFormattedAt = function (ret, i)
	{
		var s = getScoreAt(i);
		ret.set_string((s && s["formattedScore"]) ? (s["formattedScore"] || "") : "");
	};
	
	Exps.prototype.HiScoreFormattedRankAt = function (ret, i)
	{
		var s = getScoreAt(i);
		ret.set_string((s && s["formattedScoreRank"]) ? (s["formattedScoreRank"] || "") : "");
	};
	
	function getAchievementAt(i)
	{
		if (!achievements_page)
			return null;
		
		i = Math.floor(i);
		
		if (i < 0 || i >= achievements_page.length)
			return null;
		
		return achievements_page[i];
	};
	
	function getAchievementMetadataAt(i)
	{
		var a = getAchievementAt(i);
		
		if (!a)
			return null;
		
		var id = a["id"];
		
		if (!achievements_by_id.hasOwnProperty(id))
			return null;
		
		return achievements_by_id[id];
	};
	
	Exps.prototype.AchievementsCount = function (ret)
	{
		ret.set_int(achievements_page ? (achievements_page.length || 0) : 0);
	};
	
	Exps.prototype.AchievementIDAt = function (ret, i)
	{
		var a = getAchievementAt(i);
		ret.set_string(a ? (a["id"] || "") : "");
	};
	
	Exps.prototype.AchievementStepsAt = function (ret, i)
	{
		var a = getAchievementAt(i);
		ret.set_int(a ? (a["currentSteps"] || 0) : 0);
	};
	
	Exps.prototype.AchievementNameAt = function (ret, i)
	{
		var a = getAchievementMetadataAt(i);
		ret.set_string(a ? (a.name || "") : "");
	};
	
	Exps.prototype.AchievementDescriptionAt = function (ret, i)
	{
		var a = getAchievementMetadataAt(i);
		ret.set_string(a ? (a.description || "") : "");
	};
	
	Exps.prototype.AchievementTypeAt = function (ret, i)
	{
		var a = getAchievementMetadataAt(i);
		ret.set_string(a ? (a.type || "").toLowerCase() : "");
	};
	
	Exps.prototype.AchievementTotalStepsAt = function (ret, i)
	{
		var a = getAchievementMetadataAt(i);
		ret.set_int(a ? (a.totalSteps || 0) : 0);
	};
	
	Exps.prototype.AchievementRevealedIconURLAt = function (ret, i)
	{
		var a = getAchievementMetadataAt(i);
		ret.set_string(a ? (a.revealedUrl || "") : "");
	};
	
	Exps.prototype.AchievementUnlockedIconURLAt = function (ret, i)
	{
		var a = getAchievementMetadataAt(i);
		ret.set_string(a ? (a.unlockedUrl || "") : "");
	};
	
	pluginProto.exps = new Exps();

}());