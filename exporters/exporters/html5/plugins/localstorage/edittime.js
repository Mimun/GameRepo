function GetPluginSettings()
{
	return {
		"name":	"Local storage",
		"id": "LocalStorage",
		"version":		"1.0",
		"description": "Store data locally on the user's device.",
		"author": "Scirra",
		"help url": "https://www.scirra.com/manual/188/local-storage",
		"category": "Data & Storage",
		"type": "object",
		"rotatable": false,
		"flags": pf_singleglobal
	};
}

//////////////
// Conditions
AddStringParam("Key", "Enter the name of the key to check for being set.");
AddCondition(0, cf_trigger, "On item set", "Items", "On item <i>{0}</i> set", "Triggered after 'Set item' when the item has been written to local storage.", "OnItemSet");

AddStringParam("Key", "Enter the name of the key to check for being read.");
AddCondition(1, cf_trigger, "On item get", "Items", "On item <i>{0}</i> get", "Triggered after 'Get item', when the item value is available.", "OnItemGet");

AddStringParam("Key", "Enter the name of the key to check for being removed.");
AddCondition(2, cf_trigger, "On item removed", "Items", "On item <i>{0}</i> removed", "Triggered after 'Remove item', after the item has been removed from local storage.", "OnItemRemoved");

AddCondition(3, cf_trigger, "On storage cleared", "Local storage", "On storage cleared", "Triggered after 'Clear storage', when local storage has finished being cleared.", "OnCleared");

AddCondition(4, cf_trigger, "On all key names loaded", "Local storage", "On all key names loaded", "Triggered after 'Get all key names', when the list of key names is ready.", "OnAllKeyNamesLoaded");

AddCondition(5, cf_trigger, "On error", "Local storage", "On error", "Triggered if any error occurs while accessing local storage.", "OnError");

AddCondition(6, cf_trigger, "On any item set", "Items", "On any item set", "Triggered after any 'Set item' action when the item has been written to local storage.", "OnAnyItemSet");

AddCondition(7, cf_trigger, "On any item get", "Items", "On any item get", "Triggered after any 'Get item' action when the item value is available.", "OnAnyItemGet");

AddCondition(8, cf_trigger, "On any item removed", "Items", "On any item removed", "Triggered after any 'Remove item' action after the item has been removed from local storage.", "OnAnyItemRemoved");

AddStringParam("Key", "Enter the name of the key to check if exists.");
AddCondition(9, cf_trigger, "On item exists", "Items", "On item <i>{0}</i> exists", "Triggered after 'Check item exists' if the given item exists in storage.", "OnItemExists");

AddStringParam("Key", "Enter the name of the key to check if missing.");
AddCondition(10, cf_trigger, "On item missing", "Items", "On item <i>{0}</i> missing", "Triggered after 'Check item exists' if the given item does not exist in storage.", "OnItemMissing");

AddCmpParam("Comparison", "How to compare the current key.");
AddStringParam("String", "String to compare the current key to.");
AddCondition(11, cf_none, "Compare key", "Local storage", "Key {0} {1}", "Compare the current key name in a trigger.", "CompareKey");

AddCmpParam("Comparison", "How to compare the current value.");
AddAnyTypeParam("Value", "String or number to compare the current value to.", "\"\"");
AddCondition(12, cf_none, "Compare value", "Local storage", "Value {0} {1}", "Compare the current item value in a trigger.", "CompareValue");

AddCondition(13, cf_none, "Is processing sets", "Progress", "Is processing sets", "True if currently processing any 'Set item' actions.", "IsProcessingSets");

AddCondition(14, cf_none, "Is processing gets", "Progress", "Is processing gets", "True if currently processing any 'Get item' actions.", "IsProcessingGets");

AddCondition(15, cf_trigger, "On all sets complete", "Progress", "On all sets complete", "Triggered after all currently outstanding 'Set item' actions complete.", "OnAllSetsComplete");

AddCondition(16, cf_trigger, "On all gets complete", "Progress", "On all gets complete", "Triggered after all currently outstanding 'Get item' actions complete.", "OnAllGetsComplete");

