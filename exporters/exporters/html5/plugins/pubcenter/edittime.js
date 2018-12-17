function GetPluginSettings()
{
	return {
		"name":			"pubCenter",
		"id":			"pubcenter",
		"version":		"1.0",
		"description":	"Show an ad from Microsoft pubCenter in a Windows Store app.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/185/pubcenter",
		"category":		"Monetisation",
		"type":			"object",
		"rotatable":	false,
		"flags":		pf_singleglobal
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

AddCondition(0, cf_none, "Is banner showing", "Ads", "Is banner showing", "True if a banner ad is currently showing.", "IsBannerShowing");

AddCondition(1, cf_trigger, "On ready", "Interstitial", "On interstitial ad ready", "Triggered when an interstitial ad is ready to be displayed.", "OnInterstitialReady");
AddCondition(2, cf_trigger, "On error", "Interstitial", "On interstitial ad error", "Triggered when an error occurs displaying an interstitial ad.", "OnInterstitialError");
AddCondition(3, cf_trigger, "On completed", "Interstitial", "On interstitial ad completed", "Triggered when an interstitial ad is completed.", "OnInterstitialCompleted");
AddCondition(4, cf_trigger, "On cancelled", "Interstitial", "On interstitial ad cancelled", "Triggered when an interstitial ad is cancelled.", "OnInterstitialCancelled");

/*
AddCmpParam("Comparison", "How to compare the current progress.");
AddNumberParam("Value", "Progress value to compare to.");
AddCondition(1, cf_none, "Compare progress", "Progress bar", "Progress {0} <i>{1}</i>", "Compare the current progress value.", "CompareProgress");
*/

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddComboParamOption("Top left");
AddComboParamOption("Top center");
AddComboParamOption("Top right");
AddComboParamOption("Left");
AddComboParamOption("Center");
AddComboParamOption("Right");
AddComboParamOption("Bottom left");
AddComboParamOption("Bottom center");
AddComboParamOption("Bottom right");
AddComboParam("Position", "Where to display the ad.", 3);
AddComboParamOption("160x600");
AddComboParamOption("250x250");
AddComboParamOption("300x250");
AddComboParamOption("300x600");
AddComboParamOption("728x90");
AddComboParam("Size", "Size of the ad to show, which should match the setting on pubCenter.");
AddAction(0, 0, "Show banner ad", "Ads", "Show banner ad at position <i>{0}</i> size <i>{1}</i>", "Show a banner ad on the screen while the game is running.", "ShowBanner");

AddAction(1, 0, "Hide banner ad", "Ads", "Hide banner ad", "Hide any currently showing banner ad.", "HideBanner");

AddStringParam("Ad unit ID", "An optional alternative ad unit ID to use for the interstitial. Leave empty to use the one set in the plugin's properties.");
AddComboParamOption("interstitial video ad");
AddComboParamOption("interstitial banner ad");
AddComboParam("Type", "The type of interstitial ad to prepare.");
AddAction(2, 0, "Prepare interstitial", "Interstitial", "Prepare {1} with ad unit ID <i>{0}</i>", "Start loading an interstitial ad in the background.", "PrepareInterstitial");

AddAction(3, 0, "Show interstitial", "Interstitial", "Show interstitial ad", "Show an interstitial ad that is ready.", "ShowInterstitial");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

//AddExpression(0, ef_return_number, "", "Progress bar", "Progress", "Current progress value.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Application ID",	"",		"Application ID from Microsoft PubCenter."),
	new cr.Property(ept_text,	"Ad unit ID",		"",		"Ad unit ID from Microsoft PubCenter.")
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
	this.just_inserted = false;
}

IDEInstance.prototype.OnCreate = function()
{
}

IDEInstance.prototype.OnInserted = function()
{
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}