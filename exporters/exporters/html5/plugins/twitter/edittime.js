function GetPluginSettings()
{
	return {
		"name":			"Twitter",
		"id":			"Twitter",
		"version":		"1.0",
		"description":	"Create a 'Follow' or 'Tweet' button.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/176/twitter",
		"category":		"Platform specific",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"cordova-plugins": "cordova-plugin-inappbrowser",
		"flags":		pf_position_aces | pf_size_aces
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
				
AddCondition(0, cf_trigger, "On button loaded", "Twitter", "On button loaded", "Triggered when the button has loaded and is ready to display.", "OnLoaded");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the button.");
AddAction(0, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the button.", "SetVisible");

AddStringParam("Share", "The screen name, URL or hash tag to be used (without the @ or #).");
AddAction(1, af_none, "Set share", "Twitter", "Set share to <i>{0}</i>", "Set the 'Share' property.", "SetShare");

AddStringParam("Text", "The text to use in the tweet.");
AddAction(2, af_none, "Set text", "Twitter", "Set text to <i>{0}</i>", "Set the 'Text' property.", "SetText");

AddStringParam("Via", "The screen name to report the tweet as 'via', if applicable (without @).");
AddAction(3, af_none, "Set via", "Twitter", "Set via <i>{0}</i>", "Set the 'Via' property.", "SetVia");

AddStringParam("Hashtags", "Comma-separated extra hashtags to append without #, e.g. \"construct2,html5\"");
AddAction(4, af_none, "Set hashtags", "Twitter", "Set hashtags to <i>{0}</i>", "Set the 'Hashtags' property.", "SetHashtags");

AddAction(5, af_none, "Reload", "Twitter", "Reload button", "Reload the button so it uses any newly set parameters.", "Reload");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo,	"Type",			"Follow",	"The kind of button to create.", "Follow|Share|Mention|Hashtag"),
	new cr.Property(ept_text,	"Share",		"ConstructTeam",	"The screen name, URL or hash tag to be used with the button (without the @ or #)."),
	new cr.Property(ept_text,	"Text",			"My tweet text",	"The text to use in the tweet, if applicable to the button type."),
	new cr.Property(ept_text,	"Via",			"",			"A screen name to report the tweet as 'via', if applicable (without @)."),
	new cr.Property(ept_text,	"Hashtags",		"",			"Comma-separated extra hashtags to append without #, e.g. construct2,html5"),
	new cr.Property(ept_combo,	"Initial visibility",		"Visible",	"Choose whether the button is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_combo,	"Count",		"None",		"Whether to show a count for the share or follow buttons.", "None|Horizontal|Vertical"),
	new cr.Property(ept_combo,	"Size",			"Medium",	"Whether to use medium or large style.", "Medium|Large"),
	new cr.Property(ept_text,	"Language",		"en",		"An ISO 639-1 language code to use for the button.")
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
	this.font = null;
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(80, 30));
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
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
		
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	
	renderer.Fill(quad, cr.RGB(224, 224, 255));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	
	cr.quad.prototype.offset.call(quad, 0, 2);

	this.font.DrawText("Twitter " + this.properties["Type"],
						quad,
						cr.RGB(0, 0, 0),
						ha_center);
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}