//////////////
// Actions
AddStringParam("Key", "Enter the name of the key to associate the value with.");
AddAnyTypeParam("Value", "Enter the value to store.", "\"\"");
AddAction(0, af_none, "Set item", "Items", "Set item <i>{0}</i> to {1}", "Store a value in local storage, and trigger 'On item set' when done.", "SetItem");

AddStringParam("Key", "Enter the name of the key to get the value for. 'On item loaded' will trigger when the value is ready.");
AddAction(1, af_none, "Get item", "Items", "Get item <i>{0}</i>", "Read a value from local storage, and trigger 'On item get' when ready.", "GetItem");

AddStringParam("Key", "Enter the name of the key to remove. 'On item removed' will trigger when done.");
AddAction(2, af_none, "Remove item", "Items", "Remove item <i>{0}</i>", "Remove an item from local storage, and trigger 'On item removed' when done.", "RemoveItem");

AddAction(3, af_none, "Clear storage", "Local storage", "Clear storage", "Remove all items from local storage, and trigger 'On storage cleared' when done.", "ClearStorage");

AddAction(4, af_none, "Get all key names", "Local storage", "Get all key names", "Request a list of all key names in local storage, and trigger 'On all key names loaded' when ready.", "GetAllKeyNames");

AddStringParam("Key", "Enter the name of the key to check if exists.");
AddAction(5, af_none, "Check item exists", "Items", "Check item <i>{0}</i> exists", "Check if an item exists in local storage, triggering 'On item exists' or 'On item missing'.", "CheckItemExists");

//////////////
// Expressions
AddExpression(0, ef_return_any, "", "Items", "ItemValue", "In 'On item get', the item value retrieved.");

AddExpression(1, ef_return_string, "", "Items", "Key", "The current key name in a storage trigger.");

AddExpression(2, ef_return_number, "", "Local storage", "KeyCount", "After 'On all key names loaded', the key count.");

AddNumberParam("Index", "Zero-based index");
AddExpression(3, ef_return_string, "", "Local storage", "KeyAt", "After 'On all key names loaded', the key name at an index.");

AddExpression(4, ef_return_string, "", "Local storage", "ErrorMessage", "In 'On error', an error message if any available.");

/*
AddStringParam("Key", "Key name", "\"\"");
AddExpression(0,ef_return_string,"Get local value","Local","LocalValue","Get the value from a key in local storage.");

AddStringParam("Key", "Key name", "\"\"");
AddExpression(1,ef_return_string,"Get session value","Session","SessionValue","Get the value from a key in session storage.");

AddExpression(2,ef_return_number,"Get number of local values","Local","LocalCount","Get the number of keys in local storage.");
AddExpression(3,ef_return_number,"Get number of session values","Session","SessionCount","Get the number of keys in session storage.");

AddNumberParam("Index", "Index", "0");
AddExpression(4,ef_return_string,"Get Nth local value", "Local", "LocalAt", "Get the value stored in the Nth local key.");

AddNumberParam("Index", "Index", "0");
AddExpression(5,ef_return_string,"Get Nth session value", "Session", "SessionAt", "Get the value stored in the Nth session key.");

AddNumberParam("Index", "Index", "0");
AddExpression(6,ef_return_string,"Get Nth local key name", "Local", "LocalKeyAt", "Get the Nth local key's name.");

AddNumberParam("Index", "Index", "0");
AddExpression(7,ef_return_string,"Get Nth session key name", "Session", "SessionKeyAt", "Get the Nth session key's name.");

AddExpression(8, ef_return_string, "Get as JSON", "Local", "AsJSON", "Return the contents of all local storage in JSON format.");
*/

ACESDone();

var property_list = [
];

function CreateIDEObjectType()
{
	return new IDEObjectType();
}

function IDEObjectType()
{
	assert2(this instanceof arguments.callee,"Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee,"Constructor called as a function");
	
	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
	for(property in property_list)
		this.properties[property.name] = property.initial_value;
}

IDEInstance.prototype.OnCreate = function()
{
}

IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.Draw = function(renderer)
{
}

IDEInstance.prototype.OnRendererReleased = function()
{
}