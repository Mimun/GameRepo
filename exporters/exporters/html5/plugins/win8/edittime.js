function GetPluginSettings()
{
	return {
		"name":			"Windows Store",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"win8",					// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Access features specific to Windows Store apps.",
		"author":		"Scirra.com",
		"help url":		"http://www.scirra.com/manual/145/windows-8",
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
		
AddCondition(0, cf_none, "Is Windows 8 app", "Windows Store", "Is Windows 8 app", "True if the game is currently running specifically as a Windows 8 app (not including Windows 10).", "IsWindows8");

AddComboParamOption("fullscreen (landscape)");
AddComboParamOption("filled");
AddComboParamOption("snapped");
AddComboParamOption("fullscreen (portrait)");
AddComboParam("State", "The state to check. 'Filled' is the partial view when another app is snapped.");
AddCondition(1, cf_trigger | cf_deprecated, "On view state changed", "View state", "On view state <b>{0}</b>", "Triggered when app view state changes, e.g. snapped.", "OnViewStateChange");

AddComboParamOption("fullscreen (landscape)");
AddComboParamOption("filled");
AddComboParamOption("snapped");
AddComboParamOption("fullscreen (portrait)");
AddComboParam("State", "The state to check. 'Filled' is the partial view when another app is snapped.");
AddCondition(2, cf_deprecated, "Compare view state", "View state", "Is view state <b>{0}</b>", "Test the current app view state, e.g. if snapped.", "CompareViewState");

AddCondition(3, cf_trigger, "On data changed", "Roaming storage", "On roaming data changed", "Triggered when roaming storage has changed after syncing.", "OnDataChanged");

AddStringParam("Key","Enter the name of the key to check.", "\"\"");
AddCondition(4, cf_none, "Roaming key exists", "Roaming storage", "Roaming key {0} exists", "Check if a key exists in roaming storage (synced across devices).", "RoamingKeyExists");

AddCondition(5, cf_trigger, "On share", "Sharing", "On share", "Triggered when user presses the Share charm.  Respond with a share action in this event.", "OnShare");

AddCondition(6, cf_trigger, "On license changed", "Purchases", "On license changed", "Triggered when the status of the app's license changes.", "OnLicenseChanged");

AddCondition(7, cf_none, "Is trial", "Purchases", "Is trial", "True if the app is on a trial license and the trial has not expired.", "IsTrial");

AddCondition(8, cf_none, "Is licensed", "Purchases", "Is licensed", "True if the app has a valid license that has not expired.", "IsLicensed");

AddCondition(9, cf_none, "Is expired trial", "Purchases", "Is expired trial", "True if the app is in trial mode but has expired.", "IsExpiredTrial");

AddStringParam("Product ID", "A case-sensitive string of the product ID to test if purchased.");
AddCondition(10, cf_none, "Has product", "Purchases", "Has purchased {0}", "Test if the user has purchased a specific product.", "HasProduct");

AddCondition(11, cf_trigger, "On successful purchase", "Purchases", "On successful purchase", "Triggered after a purchase completes successfully.", "OnPurchaseSuccess");

AddCondition(12, cf_trigger, "On failed purchase", "Purchases", "On failed purchase", "Triggered after a purchase completes unsuccessfully (e.g. user cancelled).", "OnPurchaseFail");

AddCondition(13, cf_trigger, "On store listing received", "Purchases", "On store listing received", "Triggered after 'Request store listing' when the store listing expressions can be used.", "OnStoreListing");

//AddCondition(11, cf_trigger, "On Preferences", "Settings charm", "On preferences", "Triggered when the user selects the Preferences option in the Settings charm, if enabled.", "OnPreferences");

AddCondition(14, cf_none, "Is Windows Store app", "Windows Store", "Is Windows Store app", "True if the game is currently running as a Windows 8/8.1/10+ Store app.", "IsWindowsStoreApp");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddAction(0, af_deprecated, "Try unsnap", "View state", "Try unsnap", "Try to unsnap if in snapped state. Only works if app running in foreground.", "TryUnsnap");

AddStringParam("Key", "Enter the name of the key to associate the value with.", "\"\"");
AddAnyTypeParam("Value","Enter the value to store.", "\"\"");
AddAction(1, af_none, "Set roaming value", "Roaming storage", "Set roaming key {0} to {1}", "Store a value in roaming storage, synced across devices.", "SetRoamingValue");

AddStringParam("Key", "Enter the name of the key to remove.", "\"\"");
AddAction(2, af_none, "Remove roaming value", "Roaming storage", "Remove roaming key {0}", "Remove a key from roaming storage.", "RemoveRoamingValue");

AddAction(3, af_none, "Clear roaming data", "Roaming storage", "Clear roaming data", "Remove all roaming keys.", "ClearRoamingData");

AddAction(4, af_none, "Show share UI", "Sharing", "Show share UI", "Invoke the Share charm UI.", "ShowShareUI");

AddStringParam("Title", "Title of the share.");
AddStringParam("Description", "Description of the share.");
AddStringParam("Text", "The text to share.");
AddAction(5, af_none, "Share text", "Sharing", "Share text <i>{2}</i> (title {0}, description {1})", "In an 'On share' event, share some text.", "ShareText");

AddStringParam("Title", "Title of the share.");
AddStringParam("Description", "Description of the share.");
AddStringParam("URI", "The URI to share.", "\"http://\"");
AddAction(6, af_none, "Share link", "Sharing", "Share link <i>{2}</i> (title {0}, description {1})", "In an 'On share' event, share a URI.", "ShareLink");

AddStringParam("Title", "Title of the share.");
AddStringParam("Description", "Description of the share.");
AddStringParam("HTML", "A string of HTML formatted text to share.");
AddAction(7, af_none, "Share HTML", "Sharing", "Share HTML <i>{2}</i> (title {0}, description {1})", "In an 'On share' event, share some HTML formatted text.", "ShareHTML");

AddStringParam("Title", "Title of the share.");
AddStringParam("Description", "Description of the share.");
AddObjectParam("Sprite", "Choose a sprite to share the image from.");
AddAction(9, af_none, "Share sprite image", "Sharing", "Share image from {2} (title {0}, description {1})", "In an 'On share' event, share an image from a Sprite object.", "ShareSpriteImage");

AddStringParam("Title", "Title of the share.");
AddStringParam("Description", "Description of the share.");
AddStringParam("Data URI", "The data URI to share, e.g. a canvas snapshot.");
AddAction(10, af_none, "Share data URI", "Sharing", "Share data URI <i>{2}</i> (title {0}, description {1})", "In an 'On share' event, share a data URI, e.g. a canvas snapshot.", "ShareDataUri");

AddStringParam("Text", "Error message to show as to why the share failed.");
AddAction(8, af_none, "Fail share", "Sharing", "Fail share with message <i>{0}</i>", "In an 'On share' event, use to indicate an error when something cannot be shared.", "FailShare");

AddComboParamOption("TileSquareBlock (2 texts)");
AddComboParamOption("TileSquareText02 (2 texts)");
AddComboParamOption("TileSquareText04 (1 text)");
AddComboParamOption("TileWideText03 (1 text)");
AddComboParamOption("TileWideText04 (1 text)");
AddComboParamOption("TileWideText09 (2 texts)");
AddComboParam("Template", "Choose the template style for the live tile.");
AddStringParam("Text 1", "First text to display on the live tile.");
AddStringParam("Text 2", "Second text to display on the live tile, if applicable to the template.");
AddAction(11, af_none, "Set live tile text", "Live tile", "Set text live tile template {0} with text <b>{1}</b> and <b>{2}</b>", "Update the live tile with a text-only template.", "SetLiveTileText");

AddAction(12, af_none, "Purchase app", "Purchases", "Prompt to purchase app", "Prompt the user to start the process of purchasing the app.", "PurchaseApp");

AddStringParam("Product ID", "A case-sensitive string of the product ID to purchase.");
AddAction(13, af_none, "Purchase product", "Purchases", "Prompt to purchase product {0}", "Prompt the user to start the process of purchasing a product in this app.", "PurchaseProduct");

AddAction(14, af_none, "Request store listing", "Purchases", "Request store listing", "Retrieves information about products in the store, triggering 'On store listing received'.", "RequestStoreListing");

AddComboParamOption("App listing page");
AddComboParamOption("Publisher page");
AddComboParamOption("Review app");
AddComboParam("Go to", "What to open in the Windows Store.");
AddAction(15, af_none, "Open Windows Store", "Other", "Open windows store to <b>{0}</b>", "Open the Windows Store to the app or publisher page or to review the app.", "OpenWindowsStore");

AddComboParamOption("hidden");
AddComboParamOption("visible");
AddComboParam("Back button", "Whether to hide or show the 'Back' button.");
AddAction(16, af_none, "Set back button visible", "Windows 10", "Set back button {0}", "Hide/show 'Back' button where it is optional (e.g. desktop app caption). Triggers Browser object 'On back button'.", "SetBackButtonVisible");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddStringParam("Key", "Key name", "\"\"");
AddExpression(0, ef_return_string, "Get roaming value", "Roaming storage", "RoamingValue", "Get the value from a key in roaming storage.");

AddExpression(1, ef_return_number, "Get trial time left", "Purchases", "TrialTimeLeft", "If in trial mode, the number of seconds remaining before the trial expires.");

AddExpression(2, ef_return_number, "", "Store listing", "AppFormattedPrice", "The region-formatted price and currency of the app.");

AddStringParam("ProductID", "The ID of the product to retrieve from.");
AddExpression(3, ef_return_string, "", "Store listing", "ProductName", "Get the name of a product from its ID.");

AddStringParam("ProductID", "The ID of the product to retrieve from.");
AddExpression(4, ef_return_string, "", "Store listing", "ProductFormattedPrice", "Get the region-formatted price and currency of a product from its ID.");

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
	new cr.Property(ept_combo,	"Test mode",		"Yes",	"Set to 'Yes' to test purchases. Be sure to set 'No' when publishing.", "No|Yes"),
	new cr.Property(ept_combo,	"'About' setting",	"Yes",	"Show an 'About' option in the Settings charm, which opens about.html.", "No|Yes"),
	//new cr.Property(ept_combo,	"'Preferences' setting", "No",	"Show a 'Preferences' option in the Settings charm, which triggers 'On Preferences' and must be handled by the project.", "No|Yes"),
	new cr.Property(ept_combo,	"'Support' setting", "Yes",	"Show a 'Support' option in the Settings charm, which opens support.html.", "No|Yes"),
	new cr.Property(ept_combo,	"'Privacy' setting", "Yes",	"Show a 'Privacy' option in the Settings charm, which opens privacy.html.", "No|Yes")
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