/* Copyright (c) 2014 Intel Corporation. All rights reserved.
* Use of this source code is governed by a MIT-style license that can be
* found in the LICENSE file.
*/

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.admob = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.admob.prototype;

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
	
	var isSupported = false;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		if (!window["admob"])
		{
			cr.logexport("[Construct 2] com.cranberrygame.phonegap.plugin.ad.admob plugin is required to show Admob ads with Cordova; other platforms are not supported");
			return;
		}
		
		isSupported = true;
		
		this.AdMob = window["admob"];
		
		if (this.AdMob["setLicenseKey"])
			this.AdMob["setLicenseKey"]("support@scirra.com", "2ba99d4ff8c219cf7331c88fb3344f80");
		
		var overlap = (this.properties[0] !== 0);
		var isTesting = (this.properties[1] !== 0);

		this.androidBannerId = this.properties[2];
		this.androidInterstitialId = this.properties[3];
		
		this.iosBannerId = this.properties[4];
		this.iosInterstitialId = this.properties[5];
		
		this.wp8BannerId = this.properties[6];
		this.wp8InterstitialId = this.properties[7];
		
		if (this.runtime.isAndroid)
		{
			this.bannerId = this.androidBannerId;
			this.interstitialId = this.androidInterstitialId;
		}
		else if (this.runtime.isiOS)
		{
			this.bannerId = this.iosBannerId;
			this.interstitialId = this.iosInterstitialId;
		}
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81)
		{
			this.bannerId = this.wp8BannerId;
			this.interstitialId = this.wp8InterstitialId;
		}
		else
		{
			// unsupported platform
			this.bannerId = "";
			this.interstitialId = "";
		}
		
		this.isShowingBannerAd = false;
		this.isShowingInterstitial = false;
		
		this.AdMob["setUp"](this.bannerId, this.interstitialId, overlap, isTesting);
		
		// Attach events. Note both old names and new names used for maximum compatibility.
		var self = this;
		
		this.AdMob["onFullScreenAdLoaded"] = function ()
		{
			self.runtime.trigger(cr.plugins_.admob.prototype.cnds.OnInterstitialReceived, self);
		};
		
		this.AdMob["onInterstitialAdLoaded"] = function ()
		{
			self.runtime.trigger(cr.plugins_.admob.prototype.cnds.OnInterstitialReceived, self);
		};
		
		this.AdMob["onFullScreenAdShown"] = function ()
		{
			self.isShowingInterstitial = true;
			self.runtime.trigger(cr.plugins_.admob.prototype.cnds.OnInterstitialPresented, self);
		};
		
		this.AdMob["onInterstitialAdShown"] = function ()
		{
			self.isShowingInterstitial = true;
			self.runtime.trigger(cr.plugins_.admob.prototype.cnds.OnInterstitialPresented, self);
		};
		
		this.AdMob["onFullScreenAdClosed"] = function ()
		{
			self.isShowingInterstitial = false;
			self.runtime.trigger(cr.plugins_.admob.prototype.cnds.OnInterstitialDismissed, self);
		};
		
		this.AdMob["onInterstitialAdHidden"] = function ()
		{
			self.isShowingInterstitial = false;
			self.runtime.trigger(cr.plugins_.admob.prototype.cnds.OnInterstitialDismissed, self);
		};
		
		this.AdMob["onBannerAdPreloaded"] = function ()
		{
			self.runtime.trigger(cr.plugins_.admob.prototype.cnds.OnBannerAdReceived, self);
		};
	};
	
	function indexToAdSize(i)
	{
		switch (i) {
		case 0:		return "SMART_BANNER";
		case 1:		return "BANNER";
		case 2:		return "MEDIUM_RECTANGLE";
		case 3:		return "FULL_BANNER";
		case 4:		return "LEADERBOARD";
		case 5:		return "SKYSCRAPER";
		}
		
		return "SMART_BANNER";
	};
	
	function indexToAdPosition(i)
	{
		switch (i) {
		case 0:		return "top-left";
		case 1:		return "top-center";
		case 2:		return "top-right";
		case 3:		return "left";
		case 4:		return "center";
		case 5:		return "right";
		case 6:		return "bottom-left";
		case 7:		return "bottom-center";
		case 8:		return "bottom-right";
		}
		
		return "bottom-center";
	};
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsShowingBanner = function()
	{
		return this.isShowingBannerAd;
	};
	
	Cnds.prototype.IsShowingInterstitial = function()
	{
		return this.isShowingInterstitial;
	};
	
	Cnds.prototype.OnInterstitialReceived = function()
	{
		return true;
	};
	
	Cnds.prototype.OnInterstitialPresented = function()
	{
		return true;
	};
	
	Cnds.prototype.OnInterstitialDismissed = function()
	{
		return true;
	};
	
	Cnds.prototype.OnBannerAdReceived = function()
	{
		return true;
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.ShowBanner = function (pos_, size_)
	{
		if (!isSupported)
			return;
		
		this.AdMob["showBannerAd"](indexToAdPosition(pos_), indexToAdSize(size_));
		
		this.isShowingBannerAd = true;
	};

	Acts.prototype.AutoShowInterstitial = function ()
	{
		if (!isSupported)
			return;
		
		// deprecated
		if (this.AdMob["showInterstitialAd"])
			this.AdMob["showInterstitialAd"]();
		else if (this.AdMob["showFullScreenAd"])
			this.AdMob["showFullScreenAd"]();
	};
	
	Acts.prototype.PreloadInterstitial = function ()
	{
		if (!isSupported)
			return;
		
		if (this.AdMob["preloadInterstitialAd"])
			this.AdMob["preloadInterstitialAd"]();
		else if (this.AdMob["preloadFullScreenAd"])
			this.AdMob["preloadFullScreenAd"]();
	};
	
	Acts.prototype.ShowInterstitial = function ()
	{
		if (!isSupported)
			return;
		
		if (this.AdMob["showInterstitialAd"])
			this.AdMob["showInterstitialAd"]();
		else if (this.AdMob["showFullScreenAd"])
			this.AdMob["showFullScreenAd"]();
	};

	Acts.prototype.HideBanner = function ()
	{
		if (!isSupported)
			return;
		
		this.AdMob["hideBannerAd"]();
		this.isShowingBannerAd = false;
	};
	
	Acts.prototype.ReloadInterstitial = function ()
	{
		if (!isSupported)
			return;
		
		// deprecated
		if (this.AdMob["reloadInterstitialAd"])
			this.AdMob["reloadInterstitialAd"]();
		else if (this.AdMob["reloadFullScreenAd"])
			this.AdMob["reloadFullScreenAd"]();
	};
	
	Acts.prototype.ReloadBanner = function ()
	{
		if (!isSupported)
			return;
		
		this.AdMob["reloadBannerAd"]();
	};
	
	Acts.prototype.PreloadBanner = function ()
	{
		if (!isSupported)
			return;
		
		this.AdMob["preloadBannerAd"]();
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	pluginProto.exps = new Exps();

}());