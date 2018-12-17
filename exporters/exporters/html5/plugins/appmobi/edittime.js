function GetPluginSettings()
{
	return {
		"name":			"Intel AGI",		// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"appMobi",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Integrate your game with the Intel App Game Interface (AGI). Note this does not apply to Crosswalk.",
		"author":		"Scirra/Intel",
		"help url":		"http://www.scirra.com/manual/138/intel-agi",
		"category":		"Platform specific",	// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_singleglobal	| pf_deprecated
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
						
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

	// a string

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

/*********************************************************	
	DEVICE
*********************************************************/	
AddCondition(0, 0, "Caching enabled", "Device", "Caching enabled", "Test if caching has been enabled for this application.", "deviceHasCaching");
AddCondition(1, 0, "Push enabled", "Device", "Push enabled", "Test if pushMobi has been enabled for this application.", "deviceHasPush");
AddCondition(2, 0, "Streaming enabled", "Device", "Streaming enabled", "Test if streaming has been enabled for this application.", "deviceHasStreaming");
AddCondition(3, 0, "Updates enabled", "Device", "Updates enabled", "Test if Live Update has been enabled for this application.", "deviceHasUpdates");

AddCondition(4, 0, "Is in Intel AGI", "Intel AGI", "Is in Intel AGI", "Test if running with the Intel AGI.", "isInAppMobi");

AddComboParamOption("Portrait (0)");
AddComboParamOption("Landscape left (-90)");
AddComboParamOption("Landscape right (90)");
AddComboParamOption("Upside-down portrait (180)");
AddComboParam("Orientation", "Select the orientation to compare to.");
AddCondition(5, 0, "Compare orientation", "Device", "Orientation is {0}", "Test the current orientation of the device.", "compareOrientation");

AddComboParamOption("Portrait (0)");
AddComboParamOption("Landscape left (-90)");
AddComboParamOption("Landscape right (90)");
AddComboParamOption("Upside-down portrait (180)");
AddComboParam("Orientation", "Select the initial orientation to compare to.");
AddCondition(6, 0, "Compare initial orientation", "Device", "Initial orientation was {0}", "Test the initial orientation of the device.", "compareInitialOrientation");

AddCondition(7, cf_trigger, "On barcode scanned", "Triggers", "On barcode scanned", "Triggered when a barcode scanned.", "OnBarcodeScanned");
AddCondition(8, cf_trigger, "On remote site closed", "Triggers", "On remote site closed", "Triggered when the user closes a site opened with 'Show remote site'.", "OnRemoteSiteClosed");
AddCondition(9, cf_trigger, "On remote data", "Triggers", "On remote data", "Triggered when remote data requested with 'Get remote data' is received.", "OnRemoteData");
AddCondition(10, cf_trigger, "On 'back' button pressed", "Triggers", "On 'back' button pressed", "Triggered when the 'back' button (if any) is pressed after adding a virtual page.", "OnBack");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name


/*********************************************************	
	DEVICE
*********************************************************/	
AddAction(0, 0, "Close remote site", "Device", "Close remote site", "Force a remote site opened with 'Show remote site' to close.", "deviceCloseRemoteSite");

//method, url, body, id
AddStringParam('Method', 'The method to use for the request. This parameter should be either "GET" or "POST". Default is "GET".', '"GET"');
AddStringParam('URL', 'URL to call.', '"http://"');
AddStringParam('Body', 'Post data for a "POST" method request in name=value format separated by ampersands');
AddStringParam('ID', 'ID that correlates the request to the event');
AddAction(1, 0, "Get remote data", "Device", "{0} remote data from {1} with body {2} (ID <i>{3}</i>)", "Make background POST/GET requests.", "deviceGetRemoteData");

// Construct 2 automatically hides splash screen on startup
AddAction(2, af_deprecated, "Hide Splash Screen", "Device", "Hide Splash Screen", "This method will hide the application splash screen earlier than it automatically does.", "deviceHideSplashScreen");

AddAction(3, 0, "Install update", "Device", "Install update", "Immediately install a waiting Live Update. Following the install, the application will restart itself with the new code. If no update is waiting, this command is ignored.", "deviceInstallUpdate");

AddStringParam('URL', 'URL to launch.', '"http://"');
AddAction(4, 0, "Launch external site", "Device", "Launch external site {0}", "This function will open a URL in the device's native browser application.", "deviceLaunchExternal");

// Not useful from within C2?
AddStringParam('Command', 'Command to execute');
AddAction(5, af_deprecated, "Execute In Main View", "Device", "Execute In Main View", "Call this command from within a new web view created by the showRemoteSite or showRemoteSiteExt command to execute JavaScript commands within the main web view.", "deviceMainViewExecute");

AddAction(6, 0, "Scan barcode", "Device", "Scan barcode", "Open a full-scren QR code reader.", "deviceScanBarcode");
			
AddComboParamOption("Prevent auto-rotate");
AddComboParamOption("Allow auto-rotate");
AddComboParam("Mode", "Whether the device should automatically handle rotation or not.");	
AddAction(7, 0, "Set auto-rotate", "Device", "{0}", "Set whether the device should automatically rotate when changing device orientation.", "deviceSetAutoRotate");

AddComboParamOption("Portrait");	
AddComboParamOption("Landscape");
AddComboParam("Orientation", "Choose the orientation to set.");	
AddAction(8, 0, "Set orientation", "Device", "Set orientation to {0}", "Lock the orientation of the device to portrait or landscape.", "deviceSetRotateOrientation");

AddAction(9, 0, "Update connection", "Device", "Update connection", "Query the device to determine its current connection to the internet.", "deviceUpdateConnection");

AddStringParam('URL', 'URL to show.', '"http://"');
AddNumberParam('Close icon width', 'The width of the button to close the web view, in pixels.', 48);
AddNumberParam('Close icon height', 'The height of the button to close the web view, in pixels.', 48);
AddNumberParam('Close icon X (portrait)', 'The position of the button to close the web view from the left edge in pixels when the device is in the portrait orientation.');
AddNumberParam('Close icon Y (portrait)', 'The position of the button to close the web view from the top edge in pixels when the device is in the portrait orientation.');
AddNumberParam('Close icon X (landscape)', 'The position of the button to close the web view from the left edge in pixels when the device is in the Landscape orientation.');
AddNumberParam('Close icon Y (landscape)', 'The position of the button to close the web view from the top edge in pixels when the device is in the Landscape orientation.');
AddAction(10, 0, "Show remote site", "Device", "Show remote site {0} (close icon {1}x{2} at ({3}, {4}) in portrait, ({5}, {6}) in landscape)", "Show a remote web site in a new web view. Touching the close icon will shut down the web view and return the user to the application. ", "deviceShowRemoteSite");

	
/*********************************************************	
	ANALYTICS
*********************************************************/	
AddStringParam('Event', 'The name of the event you wish to record.');
AddStringParam('Parameters (optional)', 'Data for the tracked statMobi event in name=value format separated by ampersands (e.g. "foo=5&bar=10").', '""');
AddAction(11, 0, "Log event", "Analytics", "Log event <b>{0}</b> with parameters <i>{1}</i>", "Log an event for statMobi Analytics.", "analyticsLogEvent");

/*********************************************************	
	CACHE
*********************************************************/
AddStringParam('URL', 'The url of the file to cache.',  '"http://"');
AddAction(12, 0, "Add to media cache", "Cache", "Add {0} to media cache", "This command will get a file from the Internet and cache it locally on the device.", "cacheAddToMediaCache");

AddAction(13, 0, "Clear all cookies", "Cache", "Clear all cookies", "This method will clear all data stored using the 'Set cookie' action.", "cacheClearAllCookies");
AddAction(14, 0, "Clear media cache", "Cache", "Remove all files from the local cache on the device.", "cacheClearMediaCache");

AddStringParam('Name', 'The name of the data to remove.');
AddAction(15, 0, "Remove cookie", "Cache", "Remove cookie {0}", "This method will clear data previously saved using the setCookie method.", "cacheRemoveCookie");

AddStringParam('URL', 'The url of the file to remove from the local cache.', '"http://"');
AddAction(16, 0, "Remove from media cache", "Cache", "Remove {0} from media cache", "Remove a file from the local cache on the device.", "cacheRemoveFromMediaCache");

AddStringParam('Name', 'The name for the data to set.  Must not contain periods or underscores.');
AddStringParam('Value', 'A string to save in the cookie.');
AddNumberParam('Expires (days)', 'The number of days the cookie will last before being removed.  -1 indicates "never".', -1);
AddAction(17, 0, "Set cookie", "Cache", "Set cookie {0} to <i>{1}</i> (expiring in {2} days)", "Save a string in a cookie that can persist between sessions.", "cacheSetCookie");


/*********************************************************	
	VIRTUAL PAGES
*********************************************************/
AddAction(18, 0, "Add virtual page", "Virtual pages", "Add virtual page", "Add a virtual page, allowing the next press of the 'back' button (if present) to be intercepted.", "AddVirtualPage");
AddAction(19, 0, "Remove virtual page", "Virtual pages", "Remove virtual page", "Remove a virtual page, reverting the 'back' button to its default action.", "RemoveVirtualPage");


/*********************************************************	
	ACCELEROMETER
*********************************************************/
//AddAction(18, 0, "Enable WITHOUT Rotation Adjustment", "Accelerometer", "This will allow you to access the X, Y, Z values without adjusting for rotation.", "accelerometerEnableAndWatch");

AddAction(20, 0, "Hide status bar", "Device", "Hide status bar", "Hide the status bar at the top of the device screen, if any is present.", "HideStatusBar");


////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example

/*********************************************************	
	DEVICE
*********************************************************/	
AddExpression(0, ef_return_string, "appMobi Version", "Device", "AppMobiVersion", "The version of the Intel XDK container software that the application is using.");
AddExpression(1, ef_return_string, "Connection", "Device", "DeviceConnection", 'The best type of internet connection available ("wifi", "cell" or "none").');
AddExpression(2, ef_return_number, "Initial Orientation", "Device", "InitialOrientation", "The initial orientation of the device (0, -90, 90 or 180).");
AddExpression(3, ef_deprecated | ef_return_string, "Last Station", "Device", "DeviceLastStation", "The NetStationID or ShoutcastURL of the station that is currently playing.");
AddExpression(4, ef_return_string, "Model", "Device", "DeviceModel", 'The model of the device that the application is running on, e.g. "iPhone 4" or "Motorola Droid".');
AddExpression(5, ef_return_number, "Orientation", "Device", "Orientation", "The current orientation of the device (0, -90, 90 or 180).");
AddExpression(6, ef_return_string, "OS Version", "Device", "DeviceOSVersion", "The device’s current operating system version information.");
AddExpression(7, ef_deprecated | ef_return_string, "Phone Gap Version", "Device", "DevicePhonegapVersion", "This property returns the version of phonegap running below the Intel XDK layer.");
AddExpression(8, ef_return_string, "Platform", "Device", "DevicePlatform", 'A string identifying the platform that Intel AGI is running on, e.g. "iOS" or "Android".');
AddExpression(9, ef_return_string, "Query String", "Device", "DeviceQueryString", "Returns any query string parameters passed along with a protocol handler call to start an application.");
AddExpression(10, ef_return_string, "UUID", "Device", "DeviceUUID", "The device’s unique identification id.");
AddExpression(11, ef_return_string, "Remote Data", "Device", "DeviceRemoteData", "The response data from 'Get Remote Data'.");
AddExpression(12, ef_return_string, "Scanned Barcode Data", "Device", "DeviceBarcodeData", "The response data from 'Scan Barcode'.");
AddExpression(13, ef_return_string, "Remote Site Window Status", "Device", "DeviceRemoteStatus", 'One of "open", "closed" or "idle".');


/*********************************************************	
	CACHE
*********************************************************/
AddStringParam("Name", "The name of the cookie to retrieve.");
AddExpression(14, ef_return_string, "Cookie", "Cache", "Cookie", "Retrieve a string saved with the 'Set Cookie' action.");

AddStringParam("URL", "URL of the resource to retrieve.");
AddExpression(15, ef_return_string, "MediaCache", "Cache", "LocalMediaCacheURL", "Return a local URL for a cached media file.");


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