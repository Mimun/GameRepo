function GetPluginSettings()
{
	return {
		"name":			"GameTaLaPlugin",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"GameTaLaPlugin",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Send and Receive the TL Card command from Server",
		"author":		"Chipl/opensoft>",
		"help url":		"www.github.com",
		"category":		"Gamble",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
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
				
// example				
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "Game Event", "{0} is positive", "Description for my condition!", "MyCondition");

AddCondition(1, cf_trigger, "On opened", "Connection", "On connection opened", "Triggered when the connection to the WebSocket server is successfully established.", "OnOpened");

AddCondition(2, cf_trigger, "On closed", "Connection", "On connection closed", "Triggered when an active connection is closed.", "OnClosed");

AddCondition(3, cf_trigger, "On error", "Connection", "On connection error", "Triggered when there is a connection error.", "OnError");

AddCondition(4, cf_trigger, "On message", "Data", "On message", "Triggered when a message is received from the server.", "OnMessage");

AddCondition(5, cf_none, "Is open", "Connection", "Is connection open", "True if the connection is currently open.", "IsOpen");

AddCondition(6, cf_none, "Is connecting", "Connection", "Is connecting", "True if the connection is currently being established.", "IsConnecting");

AddCondition(7, cf_none, "Is supported", "Connection", "Is WebSocket supported", "True if the user's client supports WebSocket connections.", "IsSupported");

// Game Events from Chipl
AddCondition(8, cf_trigger, "On new Player", "Game Events", "New Player join in", "True if new Player is joined in Game", "NewPlayerJoin");

AddCondition(9, cf_trigger, "Player Left Room", "Game Events", "Player left room", "True if new Player is joined in Game", "PlayerLeft");

AddNumberParam("Player Number", "Enter a number to check if player is existed.");
AddCondition(10, cf_none, "Check Player is existed", "Game Event", "Player {0} index is existed", "Description for my condition!", "CheckPlayer");
//

AddCondition(11, cf_trigger, "Deal Cards Event", "Game Events", "Deal a Desk of Cards", "Distirbute cards to players", "DealCard");

AddCondition(12, cf_trigger, "Display Start Button", "Game Events", "Start Button for Winner", "Display Start Button", "DisplayStartButton");

AddCondition(13, cf_trigger, "User Status is Changing", "Game Events", "User Status is Changing", "User Status is Changing", "UserStatusChange");

AddCondition(14, cf_trigger, "Player Placing Card", "Game Events", "Player Placing Card", "Player Placing Card", "PlayerPlacingCard");

// New card from Desktop is comming
AddCondition(15, cf_trigger, "New Card from Desktop", "Game Events", "New Card from Desktop", "New Card from Desktop", "NewCardFromDesk");


// Earn card from preceded player
AddCondition(16, cf_trigger, "Earn Card from other", "Game Events", "Earn Card from other", "Earn Card from other", "EarnCardFromOther");
//
AddCondition(17, cf_trigger, "Player Status is Changing", "Game Events", "Player Status is Changing", "Player Status is Changing", "PlayerStatusChange");

// Moving card on the desk
AddCondition(18, cf_trigger, "Moving card on the desk", "Game Events", "Moving card on the desk", "Moving card on the desk", "MovingPlacedCard");

// Show card colection to the others
AddCondition(19,cf_trigger, "Show card collection", "Game Events", "Show card Collections", "Show cards Collections", "ShowCardCollections");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddAnyTypeParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");


// Connect to WS server
AddStringParam("URL", "Enter the WebSocket server to connect to.", "\"ws://\"");
AddStringParam("Protocol (optional)", "Enter a required sub-protocol the server must support in order to establish a connection.  Leave empty for no protocol requirement.");
AddAction(1, af_none, "Connect", "Connection", "Connect to <i>{0}</i> (require protocol {1})", "Connect to a WebSocket server.", "Connect");

// Close
AddAction(2, af_none, "Close", "Connection", "Close connection", "Close any active WebSocket connection.", "Close");

// Send
AddStringParam("Data", "A text string to send to the server.");
AddAction(3, af_none, "Send text", "Data", "Send text <i>{0}</i>", "Send a text string to the server.", "Send");
// StartGame
AddAction(4, af_none, "StartGame", "Game Events", "Send Start Game Signal", "Send Start Game command to server.", "SendStartGame");
// Placing Card
AddNumberParam("Data", "Send card value to room");
AddAction(5, af_none, "PlacingCard", "Game Events", "Send Placing Card to server", "Send Placing Card to server.", "PlacingCard");

// Take Card from Desk
AddAction(6, af_none, "Take new Card from Desk", "Game Events", "Take new Card from Desk", "Take new Card from Desk.", "TakeCardFromDesk");

// Earn card from preceded player
AddAction(7, af_none, "Earn Card from Other", "Game Events", "Earn Card from Other", "Earn Card from Other.", "EarCardFromOther");
// Show my card list to other
AddStringParam("Data", "A ShowCardList string to send to the server.");
AddAction(8, af_none, "Show my cards collection to other", "Game Events", "Show my cards collection to other", "Show my cards collection to other.", "ShowCardCollectionToOther");

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
AddExpression(0, ef_return_number, "Let expression", "My category", "MyExpression", "Return the number 1337.");

AddExpression(1, ef_return_number, "Something Else", "My category", "OtherExpression", "Return other.");
////////////////////////////////////////

AddNumberParam('first param:', "chipl notice")
AddNumberParam('second param:', "chipl notice")
AddExpression(2, ef_return_number, "Something special", "My category", "SpecialExpression", "Return other.");

AddNumberParam('Player index:', "get Player Name")
AddExpression(3, ef_return_string, "Something special", "Game Expression", "GetPlayerName", "Return Player Name:.");

AddNumberParam('Player index:', "get Player Avatar")
AddExpression(4, ef_return_string, "Something special", "Game Expression", "GetPlayerAvatar", "Return Player Avatar UrL:.");

AddNumberParam('Player index:', "get Player Balance")
AddExpression(5, ef_return_string, "Something special", "Game Expression", "GetPlayerBalance", "Return Player Balance:.");

AddExpression(6, ef_return_number, "Get Left Player Post", "Game Expression", "GetLeftPlayerPos", "Return the postion of Player in Table");

AddExpression(7, ef_return_string, "Get Cards ", "Game Expression", "GetCards", "Return string of Cards");

// AddNumberParam('Type of Info: 0 for position, 1 for value', "get Placed Card Info")
AddExpression(8, ef_return_string, "Get Current Users Status ", "Game Expression", "GetUserStatus", "Return Current Users Status");

AddNumberParam('Type of Info: 0 for position, 1 for value', "get Placed Card Info")
AddExpression(9, ef_return_string, "Get other Player Status ", "Game Expression", "GetPlayersStatus", "Return Other Player Status");


// Get Placed Card info : Player and value
AddNumberParam('Type of Info: 0 for position, 1 for value', "get Placed Card Info")
AddExpression(10, ef_return_number, "Get Placed Card Info ", "Game Expression", "GetPlacedCardInfo", "Return Placed Card Info");

// Get new Card info: Player and value
AddNumberParam('Type of Info: 0 for position, 1 for value', "get Card from Desk Info")
AddExpression(11, ef_return_number, "Get Placed Card Info ", "Game Expression", "GetNewCardFromDeskInfo", "Return Placed Card Info");

// Get earned Card info: Player and value
AddNumberParam('Type of Info: 0 for position, 1 for value', "get Earned Card Info")
AddExpression(12, ef_return_number, "Get Earned Card Info ", "Game Expression", "GetEarnedCardInfo", "Return Earned Card Info");

// Get moving Card info: Player and value
AddNumberParam('Type of Info: 0 for position, 1 for value', "get Moving Card Info")
AddExpression(13, ef_return_number, "Get Moving Card Info ", "Game Expression", "GetMovingCardInfo", "Return Moving Card Info");

//ef_return_any
//
AddNumberParam('Type of Info: 0 for position, 1 for value', "get ShowCardCollections Info")
AddExpression(14, ef_return_any, "Get Show Show CardCollections Info ", "Game Expression", "GetShowCollectionCardInfo", "Return Cards Collection Info");

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
	new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
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