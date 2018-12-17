// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.win8 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.win8.prototype;
		
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
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	var dataRequestEvent = null;
	var wasShareHandled = false;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.isWindows8 = this.runtime.isWindows8App;		// Windows 8 specific (e.g. charms)
		this.isWinJS = this.runtime.isWinJS;				// Windows 8/10+ store app
		
		this.triggerViewState = 0;
		this.isTestMode = (this.properties[0] !== 0);
		this.showAbout = (this.properties[1] !== 0);
		//this.showPreferences = (this.properties[2] !== 0);
		this.showSupport = (this.properties[2] !== 0);
		this.showPrivacy = (this.properties[3] !== 0);
		
		this.appFormattedPrice = "";
		this.lastProductListings = null;
		
		this.currentApp = null;
		this.licenseInfo = null;
		
		var self = this;
		
		if (this.isWinJS)
		{
			var winStore = Windows["ApplicationModel"]["Store"];
			this.currentApp = (this.isTestMode ? winStore["CurrentAppSimulator"] : winStore["CurrentApp"]);
			
			// Throws after Anniversary Update when test mode is off. Don't know why, but handle it as missing if so.
			try {
				this.licenseInfo = this.currentApp["licenseInformation"];
			}
			catch (e)
			{
				console.log("Failed to load license information: ", e);
				this.licenseInfo = null;
			}
		
			if (this.isTestMode)
			{
				new Windows["UI"]["Popups"]["MessageDialog"]("Note: this Windows Store app is in Test Mode, designed for testing purchases. Before publishing, be sure to set Test Mode to 'No' in the Windows Store object's properties.")["showAsync"]();
			}
		
			// Roaming data changed event
			Windows["Storage"]["ApplicationData"]["current"]["addEventListener"]("datachanged", function ()
			{
				self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnDataChanged, self);
			});
			
			// License changed event
			if (this.licenseInfo)
			{
				this.licenseInfo.addEventListener("licensechanged", function() {
					self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnLicenseChanged, self);
				});
			}
			
			// In the test mode load the install directory version of WindowsStoreProxy.xml
			if (this.isTestMode)
			{
				Windows["ApplicationModel"]["Package"]["current"]["installedLocation"]["getFileAsync"]("WindowsStoreProxy.xml").done(
					function (file) {
						Windows["ApplicationModel"]["Store"]["CurrentAppSimulator"]["reloadSimulatorAsync"](file).done(
							function () {
								console.log("[Construct 2] Test mode; loaded WindowsStoreProxy.xml");
							},
							function (msg) {
								console.log("[Construct 2] Error loading WindowsStoreProxy.xml: " + msg);
							});
					},
					function (msg) {
						console.log("[Construct 2] Error loading WindowsStoreProxy.xml: " + msg);
					});
			}
		}
		
		if (this.isWindows8)
		{
			// View state change event
			window.addEventListener("resize", function ()
			{
				self.triggerViewState = Windows["UI"]["ViewManagement"]["ApplicationView"]["value"];
				self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnViewStateChange, self);
			});
			
			// Share charm event
			Windows["ApplicationModel"]["DataTransfer"]["DataTransferManager"]["getForCurrentView"]().addEventListener("datarequested", function (e) {
				dataRequestEvent = e;
				wasShareHandled = false;
				self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnShare, self);
				dataRequestEvent = null;
				
				// Not handled: fail explicitly
				if (!wasShareHandled)
					e["request"]["failWithDisplayText"]("Try selecting a different option before sharing.");
			});
			
			// Settings charm event
			if (this.showAbout || this.showSupport || this.showPrivacy)
			{
				WinJS["Application"].addEventListener("settings", function (e) {
					var cmds = {};
					
					if (self.showAbout)
						cmds["about"] = { "title": "About", "href": "/about.html" };
					//if (self.showPreferences)
					//	cmds["preferences"] = { "title": "Preferences", "href": "/#prefs" };
					if (self.showSupport)
						cmds["support"] = { "title": "Support", "href": "/support.html" };
					if (self.showPrivacy)
						cmds["privacy"] = { "title": "Privacy Policy", "href": "/privacy.html" };
					
					e["detail"]["applicationcommands"] = cmds;
					WinJS["UI"]["SettingsFlyout"]["populateSettings"](e);
				});
			}
		}
	};
	
	instanceProto.roamingValues = function()
	{
		if (this.isWinJS)
			return Windows["Storage"]["ApplicationData"]["current"]["roamingSettings"]["values"];
		else
			return null;
	};
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsWindows8 = function ()
	{
		return this.isWindows8;
	};
	
	Cnds.prototype.IsWindowsStoreApp = function ()
	{
		return this.isWinJS;
	};
	
	Cnds.prototype.OnViewStateChange = function (viewstate)
	{
		if (this.isWindows8)
			return viewstate === this.triggerViewState;
		else
			return false;
	};
	
	Cnds.prototype.CompareViewState = function (viewstate)
	{
		if (this.isWindows8)
			return Windows["UI"]["ViewManagement"]["ApplicationView"]["value"] === viewstate;
		else
			return false;
	};
	
	Cnds.prototype.OnDataChanged = function ()
	{
		return true;
	};
	
	Cnds.prototype.RoamingKeyExists = function (key_)
	{
		if (this.isWinJS)
			return this.roamingValues()["hasKey"](key_);
		else
			return false;
	};
	
	Cnds.prototype.OnShare = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnLicenseChanged = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPurchaseSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPurchaseFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnStoreListing = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsTrial = function ()
	{
		return this.isWinJS && this.licenseInfo && this.licenseInfo["isTrial"] && this.licenseInfo["isActive"];
	};
	
	Cnds.prototype.IsLicensed = function ()
	{
		return this.isWinJS && this.licenseInfo && !this.licenseInfo["isTrial"] && this.licenseInfo["isActive"];
	};
	
	Cnds.prototype.IsExpiredTrial = function ()
	{
		return this.isWinJS && this.licenseInfo && this.licenseInfo["isTrial"] && !this.licenseInfo["isActive"];
	};
	
	Cnds.prototype.HasProduct = function (productid_)
	{
		if (!this.isWinJS || !this.licenseInfo)
			return false;
		
		var productLicenses = this.licenseInfo["productLicenses"];
		
		if (!productLicenses["hasKey"](productid_))
			return false;
			
		return productLicenses["lookup"](productid_)["isActive"];
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.TryUnsnap = function ()
	{
		if (this.isWindows8)
			Windows["UI"]["ViewManagement"]["ApplicationView"]["tryUnsnap"]();
	};
	
	Acts.prototype.SetRoamingValue = function (key_, value_)
	{
		if (this.isWinJS)
			this.roamingValues()[key_] = value_.toString();
	};
	
	Acts.prototype.RemoveRoamingValue = function (key_)
	{
		if (this.isWinJS)
			this.roamingValues()["remove"](key_);
	};
	
	Acts.prototype.ClearRoamingData = function ()
	{
		if (this.isWinJS)
			this.roamingValues()["clear"]();
	};
	
	Acts.prototype.ShowShareUI = function ()
	{
		if (this.isWindows8)
			Windows["ApplicationModel"]["DataTransfer"]["DataTransferManager"]["showShareUI"]();
	};
	
	Acts.prototype.ShareText = function (title_, description_, text_)
	{
		if (this.isWindows8 && dataRequestEvent)
		{
			var request = dataRequestEvent["request"];
			request["data"]["properties"]["title"] = title_;
			request["data"]["properties"]["description"] = description_;
			request["data"]["setText"](text_);
			wasShareHandled = true;
		}
	};
	
	Acts.prototype.ShareLink = function (title_, description_, uri_)
	{
		if (this.isWindows8 && dataRequestEvent)
		{
			var request = dataRequestEvent["request"];
			request["data"]["properties"]["title"] = title_;
			request["data"]["properties"]["description"] = description_;
			request["data"]["setUri"](new Windows["Foundation"]["Uri"](uri_));
			wasShareHandled = true;
		}
	};
	
	Acts.prototype.ShareHTML = function (title_, description_, html_)
	{
		if (this.isWindows8 && dataRequestEvent)
		{
			var request = dataRequestEvent["request"];
			request["data"]["properties"]["title"] = title_;
			request["data"]["properties"]["description"] = description_;
			var htmlFormat = Windows["ApplicationModel"]["DataTransfer"]["HtmlFormatHelper"]["createHtmlFormat"](html_);
			request["data"]["setHtmlFormat"](htmlFormat);
			wasShareHandled = true;
		}
	};
	
	function base64_decode(data)
	{
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		tmp_arr = [];

		do {
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));

			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;

			tmp_arr.push(o1);
			tmp_arr.push(o2);
			tmp_arr.push(o3);
		} while (i < data.length);

		return tmp_arr;
	}

	function dumpDataUriImageToDisk(datauri_, callback_)
	{
		if (datauri_.substr(0, 5) !== "data:")
			return false;		// not a data uri_
			
		var tokens = datauri_.substring(5).split(",");
		
		if (tokens.length !== 2)
			return false;		// not valid format
			
		var ext;
		
		if (tokens[0].indexOf("image/png") > -1)
			ext = "png";
		else if (tokens[0].indexOf("image/jpeg") > -1)
			ext = "jpg";
		else
			return false;		// not a known image format
			
		var filename = "shareimage." + ext;
			
		if (tokens[0].indexOf(";base64") === -1)
			return false;		// only base64 format supported
			
		var binarr = base64_decode(tokens[1]);
		
		var applicationData = Windows["Storage"]["ApplicationData"]["current"];
		var localFolder = applicationData["localFolder"];
		localFolder["createFileAsync"](filename, Windows["Storage"]["CreationCollisionOption"]["replaceExisting"]).then(function(file)
		{
			Windows["Storage"]["FileIO"]["writeBytesAsync"](file, binarr).then(function()
			{
				if (callback_)
					callback_(file);
			});
		});
	};
	
	Acts.prototype.ShareSpriteImage = function (title_, description_, object_)
	{
		if (this.isWindows8 && dataRequestEvent && object_)
		{
			var inst = object_.getFirstPicked();
			
			if (!inst || !inst.curFrame)
				return;
				
			var datauri = inst.curFrame.getDataUri();
			
			var request = dataRequestEvent["request"];
			request["data"]["properties"]["title"] = title_;
			request["data"]["properties"]["description"] = description_;
			var deferral = request["getDeferral"]();
			
			dumpDataUriImageToDisk(datauri, function (file_)
			{
				request["data"]["setBitmap"](Windows["Storage"]["Streams"]["RandomAccessStreamReference"]["createFromFile"](file_));
				deferral.complete();
			});
			
			wasShareHandled = true;
		}
	};
	
	Acts.prototype.ShareDataUri = function (title_, description_, datauri_)
	{
		if (this.isWindows8 && dataRequestEvent)
		{
			var request = dataRequestEvent["request"];
			request["data"]["properties"]["title"] = title_;
			request["data"]["properties"]["description"] = description_;
			var deferral = request["getDeferral"]();
			
			dumpDataUriImageToDisk(datauri_, function (file_)
			{
				request["data"]["setBitmap"](Windows["Storage"]["Streams"]["RandomAccessStreamReference"]["createFromFile"](file_));
				deferral["complete"]();
			});
			
			wasShareHandled = true;
		}
	};
	
	Acts.prototype.FailShare = function (msg_)
	{
		if (this.isWindows8 && dataRequestEvent)
		{
			var request = dataRequestEvent["request"];
			request["failWithDisplayText"](msg_);
			wasShareHandled = true;
		}
	};
	
	var textTileTemplates = ["tileSquareBlock",
							 "tileSquareText02",
							 "tileSquareText04",
							 "tileWideText03",
							 "tileWideText04",
							 "tileWideText09"];
	
	Acts.prototype.SetLiveTileText = function (template_, text1_, text2_)
	{
		template_ = Math.floor(template_);
		
		if (this.isWinJS && template_ >= 0 && template_ < textTileTemplates.length)
		{
			var notifications = Windows["UI"]["Notifications"];
			var tile_template = notifications["TileTemplateType"][textTileTemplates[template_]];
	        var tile_xml = notifications["TileUpdateManager"]["getTemplateContent"](tile_template);

	        var texts = tile_xml.getElementsByTagName("text");
	        texts[0].appendChild(tile_xml.createTextNode(text1_));
			
			if (texts.length >= 2)
				texts[1].appendChild(tile_xml.createTextNode(text2_));

	        var tileNotification = new notifications["TileNotification"](tile_xml);
	        notifications["TileUpdateManager"]["createTileUpdaterForApplication"]()["update"](tileNotification);
		}
	};
	
	Acts.prototype.PurchaseApp = function ()
	{
		if (!this.isWinJS)
			return;
			
		var self = this;
		
		this.currentApp["requestAppPurchaseAsync"](false).then(
			function () {
				console.log("[Construct 2] App purchased OK");
				self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnPurchaseSuccess, self);
			},
			function (msg) {
				console.log("[Construct 2] App purchase failed: " + msg);
				self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnPurchaseFail, self);
			});
	};
	
	Acts.prototype.PurchaseProduct = function (productid_)
	{
		if (!this.isWinJS || !this.licenseInfo)
			return;
			
		var self = this;
		var productLicenses = this.licenseInfo["productLicenses"];
		
		this.currentApp["requestProductPurchaseAsync"](productid_, false).then(
			function () {
				// Sometimes this success handler fires even when the user pressed 'Cancel' for
				// the purchase! To avoid firing 'On successful purchase' in this case, verify
				// that the product ID is active.
				if (productLicenses["hasKey"](productid_) && productLicenses["lookup"](productid_)["isActive"])
				{
					console.log("[Construct 2] Product '" + productid_ + "' purchased OK");
					self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnPurchaseSuccess, self);
				}
				else
				{
					console.log("[Construct 2] Product '" + productid_ + "' purchase finished but product not active (cancelled?)");
					self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnPurchaseFail, self);
				}
			},
			function (msg) {
				console.log("[Construct 2] Product '" + productid_ + "' purchase failed: " + msg);
				self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnPurchaseFail, self);
			});
	};
	
	Acts.prototype.RequestStoreListing = function ()
	{
		if (!this.isWinJS)
			return;
			
		var self = this;
		
		this.currentApp["loadListingInformationAsync"]().then(
			function (listing) {
				console.log("[Construct 2] Listing information loaded");
				
				self.appFormattedPrice = listing["formattedPrice"];
				self.lastProductListings = listing["productListings"];
				self.runtime.trigger(cr.plugins_.win8.prototype.cnds.OnStoreListing, self);
			});
	};
	
	Acts.prototype.OpenWindowsStore = function (opt)
	{
		if (!this.isWinJS)
			return;
		
		// opt: 0 = app page, 1 = publisher page, 2 = review
		var url = "ms-windows-store:";
		var pkg = Windows["ApplicationModel"]["Package"]["current"];
		var pkgid = pkg["id"];
		
		switch (opt) {
		case 0:		// app page
			url += "PDP?PFN=" + pkgid["familyName"];
			break;
		case 1:		// publisher page
			url += "Publisher?name=" + encodeURIComponent(pkg["publisherDisplayName"]);
			break;
		case 2:		// review
			url += "REVIEW?PFN=" + pkgid["familyName"];
			break;
		}
		
		console.log("Opening Windows Store: " + url);
		
		Windows["System"]["Launcher"]["launchUriAsync"](new Windows["Foundation"]["Uri"](url));
	};
	
	Acts.prototype.SetBackButtonVisible = function (v)
	{
		if (!this.runtime.isWindows10 || typeof Windows === "undefined")
			return;
		
		var backButtonVisibility = Windows["UI"]["Core"]["AppViewBackButtonVisibility"];
		Windows["UI"]["Core"]["SystemNavigationManager"]["getForCurrentView"]()["appViewBackButtonVisibility"] = (v === 0 ? backButtonVisibility["collapsed"] : backButtonVisibility["visible"]);
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.RoamingValue = function (ret, key_)
	{
		if (this.isWinJS)
		{
			var v = this.roamingValues()[key_];
			ret.set_string(v ? v.toString() : "");
		}
		else
			ret.set_string("");
	};
	
	Exps.prototype.TrialTimeLeft = function (ret)
	{
		if (this.isWinJS && this.licenseInfo)
			ret.set_float((this.licenseInfo["expirationDate"].getTime() - Date.now()) / 1000.0);
		else
			ret.set_float(0);
	};
	
	Exps.prototype.AppFormattedPrice = function (ret)
	{
		ret.set_string(this.appFormattedPrice);
	};
	
	Exps.prototype.ProductName = function (ret, productid_)
	{
		var result = "";
		
		if (this.isWinJS && this.lastProductListings && this.lastProductListings["hasKey"](productid_))
			result = this.lastProductListings["lookup"](productid_)["name"];
			
		ret.set_string(result);
	};
	
	Exps.prototype.ProductFormattedPrice = function (ret, productid_)
	{
		var result = "";
		
		if (this.isWinJS && this.lastProductListings && this.lastProductListings["hasKey"](productid_))
			result = this.lastProductListings["lookup"](productid_)["formattedPrice"];
			
		ret.set_string(result);
	};

	pluginProto.exps = new Exps();

}());