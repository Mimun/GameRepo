// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.IAP = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// Store definitions
	var isTestMode = false;
	
	/* interface:
	function Store()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.product_id_list = [];
	};
	
	Store.prototype.isAvailable = function () {};
	Store.prototype.supportsConsumables = function () {};
	Store.prototype.addProductIds = function (ids) {};
	Store.prototype.isTrial = function () {};
	Store.prototype.isLicensed = function () {};
	Store.prototype.hasProduct = function (product_) {};
	Store.prototype.purchaseApp = function () {};
	Store.prototype.purchaseProduct = function (product_) {};
	Store.prototype.restorePurchases = function () {};
	Store.prototype.requestStoreListing = function () {};
	Store.prototype.getAppName = function () {};
	Store.prototype.getAppFormattedPrice = function () {};
	Store.prototype.getProductName = function (product_) {};
	Store.prototype.getProductFormattedPrice = function (product_) {};
	*/
	
	/////////////////////////////////////
	// Windows 8 store
	function Windows8Store()
	{		
		var winStore = Windows["ApplicationModel"]["Store"];
		this.currentApp = (isTestMode ? winStore["CurrentAppSimulator"] : winStore["CurrentApp"]);
		
		var self = this;
		
		/*
		this.currentApp["licenseInformation"].addEventListener("licensechanged", function() {
			if (self.onlicensechanged)
				self.onlicensechanged();
		});
		*/
		
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.appName = "";
		this.appFormattedPrice = "";
		
		this.product_id_list = [];
		
		this.lastProductListings = null;
		
		// Warn if in test mode
		if (isTestMode)
		{
			new Windows["UI"]["Popups"]["MessageDialog"]("Note: IAP is in Test Mode, designed for testing purchases. Before publishing, be sure to set Test Mode to 'No' in the object's properties.")["showAsync"]();
			
			// Reload WindowsStoreProxy.xml for testing
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
	};
	
	Windows8Store.prototype.isAvailable = function ()
	{
		return true;
	};
	
	Windows8Store.prototype.supportsConsumables = function ()
	{
		return false;		// not yet, could add support for win 8.1+
	};
	
	Windows8Store.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	Windows8Store.prototype.isTrial = function ()
	{
		return this.currentApp["licenseInformation"]["isTrial"] && this.currentApp["licenseInformation"]["isActive"];
	};
	
	Windows8Store.prototype.isLicensed = function ()
	{
		return !this.currentApp["licenseInformation"]["isTrial"] && this.currentApp["licenseInformation"]["isActive"];
	};
	
	Windows8Store.prototype.hasProduct = function (product_)
	{
		if (product_ === "app")
			return this.isLicensed();
		
		var productLicenses = this.currentApp["licenseInformation"]["productLicenses"];
		
		if (!productLicenses["hasKey"](product_))
			return false;
			
		return productLicenses["lookup"](product_)["isActive"];
	};
	
	Windows8Store.prototype.purchaseApp = function ()
	{
		var self = this;
		
		this.currentApp["requestAppPurchaseAsync"](false).then(
		function () {
			console.log("[Construct 2] App purchased OK");
			
			if (self.onpurchasesuccess)
				self.onpurchasesuccess("app");
		},
		function (msg) {
			console.log("[Construct 2] App purchase failed: " + msg);
			
			if (self.onpurchasefail)
				self.onpurchasefail("app", msg);
		});
	};
	
	Windows8Store.prototype.purchaseProduct = function (product_)
	{
		if (product_ === "app")
		{
			this.purchaseApp();
			return;
		}
		
		var self = this;
		var productLicenses = this.currentApp["licenseInformation"]["productLicenses"];
		
		this.currentApp["requestProductPurchaseAsync"](product_, false).then(
		function () {
			// Sometimes this success handler fires even when the user pressed 'Cancel' for
			// the purchase! To avoid firing 'On successful purchase' in this case, verify
			// that the product ID is active.
			if (productLicenses["hasKey"](product_) && productLicenses["lookup"](product_)["isActive"])
			{
				console.log("[Construct 2] Product '" + product_ + "' purchased OK");
				
				if (self.onpurchasesuccess)
					self.onpurchasesuccess(product_);
			}
			else
			{
				console.log("[Construct 2] Product '" + product_ + "' purchase failed (cancelled?)");
			
				if (self.onpurchasefail)
					self.onpurchasefail(product_, msg);
			}
		},
		function (msg) {
			console.log("[Construct 2] Product '" + product_ + "' purchase failed: " + msg);
			
			if (self.onpurchasefail)
				self.onpurchasefail(product_, msg);
		});
	};
	
	Windows8Store.prototype.restorePurchases = function ()
	{
		// Don't think we need to do anything for Windows 8
	};
	
	Windows8Store.prototype.requestStoreListing = function ()
	{
		var self = this;
		
		this.currentApp["loadListingInformationAsync"]().then(
		function (listing) {
			console.log("[Construct 2] Listing information loaded");
			
			self.appName = listing["name"];
			self.appFormattedPrice = listing["formattedPrice"];
			self.lastProductListings = listing["productListings"];
			
			if (self.onstorelistingsuccess)
				self.onstorelistingsuccess();
		});
	};
	
	Windows8Store.prototype.getAppName = function ()
	{
		return this.appName;
	};
	
	Windows8Store.prototype.getAppFormattedPrice = function ()
	{
		return this.appFormattedPrice;
	};
	
	Windows8Store.prototype.getProductName = function (product_)
	{
		if (!this.lastProductListings)
			return "";
		
		if (this.lastProductListings["hasKey"](product_))
			return this.lastProductListings["lookup"](product_)["name"];
		else
			return "";
	};
	
	Windows8Store.prototype.getProductFormattedPrice = function (product_)
	{
		if (product_ === "app")
			return this.getAppFormattedPrice();
		
		if (!this.lastProductListings)
			return "";
			
		if (this.lastProductListings["hasKey"](product_))
			return this.lastProductListings["lookup"](product_)["formattedPrice"];
		else
			return "";
	};
	
	//////////////////////////////////////
	// CocoonJS store
	function CocoonJSStore()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.product_id_list = [];			// array of product id strings
		
		this.lastProductListings = [];		// array of ProductInfo structs returned from fetchProductsFromStore
		
		this.storeAvailable = ((typeof CocoonJS["Store"]["nativeExtensionObjectAvailable"] !== "undefined") && CocoonJS["Store"]["canPurchase"]());
		
		var self = this;
		
		if (this.storeAvailable)
		{
			CocoonJS["Store"]["onProductPurchaseCompleted"].addEventListener(function (purchase)
			{
				if (self.onpurchasesuccess)
					self.onpurchasesuccess(purchase["productId"]);
				
				CocoonJS["Store"]["addPurchase"](purchase);
				CocoonJS["Store"]["consumePurchase"](purchase["transactionId"], purchase["productId"]);
				CocoonJS["Store"]["finishPurchase"](purchase["transactionId"]);
			});
			
			CocoonJS["Store"]["onProductPurchaseFailed"].addEventListener(function (productId, errorMessage)
			{
				if (self.onpurchasefail)
					self.onpurchasefail(productId, errorMessage);
			});

			CocoonJS["Store"]["onConsumePurchaseCompleted"].addEventListener(function(transactionId)
			{
				if (self.onconsumesuccess)
					self.onconsumesuccess(transactionId);
			});
			
			CocoonJS["Store"]["onConsumePurchaseFailed"].addEventListener(function(transactionId, errorMessage)
			{
				if (self.onconsumefail)
					self.onconsumefail(transactionId, errorMessage);
			});
			
			CocoonJS["Store"]["onProductsFetchFailed"].addEventListener(function ()
			{
				if (self.onstorelistingfail)
					self.onstorelistingfail();
			});
			
			CocoonJS["Store"]["onProductsFetchCompleted"].addEventListener(function (products)
			{
				self.lastProductListings = products;
				
				if (self.onstorelistingsuccess)
					self.onstorelistingsuccess();
			});

			CocoonJS["Store"]["requestInitialization"]({
				"managed": true,
				"sandbox": isTestMode
			});
			
			CocoonJS["Store"]["start"]();
		}
	};
	
	CocoonJSStore.prototype.isAvailable = function ()
	{
		return this.storeAvailable;
	};
	
	CocoonJSStore.prototype.supportsConsumables = function ()
	{
		return this.isAvailable();
	};
	
	CocoonJSStore.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	CocoonJSStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	CocoonJSStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	CocoonJSStore.prototype.hasProduct = function (product_)
	{
		if (!this.isAvailable())
			return false;
		
		return CocoonJS["Store"]["isProductPurchased"](product_);
	};
	
	CocoonJSStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	CocoonJSStore.prototype.purchaseProduct = function (product_)
	{
		if (!this.isAvailable())
			return;
		
		CocoonJS["Store"]["purchaseProduct"](product_);
	};
	
	CocoonJSStore.prototype.restorePurchases = function ()
	{
		if (!this.isAvailable())
			return;
		
		return CocoonJS["Store"]["restorePurchases"]();
	};
	
	CocoonJSStore.prototype.requestStoreListing = function ()
	{
		if (!this.isAvailable())
			return;
		
		CocoonJS["Store"]["fetchProductsFromStore"](this.product_id_list);
	};
	
	CocoonJSStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	CocoonJSStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	CocoonJSStore.prototype.getProductInfoById = function (product_)
	{
		var i, len, p;
		for (i = 0, len = this.lastProductListings.length; i < len; ++i)
		{
			p = this.lastProductListings[i];
			
			if (p["productId"] === product_)
				return p;
		}
		
		return null;
	};
	
	CocoonJSStore.prototype.getProductName = function (product_)
	{
		var p = this.getProductInfoById(product_);
		
		return p ? p["title"] : "";
	};
	
	CocoonJSStore.prototype.getProductFormattedPrice = function (product_)
	{
		var p = this.getProductInfoById(product_);
		
		return p ? p["localizedPrice"] : "";
	};
	
	//////////////////////////////////////
	// Blackberry 10 store
	function Blackberry10Store()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.product_id_list = [];
		
		this.existing_purchases = [];
		
		this.product_info = {};		// map product id to info
		
		if (this.isAvailable())
			blackberry["payment"]["developmentMode"] = isTestMode;
	};
	
	Blackberry10Store.prototype.isAvailable = function ()
	{
		return typeof blackberry !== "undefined";
	};
	
	Blackberry10Store.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	Blackberry10Store.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	Blackberry10Store.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	Blackberry10Store.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	Blackberry10Store.prototype.hasProduct = function (product_)
	{
		return this.existing_purchases.indexOf(product_) !== -1;
	};
	
	Blackberry10Store.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	Blackberry10Store.prototype.purchaseProduct = function (product_)
	{
		if (!this.isAvailable())
			return;
		
		var self = this;
		
		blackberry["payment"]["purchase"]({ "digitalGoodID": product_ }, function (e)
		{
			// on success
			if (self.existing_purchases.indexOf(product_) === -1)
				self.existing_purchases.push(product_);
			
			if (self.onpurchasesuccess)
				self.onpurchasesuccess(product_);
			
		}, function (e)
		{
			// on error
			if (self.onpurchasefail)
				self.onpurchasefail(product_, e["errorText"]);
		});
	};
	
	Blackberry10Store.prototype.restorePurchases = function ()
	{
		if (!this.isAvailable())
			return;
		
		blackberry["payment"]["getExistingPurchases"](true, function (e)
		{
			// on success
			var i, len, p;
			for (i = 0, len = e.length; i < len; ++i)
			{
				p = e[i]["digitalGoodID"];
				
				if (self.existing_purchases.indexOf(p) === -1)
					self.existing_purchases.push(p);
			}
			
		}, function (e)
		{
			// on error
		});
	};
	
	Blackberry10Store.prototype.requestStoreListing = function ()
	{
		if (!this.isAvailable())
			return;
		
		var self = this;
		
		// have to call getPrice separately for each product id... and then we don't even
		// find out the product names...
		var i, len, p;
		
		for (i = 0, len = this.product_id_list.length; i < len; ++i)
		{
			p = this.product_id_list[i];
			
			(function (id) {
				// not clear on the API here so specified ID both ways
				blackberry["payment"]["getPrice"]({ "id": id, "digitalGoodID": id }, function (e)
				{
					// on success
					self.product_info[id] = { price: e["price"] };
					
				}, function (e) {
					// on error (don't handle)
				});
			})(p);
		}
		
		blackberry["payment"]["getExistingPurchases"](true, function (e)
		{
			// on success
			var i, len, p;
			for (i = 0, len = e.length; i < len; ++i)
			{
				p = e[i]["digitalGoodID"];
				
				if (self.existing_purchases.indexOf(p) === -1)
					self.existing_purchases.push(p);
			}
			
			if (self.onstorelistingsuccess)
				self.onstorelistingsuccess();
			
		}, function (e)
		{
			// on error
			if (self.onstorelistingfail)
				self.onstorelistingfail();
		});
	};
	
	Blackberry10Store.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	Blackberry10Store.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	Blackberry10Store.prototype.getProductName = function (product_)
	{
		// not supported!
		return product_;
	};
	
	Blackberry10Store.prototype.getProductFormattedPrice = function (product_)
	{
		// may not be immediately available in onstorelistingsuccess...
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].price.toString();
		else
			return "";
	};
	
	///////////////////////////////////
	// Amazon AppStore
	function AmazonStore()
	{
		this.onpurchasesuccess = null;		// function (productid)
		this.onpurchasefail = null;			// function (productid, errorMessage)
		
		this.onconsumesuccess = null;		// function (transactionid)
		this.onconsumefail = null;			// function (transactionid, errorMessage)
		
		this.onstorelistingsuccess = null;	// function ()
		this.onstorelistingfail = null;		// function ()
		
		this.product_id_list = [];
		
		this.owned_products = [];
		this.product_info = {};
		
		var self = this;
		
		if (this.isAvailable())
		{
			if (isTestMode)
				amzn_wa["enableApiTester"](amzn_wa_tester);
			
			amzn_wa["IAP"]["registerObserver"]({
				"onSdkAvailable": function (e)
				{
					if (e["isSandboxMode"])
						alert("Note: running in test mode. Be sure to set 'Test mode' to 'No' before publishing.");
					
					amzn_wa["IAP"]["getPurchaseUpdates"](amzn_wa["IAP"]["Offset"]["BEGINNING"]);
				},
				"onItemDataResponse": function (e)
				{
					var i, len, p;
					for (i = 0, len = e["itemData"].length; i < len; ++i)
					{
						p = e["itemData"][i];
						
						self.product_info[p["sku"]] = {
							title: p["title"],
							description: p["description"],
							price: p["price"]
						};
					}
					
					if (self.onstorelistingsuccess)
						self.onstorelistingsuccess();
				},
				"onPurchaseResponse": function (e)
				{
					var sku = (e["receipt"] ? e["receipt"]["sku"] : "");
					
					if (e["purchaseRequestStatus"] == amzn_wa["IAP"]["PurchaseStatus"]["SUCCESSFUL"])
					{
						if (self.owned_products.indexOf(sku) === -1)
							self.owned_products.push(sku);
						
						if (self.onpurchasesuccess)
							self.onpurchasesuccess(sku);
					}
					else
					{
						if (self.onpurchasefail)
							self.onpurchasefail(sku, "purchase was not successful");
					}
				},
				"onPurchaseUpdatesResponse": function (e)
				{
					var i, len, r;
					for (i = 0, len = e["receipts"].length; i < len; ++i)
					{
						r = e["receipts"][i];
						
						if (r["sku"] && self.owned_products.indexOf(r["sku"]) === -1)
							self.owned_products.push(r["sku"]);
					}
				}
			});
			
			this.restorePurchases();		// won't know which products we own otherwise
		}
	};
	
	AmazonStore.prototype.isAvailable = function ()
	{
		return typeof amzn_wa !== "undefined" && amzn_wa["IAP"];
	};
	
	AmazonStore.prototype.supportsConsumables = function ()
	{
		return false;		// not yet...
	};
	
	AmazonStore.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	AmazonStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	AmazonStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	AmazonStore.prototype.hasProduct = function (product_)
	{
		return this.owned_products.indexOf(product_) !== -1;
	};
	
	AmazonStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	AmazonStore.prototype.purchaseProduct = function (product_)
	{
		if (!this.isAvailable())
			return;
		
		amzn_wa["IAP"]["purchaseItem"](product_);
	};
	
	AmazonStore.prototype.restorePurchases = function ()
	{
		if (!this.isAvailable())
			return;
		
		amzn_wa["IAP"]["getPurchaseUpdates"](amzn_wa["IAP"]["Offset"]["BEGINNING"]);
	};
	
	AmazonStore.prototype.requestStoreListing = function ()
	{
		if (!this.isAvailable())
			return;
		
		amzn_wa["IAP"]["getItemData"](this.product_id_list);
	};
	
	AmazonStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	AmazonStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	AmazonStore.prototype.getProductName = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].title;
		else
			return "";
	};
	
	AmazonStore.prototype.getProductFormattedPrice = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].price.toString();
		else
			return "";
	};
	
	///////////////////////////////////
	// Tizen store
	function TizenStore(groupId_)
	{
		this.onpurchasesuccess = null;		// function (productid)
		this.onpurchasefail = null;			// function (productid, errorMessage)
		
		this.onconsumesuccess = null;		// function (transactionid)
		this.onconsumefail = null;			// function (transactionid, errorMessage)
		
		this.onstorelistingsuccess = null;	// function ()
		this.onstorelistingfail = null;		// function ()
		
		this.product_id_list = [];
		this.owned_products = [];
		this.product_info = {};
		
		this.nextTransId = 1;
		this.groupId = groupId_;
		
		var self = this;
		
		if (this.isAvailable())
		{
			window["tizen_iap"]["RegisterCallback"]({
				"OnItemInformationListReceived": function (transactionId, statusCode, itemInfoList)
				{
					if (isTizenStatusOk(statusCode))
					{
						var i = parseInt(itemInfoList["_startNumber"]);
						var end = parseInt(itemInfoList["_endNumber"]) + 1;
						
						for ( ; i < end; ++i)
						{
							var itemId = itemInfoList[i + "_itemId"] + "";
							var itemGroupId = itemInfoList[i + "_itemGroupId"] + "";
							var itemName = itemInfoList[i + "_itemName"] + "";
							var itemPrice = itemInfoList[i + "_itemPrice"] + "";
							var itemDescription = itemInfoList[i + "_itemDescription"] + "";
							
							self.product_info[itemId] = {
								title: itemName,
								groupId: itemGroupId,
								price: itemPrice,
								description: itemDescription
							};
						}
						
						if (self.onstorelistingsuccess)
							self.onstorelistingsuccess();
					}
					else
					{
						if (self.onstorelistingfail)
							self.onstorelistingfail();
					}
				},
				"OnPurchasedItemInformationListReceived": function (transactionId, statusCode, itemInfoList)
				{
					if (!isTizenStatusOk(statusCode))
						return;
					
					var i = parseInt(itemInfoList["_startNumber"]);
					var end = parseInt(itemInfoList["_endNumber"]) + 1;
					
					for ( ; i < end; ++i)
					{
						var itemId = itemInfoList[i + "_itemId"] + "";
						
						if (self.owned_products.indexOf(itemId) === -1)
							self.owned_products.push(itemId);
					}
				},
				"OnPurchaseItemInitialized": function (transactionId, statusCode, purchaseTicket)
				{
					return true;
				},
				"OnPurchaseItemFinished": function (transactionId, statusCode, itemInfo)
				{
					var itemId = itemInfo["_itemId"];
					
					if (isTizenStatusOk(statusCode))
					{
						if (self.owned_products.indexOf(itemId) === -1)
							self.owned_products.push(itemId);
						
						if (self.onpurchasesuccess)
							self.onpurchasesuccess(itemId);
					}
					else
					{
						if (self.onpurchasefail)
							self.onpurchasefail(itemId, "purchase failed");
					}
				},
				"OnCountryListReceived": function (transactionId, statusCode, countryList)
				{
				}
			});
			
			this.restorePurchases();		// won't be able to tell which products we own otherwise
		}
	};
	
	function isTizenStatusOk(status)
	{
		return parseInt(status, 10) == 0;
	};
	
	TizenStore.prototype.isAvailable = function ()
	{
		return typeof window["tizen_iap"] !== "undefined";
	};
	
	TizenStore.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	TizenStore.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	TizenStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	TizenStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	TizenStore.prototype.hasProduct = function (product_)
	{
		return this.owned_products.indexOf(product_) !== -1;
	};
	
	TizenStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	TizenStore.prototype.purchaseProduct = function (product_)
	{
		if (!this.isAvailable())
			return;
			
		if (!this.product_info.hasOwnProperty(product_))
		{
			if (this.onpurchasefail)
				this.onpurchasefail(product_, "unrecognized product id");
		}
		
		var pi = this.product_info[product_];
		
		var data = {};
		data['_itemId'] = product_;
		data['_itemGroupId'] = pi.groupId;
		data['_transactionId'] = this.nextTransId++;
		
		if (isTestMode)
		{
			data['_mode'] = 1;		// developer mode
			data['_mcc'] = "";
			data['_mnc'] = "";
		}
		else
		{
			data['_mode'] = 0;		// commercial mode
		}
		
		data['_deviceModel'] = "tizen";		// ???
		
		window["tizen_iap"]["RequestPurchaseItem"](data);
	};
	
	TizenStore.prototype.restorePurchases = function ()
	{
		var data = {}
		data['_transactionId'] = this.nextTransId++;
		data['_startNumber'] = 1;
		data['_endNumber'] = 100;
		data['_itemGroupId'] = this.groupId;
		
		if (isTestMode)
		{
			data['_mode'] = 1;		// developer mode
			data['_mcc'] = "";
			data['_mnc'] = "";
		}
		else
		{
			data['_mode'] = 0;		// commercial mode
		}
		
		data['_deviceModel'] = "tizen";		// ???
		
		window["tizen_iap"]["RequestPurchasedItemInformationList"](data);
	};
	
	TizenStore.prototype.requestStoreListing = function ()
	{
		var data = {}
		data['_transactionId'] = this.nextTransId++;
		data['_startNumber'] = 1;
		data['_endNumber'] = 100;
		data['_itemGroupId'] = this.groupId;
		
		if (isTestMode)
		{
			data['_mode'] = 1;		// developer mode
			data['_mcc'] = "";
			data['_mnc'] = "";
		}
		else
		{
			data['_mode'] = 0;		// commercial mode
		}
		
		data['_deviceModel'] = "tizen";		// ???
		
		window["tizen_iap"]["RequestItemInformationList"](data);
	};
	
	TizenStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	TizenStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	TizenStore.prototype.getProductName = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].title;
		else
			return "";
	};
	
	TizenStore.prototype.getProductFormattedPrice = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].price;
		else
			return "";
	};
	
	function EjectaStore()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.product_id_list = [];
		
		this.product_info = {};
		this.owned_products = {};
		
		this.iap = new Ejecta["IAPManager"]();
		
		this.restorePurchases();		// won't know owned products otherwise
	};
	
	EjectaStore.prototype.isAvailable = function ()
	{
		return true;
	};
	
	EjectaStore.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	EjectaStore.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	EjectaStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	EjectaStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	EjectaStore.prototype.hasProduct = function (product_)
	{
		return this.owned_products.hasOwnProperty(product_) && this.owned_products[product_];
	};
	
	EjectaStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	EjectaStore.prototype.purchaseProduct = function (product_)
	{
		if (!this.product_info.hasOwnProperty(product_))
			return;
		
		var product = this.product_info[product_];
		
		var self = this;
		
		product["purchase"](1, function (error, transaction)
		{
			if (error)
			{
				if (self.onpurchasefail)
					self.onpurchasefail(product_, error || "");
				
				return;
			}
			
			self.owned_products[product_] = true;
			
			if (self.onpurchasesuccess)
				self.onpurchasesuccess(product_);
		});
	};
	
	EjectaStore.prototype.restorePurchases = function ()
	{
		var self = this;
		
		this.iap["restoreTransactions"](function (error, transactions)
		{
			if (error)
				return;
			
			var i, len, t;
			for (i = 0, len = transactions.length; i < len; ++i)
			{
				t = transactions[i];
				self.owned_products[t["productId"]] = true;
			}
		});
	};
	
	EjectaStore.prototype.requestStoreListing = function ()
	{
		var self = this;
		
		this.iap["getProducts"](this.product_id_list, function (error, products)
		{
			if (error)
			{
				if (self.onstorelistingfail)
					self.onstorelistingfail();
				
				return;
			}
			
			var i, len, p;
			for (i = 0, len = products.length; i < len; ++i)
			{
				p = products[i];
				self.product_info[p["id"]] = p;
			}
			
			if (self.onstorelistingsuccess)
				self.onstorelistingsuccess();
		});
	};
	
	EjectaStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	EjectaStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	EjectaStore.prototype.getProductName = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_]["title"];
		else
			return "";
	};
	
	EjectaStore.prototype.getProductFormattedPrice = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_]["price"];
		else
			return "";
	};
	
	function ChromeWebStore()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.product_id_list = [];
		
		this.product_info = {};
		this.owned_products = {};
		
		this.restorePurchases();		// won't know owned products otherwise
	};
	
	ChromeWebStore.prototype.isAvailable = function ()
	{
		return true;
	};
	
	ChromeWebStore.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	ChromeWebStore.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	ChromeWebStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	ChromeWebStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	ChromeWebStore.prototype.hasProduct = function (product_)
	{
		return this.owned_products.hasOwnProperty(product_) && this.owned_products[product_];
	};
	
	ChromeWebStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	ChromeWebStore.prototype.purchaseProduct = function (product_)
	{
		var self = this;
		
		google["payments"]["inapp"]["buy"]({	
			"parameters": {"env": "prod"},
			"sku": product_,
			"success": function (purchase)
			{
				self.owned_products[product_] = true;
			
				if (self.onpurchasesuccess)
					self.onpurchasesuccess(product_);
			},
			"failure": function (purchase)
			{
				if (self.onpurchasefail)
					self.onpurchasefail(product_, purchase["response"]["errorType"].toString());
			}
		});
	};
	
	ChromeWebStore.prototype.restorePurchases = function ()
	{
		var self = this;
		
		google["payments"]["inapp"]["getPurchases"]({
			"parameters": {"env": "prod"},
			"success": function (e)
			{
				var details = e["response"]["details"];
				
				var i, len, p;
				for (i = 0, len = details.length; i < len; ++i)
				{
					p = details[i];
					
					if (p["state"] === "ACTIVE")
					{
						self.owned_products[p["sku"]] = true;
					}
				}
			},
			"failure": function (e)
			{
				console.log("Failed to restore purchases", e);
			}
		});
	};
	
	ChromeWebStore.prototype.requestStoreListing = function ()
	{
		var self = this;
		
		google["payments"]["inapp"]["getSkuDetails"]({
			"parameters": {"env": "prod"},
			"success": function (e)
			{
				var products = e["response"]["details"]["inAppProducts"];
				var i, len, p;
				for (i = 0, len = products.length; i < len; ++i)
				{
					p = products[i];
					
					if (p["state"] !== "ACTIVE")
						continue;
					
					self.product_info[p["sku"]] = {
						"title": p["localeData"][0]["title"],
						"price": (parseFloat(p["prices"][0]["valueMicros"]) / 1000).toString()
					};
				}
				
				if (self.onstorelistingsuccess)
					self.onstorelistingsuccess();
			},
			"failure": function (e)
			{
				if (self.onstorelistingfail)
					self.onstorelistingfail();
			}
		});
	};
	
	ChromeWebStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	ChromeWebStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	ChromeWebStore.prototype.getProductName = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_]["title"];
		else
			return "";
	};
	
	ChromeWebStore.prototype.getProductFormattedPrice = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_]["price"];
		else
			return "";
	};
	
	function CordovaiOSStore()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.product_id_list = [];
		
		this.iap = window["store"];
		this.iap["verbosity"] = this.iap["INFO"];
		
		this.loaded = false;
		this.isReady = false;
		this.lastProductId = "";
		
		var self = this;
		
		console.log("[C2 IAP] Start");
		
		this.iap["ready"](function ()
		{
			self.isReady = true;
			
			console.log("[C2 IAP] On store ready");
			
			if (self.onstorelistingsuccess)
				self.onstorelistingsuccess();
		});
	};
	
	CordovaiOSStore.prototype.loadProductIds = function ()
	{
		console.log("[C2 IAP] Loading product IDs");
		
		var self = this;
		var i, len;
		for (i = 0, len = this.product_id_list.length; i < len; ++i)
		{
			console.log("[C2 IAP] Registering product ID: " + this.product_id_list[i]);
			
			this.iap["register"]({
				"id": this.product_id_list[i],
				"alias": this.product_id_list[i],
				"type": this.iap["NON_CONSUMABLE"]
			});
		}
		
		// Auto-finish product purchases
		this.iap["when"]("product")["approved"](function(p) {
			console.log("[C2 IAP] Product approved, finishing... [" + p["alias"] + "]");
			p["finish"]();
		});
		
		// Trigger purchase success events
		this.iap["when"]("product")["owned"](function(p) {
			console.log("[C2 IAP] Product owned, calling 'On purchase success' [" + p["alias"] + "]");
			if (self.onpurchasesuccess)
				self.onpurchasesuccess(self.lastProductId);
		});
		
		// Trigger purchase failure events
		this.iap["when"]("product")["error"](function(e) {
			console.log("[C2 IAP] Product error");
			if (self.onpurchasefail)
				self.onpurchasefail(self.lastProductId, "Error " + e["code"] + ": " + e["message"]);
		});
		
		// Alert errors (todo: improve)
		this.iap["error"](function(e){
			console.log("[C2 IAP] Error: " + e["code"] + ": " + e["message"]);
		});
	};
	
	CordovaiOSStore.prototype.isAvailable = function ()
	{
		return true;
	};
	
	CordovaiOSStore.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	CordovaiOSStore.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	CordovaiOSStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	CordovaiOSStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	CordovaiOSStore.prototype.hasProduct = function (product_)
	{
		var p = this.iap["get"](product_);
		
		return p && p["owned"];
	};
	
	CordovaiOSStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	CordovaiOSStore.prototype.purchaseProduct = function (product_)
	{
		if (!this.loaded)
			return;
		
		console.log("[C2 IAP] Purchasing '" + product_ + "'...");
		this.lastProductId = product_;
		this.iap["order"](product_);
	};
	
	CordovaiOSStore.prototype.restorePurchases = function ()
	{
		if (!this.loaded)
			return;
		
		console.log("[C2 IAP] Restoring purchases...");
		this.iap["refresh"]();
	};
	
	CordovaiOSStore.prototype.requestStoreListing = function ()
	{
		console.log("[C2 IAP] Requesting store listing...");
		
		if (!this.loaded)
		{
			this.loadProductIds();
			this.loaded = true;
		}
		
		console.log("[C2 IAP] Requesting store listing: 'refresh'...");
		this.iap["refresh"]();
	};
	
	CordovaiOSStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	CordovaiOSStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	CordovaiOSStore.prototype.getProductName = function (product_)
	{
		var p = this.iap["get"](product_);
		
		if (!p)
			return "<unknown product id>";
		
		return p["title"];
	};
	
	CordovaiOSStore.prototype.getProductFormattedPrice = function (product_)
	{
		var p = this.iap["get"](product_);
		
		if (!p)
			return "<unknown product id>";
		
		return p["price"];
	};
	
	function CordovaAndroidStore()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
		this.product_id_list = [];
		
		this.product_info = {};
		this.owned_products = {};
		
		this.iap = window["inappbilling"];
		var self = this;
		
		this.iap["init"](function () {
			// Wait 100ms to ensure product ids set then restore purchases
			window.setTimeout(function () {
				self.restorePurchases();
			}, 100);
		},
		function (e) {
			cr.logexport("[C2] Error initialising Android IAP: " + e);
		},
		{ "showLog": isTestMode });
	};
	
	CordovaAndroidStore.prototype.isAvailable = function ()
	{
		return true;
	};
	
	CordovaAndroidStore.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	CordovaAndroidStore.prototype.addProductIds = function (idstring)
	{
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
	};
	
	CordovaAndroidStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	CordovaAndroidStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	CordovaAndroidStore.prototype.hasProduct = function (product_)
	{
		return this.owned_products.hasOwnProperty(product_) && this.owned_products[product_];
	};
	
	CordovaAndroidStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	CordovaAndroidStore.prototype.purchaseProduct = function (product_)
	{
		var self = this;
		
		this.iap["buy"](function (info) {
			self.owned_products[product_] = true;
			
			if (self.onpurchasesuccess)
				self.onpurchasesuccess(product_);
		}, function (e) {
			if (self.onpurchasefail)
				self.onpurchasefail(product_, "purchase failed");
		}, product_);
	};
	
	CordovaAndroidStore.prototype.restorePurchases = function ()
	{
		var self = this;
		
		this.iap["getPurchases"](function (productIds) {
			var i, len, p;
			for (i = 0, len = productIds.length; i < len; ++i)
			{
				p = productIds[i];
				self.owned_products[p["productId"]] = true;
			}
		}, function (e) {
			cr.logexport("[C2] Android IAP restore purchases error: " + e);
		});
	};
	
	CordovaAndroidStore.prototype.requestStoreListing = function ()
	{
		var self = this;
		
		this.iap["getAvailableProducts"](function (productIds) {
			var n, p;
			for (n in productIds)
			{
				p = productIds[n];
				self.product_info[p["productId"]] = p;		// "title", "price", "description"
			}
			
			if (self.onstorelistingsuccess)
				self.onstorelistingsuccess();
		}, function (e) {
			if (self.onstorelistingfail)
				self.onstorelistingfail();
		});
	}
	
	CordovaAndroidStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	CordovaAndroidStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	CordovaAndroidStore.prototype.getProductName = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_]["title"];
		else
			return "";
	};
	
	CordovaAndroidStore.prototype.getProductFormattedPrice = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_]["price"];
		else
			return "";
	};
	
	/////////////////////////////////////
	var pluginProto = cr.plugins_.IAP.prototype;
		
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
		this.store = null;
		
		isTestMode = (this.properties[0] !== 0);
		
		this.tizenGroupId = this.properties[1];
		
		this.productId = "";
		this.errorMessage = "";
		
		if (this.runtime.isWinJS && !this.runtime.isWindows8Capable)
		{
			this.store = new Windows8Store();
		}
		else if (this.runtime.isCocoonJs)
		{
			this.store = new CocoonJSStore();
		}
		else if (this.runtime.isBlackberry10)
		{
			this.store = new Blackberry10Store();
		}
		else if (this.runtime.isAmazonWebApp)
		{
			this.store = new AmazonStore();
		}
		else if (this.runtime.isTizen)
		{
			this.store = new TizenStore(this.tizenGroupId);
		}
		else if (this.runtime.isEjecta)
		{
			this.store = new EjectaStore();
		}
		else if (this.runtime.isCordova)
		{
			if (this.runtime.isiOS && window["store"])
			{
				this.store = new CordovaiOSStore();
			}
			else if (this.runtime.isAndroid && window["inappbilling"])
			{
				this.store = new CordovaAndroidStore();
			}
		}
		else if (window["google"] &&
				 window["google"]["payments"] &&
				 window["google"]["payments"]["inapp"])
		{
			this.store = new ChromeWebStore();
		}
		
		var self = this;
		
		if (this.store)
		{
			this.store.onpurchasesuccess = function (product_)
			{
				self.productId = product_;
				self.errorMessage = "";
				self.runtime.trigger(cr.plugins_.IAP.prototype.cnds.OnPurchaseSuccess, self);
				self.runtime.trigger(cr.plugins_.IAP.prototype.cnds.OnAnyPurchaseSuccess, self);
			};
			
			this.store.onpurchasefail = function (product_, error_)
			{
				self.productId = product_;
				self.errorMessage = error_;
				self.runtime.trigger(cr.plugins_.IAP.prototype.cnds.OnPurchaseFail, self);
				self.runtime.trigger(cr.plugins_.IAP.prototype.cnds.OnAnyPurchaseFail, self);
			};
			
			this.store.onstorelistingsuccess = function ()
			{
				self.runtime.trigger(cr.plugins_.IAP.prototype.cnds.OnStoreListingSuccess, self);
			};
			
			this.store.onstorelistingfail = function ()
			{
				self.runtime.trigger(cr.plugins_.IAP.prototype.cnds.OnStoreListingFail, self);
			};
		}
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		/*
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
		*/
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		//if (name === "My property")
		//	this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnPurchaseSuccess = function (product_)
	{
		return product_ === this.productId;
	};
	
	Cnds.prototype.OnAnyPurchaseSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPurchaseFail = function (product_)
	{
		return product_ === this.productId;
	};
	
	Cnds.prototype.OnAnyPurchaseFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnStoreListingSuccess = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnStoreListingFail = function ()
	{
		return true;
	};
	
	Cnds.prototype.HasProduct = function (product_)
	{
		return this.store && this.store.hasProduct(product_);
	};
	
	Cnds.prototype.IsAvailable = function ()
	{
		return this.store && this.store.isAvailable();
	};
	
	Cnds.prototype.IsAppPurchased = function ()
	{
		return this.store && this.store.isLicensed();
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.AddProductID = function (product_)
	{
		if (!this.store)
			return;
		
		this.store.addProductIds(product_);
	};
	
	Acts.prototype.PurchaseProduct = function (product_)
	{
		if (!this.store)
			return;
		
		this.store.purchaseProduct(product_);
	};
	
	Acts.prototype.PurchaseApp = function ()
	{
		if (!this.store)
			return;
		
		this.store.purchaseApp();
	};
	
	Acts.prototype.RestorePurchases = function ()
	{
		if (!this.store)
			return;
		
		this.store.restorePurchases();
	};
	
	Acts.prototype.RequestStoreListing = function ()
	{
		if (!this.store)
			return;
		
		this.store.requestStoreListing();
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.ProductName = function (ret, product_)
	{
		ret.set_string(this.store ? this.store.getProductName(product_) : "");
	};
	
	Exps.prototype.ProductPrice = function (ret, product_)
	{
		ret.set_string(this.store ? this.store.getProductFormattedPrice(product_) : "");
	};
	
	Exps.prototype.AppName = function (ret)
	{
		ret.set_string(this.store ? this.store.getAppName() : "");
	};
	
	Exps.prototype.AppPrice = function (ret)
	{
		ret.set_string(this.store ? this.store.getAppFormattedPrice() : "");
	};
	
	Exps.prototype.ProductID = function (ret)
	{
		ret.set_string(this.productId);
	};
	
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(this.errorMessage);
	};
	
	pluginProto.exps = new Exps();

}());