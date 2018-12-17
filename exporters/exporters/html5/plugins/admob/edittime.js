/* Copyright (c) 2014 Intel Corporation. All rights reserved.
* Use of this source code is governed by a MIT-style license that can be
* found in the LICENSE file.
*/

function GetPluginSettings()
{
	return {
		"name":			"Admob Ads",
		"id":			"admob",
		"version":		"1.0",
		"description":	"AdMob ads for Intel® XDK.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/184/admob",
		"category":		"Monetisation",
		"type":			"object",			// appears in layout
		"rotatable":	false,
		"cordova-plugins": "cordova-plugin-ad-admob",
		"flags":		pf_singleglobal
	};
};

AddCondition(0, 0, "Is showing banner ad", "Ads", "Is showing banner ad", "True if currently showing a banner ad.", "IsShowingBanner");

AddCondition(1, 0, "Is showing interstitial", "Ads", "Is showing interstitial", "True if currently showing a fullscreen ad.", "IsShowingInterstitial");

//AddCondition(1, cf_trigger, "On banner presented", "Ads", "On banner presented", "Triggered when a banner ad displayed on the screen.", "OnBannerPresented");

AddCondition(2, cf_trigger, "On interstitial received", "Ads", "On interstitial received", "Triggered when a pre-loaded interstitial is received and ready to show.", "OnInterstitialReceived");

AddCondition(3, cf_trigger, "On interstitial presented", "Ads", "On interstitial presented", "Triggered when an interstitial is displayed on the screen.", "OnInterstitialPresented");

AddCondition(4, cf_trigger, "On interstitial dismissed", "Ads", "On interstitial dismissed", "Triggered when an interstitial is dismissed.", "OnInterstitialDismissed");

AddCondition(5, cf_trigger, "On banner ad received", "Ads", "On banner ad received", "Triggered when a pre-loaded banner ad is received and ready to show.", "OnBannerAdReceived");

// Actions
AddComboParamOption("Top left");
AddComboParamOption("Top center");
AddComboParamOption("Top right");
AddComboParamOption("Left");
AddComboParamOption("Center");
AddComboParamOption("Right");
AddComboParamOption("Bottom left");
AddComboParamOption("Bottom center");
AddComboParamOption("Bottom right");
AddComboParam("Position", "Where to display the ad.", 1);
AddComboParamOption("Smart banner (auto-size, recommended)");
AddComboParamOption("Banner");
AddComboParamOption("Medium rectangle");
AddComboParamOption("Full banner");
AddComboParamOption("Leaderboard");
AddComboParamOption("Skyscraper");
AddComboParam("Size", "The size of ad to display.");
AddAction(0, 0, "Show banner ad", "Ads", "Show banner ad at position <i>{0}</i> size <i>{1}</i>", "Show a banner ad on the screen while the game is running.", "ShowBanner");

AddAction(1, af_deprecated, "Auto-show interstitial", "Ads", "Auto-show interstitial", "Load a fullscreen advert that hides the running game and display it when ready.", "AutoShowInterstitial");

AddAction(2, 0, "Hide banner ad", "Ads", "Hide banner ad", "Hide any currently showing banner ad.", "HideBanner");

AddAction(3, 0, "Preload interstitial", "Ads", "Preload interstitial", "Pre-load a fullscreen ad in the background, and trigger 'On interstitial received' when ready.", "PreloadInterstitial");

AddAction(4, 0, "Show interstitial", "Ads", "Show interstitial", "Show a pre-loaded fullscreen ad once it's ready.", "ShowInterstitial");

AddAction(5, af_deprecated, "Reload interstitial", "Ads", "Reload interstitial", "Reload a currently showing fullscreen ad.", "ReloadInterstitial");

AddAction(6, 0, "Reload banner ad", "Ads", "Reload banner ad", "Reload a currently showing banner ad.", "ReloadBanner");

AddAction(7, 0, "Preload banner ad", "Ads", "Preload banner ad", "Pre-load a banner ad in the background, and trigger 'On banner ad received' when ready.", "PreloadBanner");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo,	"Overlap",					"Yes",		"Whether to overlap the banner over the viewport or scale down the viewport to make room for the banner.", "No|Yes"),
	new cr.Property(ept_combo,	"Test Mode",				"True",		"Show test ads.", "False|True"),
	
	new cr.Property(ept_section, "Android", "",	"Ad unit IDs for Android."),
	new cr.Property(ept_text,	"Banner ID (Android)",		"",			"Ad unit ID from admob.com for the banner ad."),
	new cr.Property(ept_text,	"Interstitial ID (Android)", "",		"Ad unit ID from admob.com for the fullscreen ad."),
	
	new cr.Property(ept_section, "iOS", "",	"Ad unit IDs for iOS."),
	new cr.Property(ept_text,	"Banner ID (iOS)",			"",			"Ad unit ID from admob.com for the banner ad."),
	new cr.Property(ept_text,	"Interstitial ID (iOS)",	"",			"Ad unit ID from admob.com for the fullscreen ad."),
	
	new cr.Property(ept_section, "Windows Phone", "",	"Ad unit IDs for Windows Phone."),
	new cr.Property(ept_text,	"Banner ID (WP8)",			"",			"Ad unit ID from admob.com for the banner ad."),
	new cr.Property(ept_text,	"Interstitial ID (WP8)",	"",			"Ad unit ID from admob.com for the fullscreen ad.")
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
	this.just_inserted = false;
};

IDEInstance.prototype.OnCreate = function()
{
};

IDEInstance.prototype.OnInserted = function()
{
};

IDEInstance.prototype.OnDoubleClicked = function()
{
};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};

IDEInstance.prototype.OnRendererInit = function(renderer)
{
};

// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
};

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
};