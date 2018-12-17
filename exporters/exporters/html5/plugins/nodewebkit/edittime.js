function GetPluginSettings()
{
	return {
		"name":			"NW.js",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"NodeWebkit",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Access features only available when exported with NW.js, like accessing files on disk.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/162/nwjs",
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
				
		
AddStringParam("Path", "Enter a file path to test if exists.");
AddCondition(0, cf_none, "Path exists", "File system", "Path <i>{0}</i> exists", "Test if a file exists on disk.", "PathExists");

AddCondition(1, cf_trigger, "On file dropped", "File system", "On file dropped", "Triggered when the user drag-and-drops a file in to the window.", "OnFileDrop");

AddCondition(2, cf_trigger, "On open dialog OK", "File dialogs", "On open dialog OK", "Triggered after a file chosen from an open dialog.", "OnOpenDlg");

AddCondition(3, cf_trigger, "On folder dialog OK", "File dialogs", "On folder dialog OK", "Triggered after a folder chosen from a folder dialog.", "OnFolderDlg");

AddCondition(4, cf_trigger, "On save dialog OK", "File dialogs", "On save dialog OK", "Triggered after a file chosen from a save dialog.", "OnSaveDlg");

AddCondition(5, cf_trigger, "On open dialog cancel", "File dialogs", "On open dialog cancel", "Triggered if the open dialog is cancelled.", "OnOpenDlgCancel");

AddCondition(6, cf_trigger, "On folder dialog cancel", "File dialogs", "On folder dialog cancel", "Triggered if the folder dialog is cancelled.", "OnFolderDlgCancel");

AddCondition(7, cf_trigger, "On save dialog cancel", "File dialogs", "On save dialog cancel", "Triggered if the save dialog is cancelled.", "OnSaveDlgCancel");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Path", "Enter the file path to write to. The file will be overwritten!", "");
AddStringParam("Contents", "Enter the text content to write to the file.");
AddAction(0, af_none, "Write file", "File system", "Write <b>{1}</b> to file <i>{0}</i>", "Write some text to a file.", "WriteFile");

AddStringParam("Existing file", "Enter the existing file path to be renamed.");
AddStringParam("New name", "Enter the new file path to rename to.");
AddAction(1, af_none, "Rename file", "File system", "Rename <i>{0}</i> to <i>{1}</i>", "Rename an existing file.", "RenameFile");

AddStringParam("Path", "Enter the file path to delete.");
AddAction(2, af_none, "Delete file", "File system", "Delete <i>{0}</i>", "Delete a file.", "DeleteFile");

AddStringParam("Path", "Enter the folder path to create.");
AddAction(3, af_none, "Create folder", "File system", "Create folder <i>{0}</i>", "Create a new folder on disk.", "CreateFolder");

AddStringParam("Path", "Enter the file path to append to.", "");
AddStringParam("Contents", "Enter the text content to append to the file.");
AddAction(4, af_none, "Append file", "File system", "Append <b>{1}</b> to file <i>{0}</i>", "Add some text to the end of a file.", "AppendFile");

AddStringParam("Path", "Enter the folder path to list files from.");
AddAction(5, af_none, "List files", "File system", "List files from <i>{0}</i>", "Load a list of files in a given folder. Use expressions after this action to get the count and file names.", "ListFiles");

AddStringParam("Accept", "The file types to filter by. Leave empty to show all files, or e.g. \".txt\" or \".txt,.json\" or \"text/*\"");
AddAction(6, af_none, "Show open dialog", "File dialogs", "Show open dialog (accept <i>{0}</i>)", "Show an open file dialog allowing the user to pick a file.", "ShowOpenDlg");

AddAction(7, af_none, "Show folder dialog", "File dialogs", "Show folder dialog", "Show a folder picker dialog allowing the user to pick a folder.", "ShowFolderDlg");

AddStringParam("Accept", "The file types to filter by. Leave empty to show all files, or e.g. \".txt\" or \".txt,.json\" or \"text/*\"");
AddAction(8, af_none, "Show save dialog", "File dialogs", "Show save dialog (accept <i>{0}</i>)", "Show a save file dialog.", "ShowSaveDlg");

AddStringParam("Path", "Enter the file path to copy.");
AddStringParam("Destination", "Enter the file path to copy to.");
AddAction(9, af_none, "Copy file", "File system", "Copy <i>{0}</i> to <i>{1}</i>", "Make an identical copy of a file.", "CopyFile");

AddStringParam("Path", "Enter the file path to move.");
AddStringParam("Destination", "Enter the file path to move to.");
AddAction(10, af_none, "Move file", "File system", "Move <i>{0}</i> to <i>{1}</i>", "Copy a file then delete the original.", "MoveFile");

AddStringParam("Path", "Enter the path of the file to execute. This can also include space-separated arguments. To execute a path with spaces in it, wrap in double-quotes (e.g. \"\"\"C:\\Program Files\\file.exe\"\"\").");
AddAction(11, af_none, "Run file", "File system", "Run <i>{0}</i>", "Run a file, such as executing another program.", "RunFile");

AddNumberParam("X", "The X co-ordinate to move the window to on the screen.");
AddAction(12, af_none, "Set X", "Window", "Set window X to <i>{0}</i>", "Set the X position of the window on the screen.", "SetWindowX");

AddNumberParam("Y", "The Y co-ordinate to move the window to on the screen.");
AddAction(13, af_none, "Set Y", "Window", "Set window Y to <i>{0}</i>", "Set the Y position of the window on the screen.", "SetWindowY");

AddNumberParam("Width", "The new width of the window.");
AddAction(14, af_none, "Set width", "Window", "Set window width to <i>{0}</i>", "Set the width of the window.", "SetWindowWidth");

AddNumberParam("Height", "The new height of the window.");
AddAction(15, af_none, "Set height", "Window", "Set window height to <i>{0}</i>", "Set the height of the window.", "SetWindowHeight");

AddStringParam("Title", "A string to display in the window title bar.");
AddAction(16, af_none, "Set title", "Window", "Set window title to <i>{0}</i>", "Set the text appearing in the window title bar.", "SetWindowTitle");

AddAction(17, af_none, "Minimize", "Window", "Minimize window", "Minimize the window.", "WindowMinimize");
AddAction(18, af_none, "Maximize", "Window", "Maximize window", "Maximize the window.", "WindowMaximize");
AddAction(19, af_none, "Unmaximize", "Window", "Unmaximize window", "Unmaximize the window (i.e. the reverse of maximizing).", "WindowUnmaximize");
AddAction(20, af_none, "Restore", "Window", "Restore window", "Restore the window (i.e. show again after minimizing).", "WindowRestore");

AddComboParamOption("Request attention");
AddComboParamOption("Stop requesting attention");
AddComboParam("Mode", "Whether to request attention or cancel a previous request for attention.");
AddAction(21, af_none, "Request attention", "Window", "Window: {0}", "Start or stop requesting attention from the user, e.g. by flashing the title bar (depends on OS).", "WindowRequestAttention");

AddNumberParam("Max width", "The maximum window width to set, in pixels.");
AddNumberParam("Max height", "The maximum window height to set, in pixels.");
AddAction(22, af_none, "Set maximum size", "Window", "Set window maximum size to <i>{0}</i> x <i>{1}</i>", "Set the maximum size of the window.", "WindowSetMaxSize");

AddNumberParam("Min width", "The minimum window width to set, in pixels.");
AddNumberParam("Min height", "The minimum window height to set, in pixels.");
AddAction(23, af_none, "Set minimum size", "Window", "Set window minimum size to <i>{0}</i> x <i>{1}</i>", "Set the minimum size of the window.", "WindowSetMinSize");

AddComboParamOption("not resizable");
AddComboParamOption("resizable");
AddComboParam("Mode", "Whether to enable or disable resizing on the window.");
AddAction(24, af_none, "Set resizable", "Window", "Set window {0}", "Enable or disable resize controls on the window.", "WindowSetResizable");

AddComboParamOption("not always on top");
AddComboParamOption("always on top");
AddComboParam("Mode", "Whether to enable or disable the window always being on top.");
AddAction(25, af_none, "Set always on top", "Window", "Set window {0}", "Enable or disable the window always being on top of other windows.", "WindowSetAlwaysOnTop");

AddAction(26, af_none, "Show dev tools", "Window", "Show dev tools", "Display the web developer tools e.g. for Javascript debugging or inspecting console messages.", "ShowDevTools");

AddStringParam("Text", "Enter the text to copy to the clipboard.");
AddAction(27, af_none, "Set clipboard text", "Clipboard", "Set clipboard text to <i>{0}</i>", "Copy some text to the clipboard.", "SetClipboardText");

AddAction(28, af_none, "Clear clipboard", "Clipboard", "Clear clipboard", "Clear the clipboard so nothing is copied.", "ClearClipboard");

AddStringParam("URL", "The web address to open in a browser.");
AddAction(29, af_none, "Open browser", "File system", "Open browser to URL <i>{0}</i>", "Open the default browser to a given URL.", "OpenBrowser");

AddStringParam("Path", "File path to open. The default app associated with the file will be opened.");
AddAction(30, af_none, "Shell open", "File system", "Shell open <i>{0}</i>", "Open the default associated app for a file.", "ShellOpen");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "", "File system", "AppFolder", "Return the application's folder path. Note it may not have write permission.");
AddExpression(14, ef_return_string, "", "File system", "AppFolderURL", "Return the application's folder as a file URL. Use this for any URL parameters.");
AddExpression(1, ef_return_string, "", "File system", "UserFolder", "Return the current user's folder.");

AddStringParam("Path", "The file path to load.");
AddExpression(2, ef_return_string, "", "File system", "ReadFile", "Return the text content of a file on disk.");

AddStringParam("Path", "The file path to get the size of.");
AddExpression(3, ef_return_number, "", "File system", "FileSize", "Return the size of a file on disk, in bytes.");

AddExpression(4, ef_return_number, "", "File system", "ListCount", "Return the number of files after 'List files'.");

AddNumberParam("Index", "Zero-based index of file to retrieve.");
AddExpression(5, ef_return_string, "", "File system", "ListAt", "Return the filename at an index after 'List files'.");

AddExpression(6, ef_return_string, "", "File system", "DroppedFile", "Return the filename of a file dropped in to the window.");

AddExpression(7, ef_return_string, "", "File dialogs", "ChosenPath", "Return the chosen path after a file dialog.");

AddExpression(8, ef_return_number, "", "Window", "WindowX", "The X position of the window on the screen.");
AddExpression(9, ef_return_number, "", "Window", "WindowY", "The Y position of the window on the screen.");
AddExpression(10, ef_return_number, "", "Window", "WindowWidth", "The width of the UI window in the operating system.");
AddExpression(11, ef_return_number, "", "Window", "WindowHeight", "The height of the UI window in the operating system.");
AddExpression(12, ef_return_string, "", "Window", "WindowTitle", "The current window title bar text.");

AddExpression(13, ef_return_string, "", "Clipboard", "ClipboardText", "The current text copied to the clipboard, if any.");

AddExpression(15, ef_return_string, "", "File system", "ProjectFilesFolder", "Return the folder path to project files (i.e. where index.html is). Note it may not have write permission.");
AddExpression(16, ef_return_string, "", "File system", "ProjectFilesFolderURL", "Return the folder path to project files as a file URL. Use this for any URL parameters.");

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