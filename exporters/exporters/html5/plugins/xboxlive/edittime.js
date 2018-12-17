function GetPluginSettings()
{
	return {
		"name":			"Xbox Live",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"XboxLive",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Access Xbox Live services for Windows 10 and Xbox.",
		"author":		"Scirra",
		"help url":		"https://www.scirra.com",
		"category":		"Platform specific",	// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
							
AddCondition(0, cf_none, "Is Xbox Live available", "Xbox Live", "Xbox Live is available", "Check if Xbox Live features are available.", "IsXboxLiveAvailable");

AddCondition(1, cf_trigger, "On sign in success", "Xbox Live", "On sign in success", "Triggered when sign in completes successfully.", "OnSignInSuccess");
AddCondition(2, cf_trigger, "On sign in error", "Xbox Live", "On sign in error", "Triggered when sign in fails to complete.", "OnSignInError");

AddCondition(8, cf_trigger, "On silent sign in success", "Xbox Live", "On silent sign in success", "Triggered when signing in silently completes successfully.", "OnSilentSignInSuccess");
AddCondition(9, cf_trigger, "On silent sign in error", "Xbox Live", "On silent sign in error", "Triggered when signing in silently fails to complete.", "OnSilentSignInError");

AddCondition(3, cf_none, "Is signed in", "Xbox Live", "Is signed in", "True if the user is currently signed in.", "IsSignedIn");

AddCondition(4, cf_trigger, "On presence success", "Xbox Live", "On presence update success", "Triggered when successfully set presence.", "OnPresenceUpdateSuccess");
AddCondition(5, cf_trigger, "On presence error", "Xbox Live", "On presence update error", "Triggered when failed to set presence.", "OnPresenceUpdateError");

AddCondition(6, cf_trigger, "On profile success", "Xbox Live", "On profile info success", "Triggered when retrieving profile information succeeded.", "OnProfileInfoSuccess");
AddCondition(7, cf_trigger, "On profile error", "Xbox Live", "On profile info error", "Triggered when retrieving profile information failed.", "OnProfileInfoError");

AddCondition(10, cf_trigger, "On leaderboard retrieved", "Statistics & leaderboards", "On leaderboard retrieved", "Triggered after 'Get leaderboard' when the leaderboard results are ready.", "OnLeaderboardSuccess");

AddCondition(11, cf_trigger, "On local user added", "Xbox Live", "On local user added", "Triggered when 'Request profile info' can be used.", "OnLocalUserAdded");

AddCondition(12, cf_trigger, "On achievement update success", "Achievements", "On achievement update success", "Triggered when updating an achievement completes successfully.", "OnUpdateAchievementSuccess");
AddCondition(13, cf_trigger, "On achievement update error", "Achievements", "On achievement update error", "Triggered when updating an achievement failed to complete.", "OnUpdateAchievementError");

AddCondition(14, cf_trigger, "On achievement list loaded", "Achievements", "On achievement list loaded", "Triggered after 'Get achievement list' when loaded successfully.", "OnAchievementListLoaded");
AddCondition(15, cf_trigger, "On achievement list error", "Achievements", "On achievement list error", "Triggered after 'Get achievement list' if it fails to load.", "OnAchievementListError");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddAction(0, af_none, "Sign in", "Xbox Live", "Sign in", "Prompt the user to sign in if they haven't signed in already.", "SignIn");

AddAction(3, af_none, "Sign in silently", "Xbox Live", "Sign in silently", "Attempt to automatically sign in the user without prompting. If this fails, a manual sign in is required.", "SignInSilently");

AddComboParamOption("not in title");
AddComboParamOption("in title");
AddComboParam("Presence", "Whether or not the user is present in the title.");
AddAction(1, af_none, "Set presence", "Xbox Live", "Set presence <b>{0}</b>", "Set the user's presence in the title.", "SetPresence");

AddAction(2, af_none, "Request profile info", "Xbox Live", "Request profile info", "Request user profile information such as their gamerscore.", "RequestProfileInfo");

AddStringParam("ID", "The ID of the statistic on the dashboard.");
AddComboParamOption("Integer");
AddComboParamOption("Float");
AddComboParamOption("String");
AddComboParam("Type", "The type of the statistic on the dashboard.");
AddAnyTypeParam("Value", "The value to set for the statistic.");
AddAction(4, af_none, "Set statistic", "Statistics & leaderboards", "Set statistic <b>{0}</b> to <i>{1}</i> <b>{2}</b>", "Set the value of a statistic. It must have been created in the dashboard.", "SetStatistic");

AddAction(5, af_none, "Request flush", "Statistics & leaderboards", "Request flush statistics to service", "By default, stats submit every 5 minutes. Use this action to request submission immediately.", "RequestFlushStatsToService");

AddStringParam("ID", "The ID of the statistic on the dashboard.");
AddNumberParam("Skip to rank", "The rank in the leaderboard to skip to. Use -1 to center on current user.");
AddNumberParam("Max items", "The maximum number of results to return.");
AddComboParamOption("Global");
AddComboParamOption("Favorites");
AddComboParamOption("People");
AddComboParam("Social group", "Which group of players to list scores from.");
AddAction(6, af_none, "Get leaderboard", "Statistics & leaderboards", "Get <i>{3}</i> leaderboard for <b>{0}</b> (skip to <i>{1}</i>, <i>{2}</i> items)", "Retrieve a sorted list of statistics and their associated users.", "GetLeaderboard");

AddStringParam("Achievement ID", "The ID of the achievement to update.");
AddNumberParam("Percent complete", "The completion percentage of the achievement. Use 100 to unlock the achievement.", "100");
AddAction(7, af_none, "Update achievement", "Achievements", "Update achievement <b>{0}</b> to <i>{1}</i> percent complete", "Update an achievement's progress, or unlock the achievement.", "UpdateAchievement");

AddComboParamOption("All");
AddComboParamOption("Unlocked only");
AddComboParam("Which", "Whether to retrieve all achievements or only unlocked ones.");
AddNumberParam("Skip", "Number of achievements in the list to skip.", "0");
AddNumberParam("Max items", "Maximum number of achievements to return in the list.", "100");
AddAction(8, af_none, "Get achievement list", "Achievements", "Get achievement list (<i>{0}</i>, skip {1}, max {2})", "Request a list of achievements. Triggers 'On achievement list loaded' when done.", "GetAchievementList");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "", "Xbox Live", "ErrorMessage", "Return the last error message, if any.");
AddExpression(1, ef_return_string, "", "Xbox User", "AgeGroup", "Return the user's age group.");
AddExpression(2, ef_return_string, "", "Xbox User", "GamerTag", "Return the user's gamertag.");
AddExpression(3, ef_return_string, "", "Xbox User", "WebAccountId", "Return the user's web account ID.");
AddExpression(4, ef_return_string, "", "Xbox User", "XboxUserId", "Return the user's Xbox user ID.");

AddExpression(5, ef_return_string, "", "Profile info", "UserAppDisplayName", "Return the user's display name for application UI.");
AddExpression(6, ef_return_string, "", "Profile info", "UserGameDisplayName", "Return the user's display name for game UI.");
AddExpression(8, ef_return_string, "", "Profile info", "UserAppDisplayPictureUri", "Return a URI to the user's display picture for application UI.");
AddExpression(9, ef_return_string, "", "Profile info", "UserGameDisplayPictureUri", "Return a URI to the user's display picture for game UI.");
AddExpression(7, ef_return_string, "", "Profile info", "GamerScore", "Return the user's gamerscore.");

AddStringParam("ID", "Statistic ID");
AddExpression(10, ef_return_any, "", "Statistics & leaderboards", "GetStatistic", "Return the value of a statistic for the current user.");

AddExpression(11, ef_return_string, "", "Statistics & leaderboards", "LeaderboardDisplayName", "The name of the leaderboard.");
AddExpression(12, ef_return_number, "", "Statistics & leaderboards", "LeaderboardTotalRows", "The total number of results on the whole leaderboard.");
AddExpression(13, ef_return_number, "", "Statistics & leaderboards", "LeaderboardResultCount", "The number of leaderboard results returned.");

AddNumberParam("Index", "Result index");
AddExpression(14, ef_return_string, "", "Statistics & leaderboards", "LeaderboardResultGamerTagAt", "The gamertag at a result index.");

AddNumberParam("Index", "Result index");
AddExpression(15, ef_return_string, "", "Statistics & leaderboards", "LeaderboardResultXboxUserIdAt", "The Xbox user ID at a result index.");

AddNumberParam("Index", "Result index");
AddExpression(16, ef_return_number, "", "Statistics & leaderboards", "LeaderboardResultRankAt", "The rank at a result index.");

AddNumberParam("Index", "Result index");
AddExpression(17, ef_return_string, "", "Statistics & leaderboards", "LeaderboardResultValueAt", "The value at a result index.");

AddExpression(18, ef_return_number, "", "Achievements", "AchievementListCount", "The number of achievements returned in 'On achievement list loaded'.");

AddNumberParam("Index", "index");
AddExpression(19, ef_return_string, "", "Achievements", "AchievementIDAt", "The ID of an achievement at an index.");

AddNumberParam("Index", "index");
AddExpression(20, ef_return_string, "", "Achievements", "AchievementNameAt", "The name of an achievement at an index.");

AddNumberParam("Index", "index");
AddExpression(21, ef_return_string, "", "Achievements", "AchievementLockedDescAt", "The locked description of an achievement at an index.");

AddNumberParam("Index", "index");
AddExpression(22, ef_return_string, "", "Achievements", "AchievementUnlockedDescAt", "The unlocked description of an achievement at an index.");

AddNumberParam("Index", "index");
AddExpression(23, ef_return_string, "", "Achievements", "AchievementVisibilityAt", "Either \"public\" or \"secret\" for an achievement at an index.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	// NOTE: Title ID is a uint32, but since ept_integer is a signed int32, and ept_float is a single-precision float, neither
	// has sufficient range to store all possible title IDs. Therefore simply use a string instead.
	new cr.Property(ept_text, 		"Title ID",		"0",	"The title ID (in decimal) that identifies this Xbox Live product."),
	new cr.Property(ept_text, 		"SCID",			"",		"The Service Configuration ID (SCID) for this Xbox Live product."),
	new cr.Property(ept_combo, 		"Xbox Live Creators Title",	"Yes",		"Enable for titles in the Xbox Live Creators Program. Disable for other titles (e.g. ID@Xbox).", "No|Yes")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}