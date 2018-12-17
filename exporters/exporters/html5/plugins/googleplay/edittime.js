function GetPluginSettings()
{
	return {
		"name":			"Google Play",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"googleplay",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Access Google Play Game Services.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/175/google-play",
		"category":		"Platform specific",	// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"dependency":	"cordova.oauth2.js",
		"cordova-plugins": "cordova-plugin-inappbrowser",
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
				
AddCondition(0, cf_trigger, "On loaded", "Google Play Game Services", "On loaded", "Triggered when game services have loaded and are ready to use.", "OnLoaded");

AddCondition(1, cf_none, "Is loaded", "Google Play Game Services", "Is loaded", "True if 'On loaded' has fired and the plugin is ready to use.", "IsLoaded");

AddCondition(2, cf_trigger, "On signed in", "Google Play Game Services", "On signed in", "Triggered when the user successfully signs in.", "OnSignedIn");

AddCondition(3, cf_none, "Is signed in", "Google Play Game Services", "Is signed in", "True if the user is currently signed in.", "IsSignedIn");

AddCondition(4, cf_trigger, "On error", "Google Play Game Services", "On error", "Triggered if an error occurs in the game services.", "OnError");

AddCondition(5, cf_trigger, "On player details received", "Google Play Game Services", "On player details received", "Triggered after 'Request player details', when the response has been received.", "OnPlayerDetails");

AddCondition(6, cf_trigger, "On signed out", "Google Play Game Services", "On signed out", "Triggered when the user signs out.", "OnSignedOut");

AddCondition(7, cf_trigger, "On auto-sign in failed", "Google Play Game Services", "On auto-sign in failed", "Triggered on startup if the user could not be automatically logged in. It will be necessary to use the 'Sign in' action.", "OnAutoSignInFailed");

AddCondition(8, cf_trigger, "On score submit success", "Leaderboards", "On score submit success", "Triggered after a 'Submit score' action if the score was submitted successfully.", "OnScoreSubmitSuccess");

AddCondition(9, cf_trigger, "On score submit fail", "Leaderboards", "On score submit fail", "Triggered after a 'Submit score' action if the score failed to submitted successfully.", "OnScoreSubmitFail");

AddCondition(10, cf_trigger, "On hi-score request success", "Leaderboards", "On hi-score request success", "Triggered after a 'Request hi-scores' action if the scores were received successfully.", "OnHiScoreRequestSuccess");

AddCondition(11, cf_trigger, "On hi-score request fail", "Leaderboards", "On hi-score request fail", "Triggered after a 'Request hi-scores' action if the request failed.", "OnHiScoreRequestFail");

AddCondition(12, cf_trigger, "On achievement list success", "Achievements", "On achievement list success", "Triggered after a 'List achievements' action if the list received successfully.", "OnAchievementsRequestSuccess");

AddCondition(13, cf_trigger, "On achievement list fail", "Achievements", "On achievement list fail", "Triggered after a 'List achievements' action if the request failed.", "OnAchievementsRequestFail");

AddNumberParam("Index", "Index of the achievement.");
AddComboParamOption("hidden");
AddComboParamOption("revealed");
AddComboParamOption("unlocked");
AddComboParam("State", "The state of the achievement to test.");
AddCondition(14, cf_none, "Compare achievement state", "Achievements", "Achievement <i>{0}</i> is {1}", "Test if an achievement at an index is hidden, revealed or unlocked.", "CompareAchievementState");

AddCondition(15, cf_trigger, "On achievement metadata success", "Achievements", "On achievement metadata success", "Triggered after a 'Get metadata' action if the data received successfully.", "OnAchievementsMetadataSuccess");

AddCondition(16, cf_trigger, "On achievement metadata fail", "Achievements", "On achievement metadata fail", "Triggered after a 'Get metadata' action if the request failed.", "OnAchievementsMetadataFail");

AddStringParam("Achievement ID", "ID of the achievement that was revealed.")
AddCondition(17, cf_trigger, "On achievement revealed", "Achievements", "On achievement <b>{0}</b> revealed", "Triggered after 'Reveal' when the achievement has been successfully revealed.", "OnAchievementRevealed");

AddStringParam("Achievement ID", "ID of the achievement that was unlocked.")
AddCondition(18, cf_trigger, "On achievement unlocked", "Achievements", "On achievement <b>{0}</b> unlocked", "Triggered after 'Unlock' or when an incremental achievement's steps have been fulfilled.", "OnAchievementUnlocked");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddAction(0, af_none, "Request player details", "Google Play Game Services", "Request player details", "If signed in, request the details of the signed in player.", "RequestPlayerDetails");

AddAction(1, af_none, "Sign in", "Google Play Game Services", "Sign in", "Request the player to sign in.", "SignIn");

AddAction(2, af_none, "Sign out", "Google Play Game Services", "Sign out", "Sign out if already signed in.", "SignOut");

AddStringParam("Leaderboard ID", "Leaderboard ID to submit the score to.");
AddNumberParam("Score", "The score to submit to the leaderboard.");
AddStringParam("Tag", "Up to 64 extra characters to submit along with this score.");
AddAction(3, af_none, "Submit score", "Leaderboards", "Submit score <b>{1}</b> (tag <i>{2}</i>) to leaderboard <i>{0}</i>", "Submit a score to a leaderboard.", "SubmitScore");

AddStringParam("Leaderboard ID", "Leaderboard ID to submit the score to.");
AddComboParamOption("public");
AddComboParamOption("social");
AddComboParam("Collection", "Whether to return all scores, or scores relating to the current player.");
AddComboParamOption("all-time");
AddComboParamOption("weekly");
AddComboParamOption("daily");
AddComboParam("Time span", "Return the top scores in the given time span.");
AddNumberParam("Results", "The number of score results to return, from 1 to 25.", "25");
AddComboParamOption("top");
AddComboParamOption("window");
AddComboParam("Type", "Return the top scores, or a window of the scores around the current player's best score.");
AddAction(4, af_none, "Request hi-scores", "Leaderboards", "Request {1} {2} hi-scores from <b>{0}</b> (<i>{3}</i> results, <i>{4}</i>)", "Request a list of scores from a leaderboard.", "RequestHiScores");

AddComboParamOption("all");
AddComboParamOption("hidden");
AddComboParamOption("revealed");
AddComboParamOption("unlocked");
AddComboParam("Which", "Which achievements to request a list of.");
AddAction(5, af_none, "List achievements", "Achievements", "Request list of {0} achievements", "Request a list of achievements for the current player.", "RequestAchievements");

AddAction(6, af_none, "Get metadata", "Achievements", "Request achievements metadata", "Request achievements metadata (name, description etc.) allowing the corresponding expressions to return the correct values.", "RequestAchievementMetadata");

AddStringParam("Achievement ID", "Achievement ID to reveal.");
AddAction(7, af_none, "Reveal", "Achievements", "Reveal achievement <b>{0}</b>", "Reveal a hidden achievement.", "RevealAchievement");

AddStringParam("Achievement ID", "Achievement ID to unlock.");
AddAction(8, af_none, "Unlock", "Achievements", "Unlock achievement <b>{0}</b>", "Unlock an achievement.", "UnlockAchievement");

AddStringParam("Achievement ID", "Achievement ID to increment.");
AddNumberParam("Steps", "Number of steps to increment the achievement by.");
AddAction(9, af_none, "Increment", "Achievements", "Increment achievement <b>{0}</b> by <i>{1}</i> steps", "Add steps to an incremental achievement.", "IncrementAchievement");

AddStringParam("Achievement ID", "Achievement ID to increment.");
AddNumberParam("Steps", "Number of steps to set the achievement progress to. The steps cannot be reduced.");
AddAction(10, af_none, "Set steps", "Achievements", "Set achievement <b>{0}</b> steps to <i>{1}</i>", "Set the steps progress of an incremental achievement.", "SetStepsAchievement");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "", "Google Play Game Services", "ErrorMessage", "In 'On error', return the error message if available.");

AddExpression(1, ef_return_string, "", "Player details", "MyID", "The ID of the signed in player.");
AddExpression(2, ef_return_string, "", "Player details", "MyDisplayName", "The display name of the signed in player.");
AddExpression(3, ef_return_string, "", "Player details", "MyAvatarUrl", "The URL to the avatar image of the signed in player.");
AddExpression(4, ef_return_string, "", "Player details", "MyGivenName", "The given name of the signed in player.");
AddExpression(5, ef_return_string, "", "Player details", "MyFamilyName", "The family name of the signed in player.");

AddExpression(6, ef_return_number, "", "Hi-scores", "HiScoreTotalCount", "The total number of scores in the leaderboard.");
AddExpression(7, ef_return_number, "", "Hi-scores", "HiScoreMyBest", "The current player's best score on the returned leaderboard.");
AddExpression(8, ef_return_string, "", "Hi-scores", "HiScoreMyBestTag", "The tag for the current player's best score.");
AddExpression(9, ef_return_number, "", "Hi-scores", "HiScoreCount", "The number of scores returned for the current page.");

AddNumberParam("Index", "Score index");
AddExpression(10, ef_return_string, "", "Hi-scores", "HiScoreNameAt", "Player name at an index in the returned page.");

AddNumberParam("Index", "Score index");
AddExpression(11, ef_return_number, "", "Hi-scores", "HiScoreRankAt", "Score rank at an index in the returned page.");

AddNumberParam("Index", "Score index");
AddExpression(12, ef_return_number, "", "Hi-scores", "HiScoreAt", "Score value at an index in the returned page.");

AddNumberParam("Index", "Score index");
AddExpression(13, ef_return_string, "", "Hi-scores", "HiScoreTagAt", "Score tag at an index in the returned page.");

AddNumberParam("Index", "Score index");
AddExpression(14, ef_return_string, "", "Hi-scores", "HiScoreFormattedAt", "Formatted score value at an index in the returned page.");

AddNumberParam("Index", "Score index");
AddExpression(15, ef_return_string, "", "Hi-scores", "HiScoreFormattedRankAt", "Formatted score rank (e.g. \"1st\") at an index in the returned page.");

AddExpression(16, ef_return_string, "", "Hi-scores", "HiScoreMyFormattedBest", "The formatted version of the current player's best score.");
AddExpression(17, ef_return_number, "", "Hi-scores", "HiScoreMyBestRank", "The rank of the current player's best score.");
AddExpression(18, ef_return_string, "", "Hi-scores", "HiScoreMyBestFormattedRank", "The formatted rank (e.g. \"1st\") of the current player's best score.");

AddExpression(19, ef_return_number, "", "Achievements", "AchievementsCount", "The number of returned achievements in the list.");

AddNumberParam("Index", "Achievement index");
AddExpression(20, ef_return_string, "", "Achievements", "AchievementIDAt", "The ID of an achievement at an index.");

AddNumberParam("Index", "Achievement index");
AddExpression(21, ef_return_number, "", "Achievements", "AchievementStepsAt", "The current steps for an incremental achievement at an index.");

AddNumberParam("Index", "Achievement index");
AddExpression(22, ef_return_string, "", "Achievements", "AchievementNameAt", "The metadata name of an achievement at an index.");

AddNumberParam("Index", "Achievement index");
AddExpression(23, ef_return_string, "", "Achievements", "AchievementDescriptionAt", "The metadata description of an achievement at an index.");

AddNumberParam("Index", "Achievement index");
AddExpression(24, ef_return_string, "", "Achievements", "AchievementTypeAt", "The metadata type (\"standard\" or \"incremental\" of an achievement at an index.");

AddNumberParam("Index", "Achievement index");
AddExpression(25, ef_return_number, "", "Achievements", "AchievementTotalStepsAt", "The metadata total steps of an incremental achievement at an index.");

AddNumberParam("Index", "Achievement index");
AddExpression(26, ef_return_string, "", "Achievements", "AchievementRevealedIconURLAt", "The metadata icon image URL of a revealed achievement at an index.");

AddNumberParam("Index", "Achievement index");
AddExpression(27, ef_return_string, "", "Achievements", "AchievementUnlockedIconURLAt", "The metadata icon image URL of an unlocked achievement at an index.");

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
	new cr.Property(ept_text, 	"Application ID",	"",		"The application ID from Google Play Developer Console."),
	new cr.Property(ept_text, 	"Client ID",		"",		"The client ID from Google Play Developer Console."),
	new cr.Property(ept_text, 	"Client secret",	"",		"The client secret from Google Play Developer Console.")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
};

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
};

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
};

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
};

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
};

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
};

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
};

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
};

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
};