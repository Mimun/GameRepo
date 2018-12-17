// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.pubcenter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.pubcenter.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// Not supported in directCanvas
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Microsoft pubCenter plugin not supported on this platform");
			return;
		}
		
		// elem must be the label wrapper if a checkbox, otherwise is same as input elem
		this.elem = document.getElementById("c2pubCenterAd");
		
		if (!this.elem)
		{
			cr.logexport("[Construct 2] Microsoft pubCenter plugin not supported on this platform");
			return;
		}
		
		this.appId = this.properties[0];
		this.adUnitId = this.properties[1];
		
		// the banner does not seem to load if we default it to invisible.
		// so we default to displaying it, but position it to -1000,-1000 so it does not appear.
		this.element_hidden = false;
		this.visible = true;
		
		this.x = -1000;
		this.y = -1000;
		this.width = 160;
		this.height = 600;
		
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		
		this.bannerShowing = false;
		
		this.interstitialAd = null;
			
		this.updatePosition(true);
		
		this.runtime.tickMe(this);
	};
	
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree || !this.elem)
			return;
		
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	var last_canvas_offset = null;
	var last_checked_tick = -1;
	
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree || !this.elem)
			return;
		
		// default to screen co-ords
		var left = this.x;
		var top = this.y;
		var right = this.x + this.width;
		var bottom = this.y + this.height;
		
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
		
		// Is invisible: hide
		if (!this.visible)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			
			this.element_hidden = true;
			return;
		}
			
		// Avoid redundant updates
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			
			return;
		}
			
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		
		var offx = Math.round(left);
		var offy = Math.round(top);
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		/*
		propsections.push({
			"title": "Progress bar",
			"properties": [
				{"name": "Value", "value": this.elem["value"]},
				{"name": "Maximum", "value": this.elem["max"]}
			]
		});
		*/
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		/*
		if (name === "Value")
		{
			this.elem["value"] = value;
		}
		else if (name === "Maximum")
		{
			this.elem["max"] = value;
		}
		*/
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsBannerShowing = function ()
	{
		return this.bannerShowing;
	};
	
	Cnds.prototype.OnInterstitialReady = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnInterstitialError = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnInterstitialCompleted = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnInterstitialCancelled = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.ShowBanner = function (pos, size)
	{
		if (this.runtime.isDomFree || !this.elem)
			return;
		
		switch (size) {
		case 0:
			this.width = 160;
			this.height = 600;
			break;
		case 1:
			this.width = 250;
			this.height = 250;
			break;
		case 2:
			this.width = 300;
			this.height = 250;
			break;
		case 3:
			this.width = 300;
			this.height = 600;
			break;
		case 4:
			this.width = 728;
			this.height = 90;
			break;
		}
		
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;
		var x = 0;
		var y = 0;
		var myWidth = this.width;
		var myHeight = this.height;
		
		switch (pos) {
		case 0:		// top-left
			x = 0;
			y = 0;
			break;
		case 1:		// top-center
			x = winWidth / 2 - myWidth / 2;
			y = 0;
			break;
		case 2:		// top-right
			x = winWidth - myWidth;
			y = 0;
			break;
		case 3:		// left
			x = 0;
			y = winHeight / 2 - myHeight / 2;
			break;
		case 4:		// center
			x = winWidth / 2 - myWidth / 2;
			y = winHeight / 2 - myHeight / 2;
			break;
		case 5:		// right
			x = winWidth - myWidth;
			y = winHeight / 2 - myHeight / 2;
			break;
		case 6:		// bottom left
			x = 0;
			y = winHeight - myHeight;
			break;
		case 7:		// bottom center
			x = winWidth / 2 - myWidth / 2;
			y = winHeight - myHeight;
			break;
		case 8:		// bottom right
			x = winWidth - myWidth;
			y = winHeight - myHeight;
			break;
		}
		
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.visible = true;
		this.bannerShowing = true;
	};
	
	Acts.prototype.HideBanner = function ()
	{
		this.visible = false;
		this.bannerShowing = false;
	};
	
	Acts.prototype.PrepareInterstitial = function (otherAdUnitId, type)
	{
		if (typeof MicrosoftNSJS === "undefined")
			return;
		
		this.interstitialAd = new MicrosoftNSJS["Advertising"]["InterstitialAd"]();
		
		var self = this;
		this.interstitialAd["onAdReady"] = function () {
			self.runtime.trigger(cr.plugins_.pubcenter.prototype.cnds.OnInterstitialReady, self);
		};
		this.interstitialAd["onErrorOccurred"] = function () {
			self.runtime.trigger(cr.plugins_.pubcenter.prototype.cnds.OnInterstitialError, self);
		};
		this.interstitialAd["onCompleted"] = function () {
			self.runtime.trigger(cr.plugins_.pubcenter.prototype.cnds.OnInterstitialCompleted, self);
		};
		this.interstitialAd["onCancelled"] = function () {
			self.runtime.trigger(cr.plugins_.pubcenter.prototype.cnds.OnInterstitialCancelled, self);
		};

		var InterstitialAdType = MicrosoftNSJS["Advertising"]["InterstitialAdType"];
		var adType = (type === 0 ? InterstitialAdType["video"] : InterstitialAdType["display"]);
		this.interstitialAd["requestAd"](adType, this.appId, otherAdUnitId || this.adUnitId);
	};
	
	Acts.prototype.ShowInterstitial = function ()
	{
		if (!this.interstitialAd)
			return;
		
		if ((MicrosoftNSJS["Advertising"]["InterstitialAdState"]["ready"]) == (this.interstitialAd["state"]))
		{
			this.interstitialAd["show"]();
		}
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	pluginProto.exps = new Exps();

}());