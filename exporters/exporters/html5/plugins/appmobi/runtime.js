// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.appMobi = function(runtime)
{
	this.runtime = runtime;
};


(function ()
{
	var pluginProto = cr.plugins_.appMobi.prototype;
		
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
	
	var appMobiEnabled=false;
	var appMobiObj={};
	var evtRemoteDataResponse='';
	var evtBarCodeResponse='';
	var evtConnection='';
	var evtRemoteStatus='idle';
	var accelerometer={x:0,y:0,z:0};
	var appMobiRuntime = null;
	var appMobiInst = null;
	
	// for executing in webview in DC mode
	var awex = null;
	
	
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;		
	};
	
	//////////////////////////////////////
	// APPMOBI EVENTS
	var amev = {};
	var isDC = false;
	
	amev.getRemoteDataEvent = function(event)
	{
		try {
			if(event.success)
			{
				evtRemoteDataResponse=event.response;
				appMobiRuntime.trigger(cr.plugins_.appMobi.prototype.cnds.OnRemoteData, appMobiInst);
			}
		} catch(e){}
	};
	
	amev.barcodeScanned = function(event)
	{
		try {
			if(event.success)
			{
				evtBarCodeResponse=event.codedata;
				appMobiRuntime.trigger(cr.plugins_.appMobi.prototype.cnds.OnBarcodeScanned, appMobiInst);
			}
		} catch(e){}
	};
	
	amev.connectionUpdate = function(event)
	{
		try {
			if(event.success)
			{
				evtConnection=event.connection;
			}
		} catch(e){}
	};
	
	amev.remoteClosed = function(event)
	{
		try {
			if(event.success)
			{
				evtRemoteStatus='closed';
				appMobiRuntime.trigger(cr.plugins_.appMobi.prototype.cnds.OnRemoteSiteClosed, appMobiInst);
			}
		} catch(e){}
	};
	
	amev.onBack = function(event)
	{
		appMobiRuntime.trigger(cr.plugins_.appMobi.prototype.cnds.OnBack, appMobiInst);
	};
	
	amev.barcodeScanned = function(event){ try{ if(event.success){ evtBarCodeResponse=event.codedata; } }catch(e){} }
	amev.connectionUpdate = function(event){ try{ if(event.success){ evtConnection=event.connection; } }catch(e){} }
	amev.remoteClosed = function(event){ try{ evtRemoteStatus='closed'; }catch(e){} }
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		appMobiRuntime = this.runtime;
		appMobiInst = this;
		isDC = this.runtime.isDirectCanvas;
		
		if (isDC)
			awex = AppMobi["webview"]["execute"];
		
		if (typeof window["AppMobi"] !== "undefined" && !isDC)
		{
			appMobiObj = window["AppMobi"];
			appMobiEnabled = true;
			
			document.addEventListener("appMobi.device.remote.data", amev.getRemoteDataEvent,false);
			document.addEventListener("appMobi.device.barcode.scan", amev.barcodeScanned, false);
			document.addEventListener("appMobi.device.connection.update", amev.connectionUpdate, false);
			document.addEventListener("appMobi.device.remote.close", amev.remoteClosed, false);
			document.addEventListener("appMobi.device.hardware.back", amev.onBack, false);
		}
	};
	
	instanceProto.onLayoutChange = function ()
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	/*********************************************************	
		DEVICE
	*********************************************************/	
	Cnds.prototype.deviceHasCaching = function ()
	{
		if (!appMobiEnabled || isDC)
			return false;
		
		return appMobiObj['device']['hasCaching'];
	};
	
	Cnds.prototype.deviceHasPush = function ()
	{
		if (!appMobiEnabled || isDC)
			return false;
			
		return appMobiObj['device']['hasPush'];
	};
	
	Cnds.prototype.deviceHasStreaming = function ()
	{
		if (!appMobiEnabled || isDC)
			return false;
			
		return appMobiObj['device']['hasStreaming'];
	};
	
	Cnds.prototype.deviceHasUpdates = function ()
	{
		if (!appMobiEnabled || isDC)
			return false;
			
		return appMobiObj['device']['hasUpdates'];
	};
	
	Cnds.prototype.isInAppMobi = function ()
	{
		return appMobiEnabled || isDC;
	};
	
	var orients_array = [0, -90, 90, 180];
	
	Cnds.prototype.compareOrientation = function (o)
	{
		if (!appMobiEnabled || isDC)
			return (o === 0);	// assume portrait when not in appMobi
			
		return orients_array[o] === parseInt(appMobiObj['device']['orientation']);
	};
	
	Cnds.prototype.compareInitialOrientation = function (o)
	{
		if (!appMobiEnabled || isDC)
			return (o === 0);	// assume was in portrait when not in appMobi
			
		return orients_array[o] === parseInt(appMobiObj['device']['initialOrientation']);
	};
	
	Cnds.prototype.OnBarcodeScanned = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnRemoteSiteClosed = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnRemoteData = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnBack = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.deviceCloseRemoteSite = function ()
	{
		try {
			if (isDC)
				awex("AppMobi['device']['closeRemoteSite']();");
			else
				appMobiObj['device']['closeRemoteSite']();
		} catch(e) {}
	};
	Acts.prototype.deviceGetRemoteData = function (method, url, body, id)
	{
		if (isDC)
			return;
			
		try {
			evtRemoteDataResponse=''; 
			var parameters = new appMobiObj['Device']['RemoteDataParameters']();
			parameters.url = url;
			parameters.id = id;
			parameters.method = method;
			parameters.body = body;
			appMobiObj['device']['getRemoteDataExt'](parameters);
		} catch(e) {}
	}
	
	Acts.prototype.deviceHideSplashScreen = function ()
	{
		try {
			if (isDC)
				awex("AppMobi['device']['hideSplashScreen']();");
			else
				appMobiObj['device']['hideSplashScreen']();
		} catch(e) {}
	};
	
	Acts.prototype.deviceInstallUpdate = function ()
	{
		try {
			if (isDC)
				awex("AppMobi['device']['installUpdate']();");
			else
				appMobiObj['device']['installUpdate']();
		} catch(e) {}
	};
	
	Acts.prototype.deviceLaunchExternal = function (url)
	{
		try {
			if (isDC)
				awex("AppMobi['device']['launchExternal']('" + url + "');");
			else
				appMobiObj['device']['launchExternal'](url);
		} catch(e) {}
	};
	
	Acts.prototype.deviceMainViewExecute = function (cmd)
	{
		try {
			appMobiObj['device']['mainViewExecute'](cmd);
		} catch(e) {}
	};
	
	Acts.prototype.deviceScanBarcode = function ()
	{
		if (isDC)
			return;
			
		try {
			evtBarCodeResponse=''; appMobiObj['device']['scanBarcode']();
		} catch(e) {}
	};
	
	Acts.prototype.deviceUpdateConnection = function ()
	{
		if (isDC)
			return;
		
		try {
			evtConnection=''; appMobiObj['device']['updateConnection']();
		} catch(e) {}
	};
	
	Acts.prototype.deviceShowRemoteSite = function (url, w, h, px, py, lx, ly)
	{
		if (isDC)
			return;
			
		try {
			evtRemoteStatus='open'; appMobiObj['device']['showRemoteSiteExt'](url, px, py, lx, ly, w, h);
		} catch(e) {}
	};
	
	Acts.prototype.deviceSetAutoRotate = function (allow)
	{
		if (!appMobiEnabled && !isDC)
			return;
			
		if (isDC)
			awex("AppMobi['device']['setAutoRotate'](" + (allow ? "true" : "false") + ");");
		else
			appMobiObj['device']['setAutoRotate'](allow !== 0);
	};
	
	Acts.prototype.deviceSetRotateOrientation = function (orientation)
	{
		if (!appMobiEnabled && !isDC)
			return;
			
		if (isDC)
			awex("AppMobi['device']['setRotateOrientation'](" + (orientation === 0 ? "'portrait'" : "'landscape'") + ");");
		else
			appMobiObj['device']['setRotateOrientation'](orientation === 0 ? "portrait" : "landscape");
	};
	
	/*********************************************************	
		ANALYTICS
	*********************************************************/		
	Acts.prototype.analyticsLogEvent=function(event, qs){ 
		try{ 
			event="/application/" + event + ".event";
			
			if (isDC)
				awex("AppMobi['analytics']['logPageEvent']('" + event + "', '" + qs + "', 200, 'GET', 0, 'index.html');");
			else
				appMobiObj['analytics']['logPageEvent'](event, qs, 200, 'GET', 0, 'index.html'); 
		}catch(e){ console.log(e); }
	};	
	
	/*********************************************************	
		CACHE
	*********************************************************/
	Acts.prototype.cacheAddToMediaCache=function(url)
	{
		if (isDC)
			return;
			
		try{ 
			appMobiObj['cache']['addToMediaCache'](url); 
		}catch(e){ console.log(e); }
	}
	
	Acts.prototype.cacheClearAllCookies=function()
	{
		if (isDC)
			return;
			
		try{ 
			appMobiObj['cache']['clearAllCookies'](); 
		}catch(e){ console.log(e); }
	}
	
	Acts.prototype.cacheClearMediaCache=function()
	{
		if (isDC)
			return;
			
		try{ 
			appMobiObj['cache']['clearMediaCache'](); 
		}catch(e){ console.log(e); }
	}
	
	Acts.prototype.cacheRemoveCookie=function(v)
	{
		if (isDC)
			return;
			
		try{ 
			appMobiObj['cache']['removeCookie'](v); 
		}catch(e){ console.log(e); }
	}
	
	Acts.prototype.cacheRemoveFromMediaCache=function(v)
	{
		if (isDC)
			return;
			
		try{ 
			appMobiObj['cache']['removeFromMediaCache'](v); 
		}catch(e){ console.log(e); }
	}
	
	Acts.prototype.cacheSetCookie=function(name, value, expires)
	{
		if (isDC)
			return;
			
		try{ 
			appMobiObj['cache']['setCookie'](name, value, expires); 
		}catch(e){ console.log(e); }
	}
	
	Acts.prototype.AddVirtualPage = function ()
	{
		if (!appMobiEnabled && !isDC)
			return;
		
		if (isDC)
			awex("AppMobi['device']['addVirtualPage']();");
		else
			appMobiObj['device']['addVirtualPage']();
	};
	
	Acts.prototype.RemoveVirtualPage = function ()
	{
		if (!appMobiEnabled && !isDC)
			return;
			
		if (isDC)
			awex("AppMobi['device']['removeVirtualPage']();");
		else
			appMobiObj['device']['removeVirtualPage']();
	};
	
	Acts.prototype.HideStatusBar = function ()
	{
		try {
			if (isDC)
				awex("AppMobi['device']['hideStatusBar']();");
			else
				appMobiObj['device']['hideStatusBar']();
		} catch(e) {}
	};
	
	pluginProto.acts = new Acts();	
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	/*********************************************************	
		DEVICE
	*********************************************************/	
	Exps.prototype.AppMobiVersion = function(ret){ try{ret.set_string(appMobiObj['device']['appmobiversion']);}catch(e){ret.set_string('');}	}
	Exps.prototype.DeviceConnection = function(ret){ try{ret.set_string(appMobiObj['device']['connection']);}catch(e){ret.set_string('');}	}
	Exps.prototype.InitialOrientation = function(ret){ try{ret.set_int(parseInt(appMobiObj['device']['initialOrientation']));}catch(e){ret.set_int(0);}	}
	Exps.prototype.DeviceLastStation = function(ret){ try{ret.set_string(appMobiObj['device']['lastStation']);}catch(e){ret.set_string('');}	}
	Exps.prototype.DeviceModel = function(ret){ try{ret.set_string(appMobiObj['device']['model']);}catch(e){ret.set_string('');}	}
	Exps.prototype.Orientation = function(ret){ try{ret.set_int(parseInt(appMobiObj['device']['orientation']));}catch(e){ret.set_int(0);}	}
	Exps.prototype.DeviceOSVersion = function(ret){ try{ret.set_string(appMobiObj['device']['osversion']);}catch(e){ret.set_string('');}	}
	Exps.prototype.DevicePhonegapVersion = function(ret){ try{ret.set_string(appMobiObj['device']['phonegapversion']);}catch(e){ret.set_string('');}	}
	Exps.prototype.DevicePlatform = function(ret){ try{ret.set_string(appMobiObj['device']['platform']);}catch(e){ret.set_string('');}	}
	Exps.prototype.DeviceQueryString = function(ret){ try{ret.set_string(appMobiObj['device']['queryString']);}catch(e){ret.set_string('');}	}
	Exps.prototype.DeviceUUID = function(ret){ try{ret.set_string(appMobiObj['device']['uuid']);}catch(e){ret.set_string('');}	}
	Exps.prototype.DeviceRemoteData = function(ret){ try{ret.set_string(evtRemoteDataResponse);}catch(e){ret.set_string('');}	}
	Exps.prototype.DeviceBarcodeData = function(ret){ try{ret.set_string(evtBarCodeResponse);}catch(e){ret.set_string('');} }
	Exps.prototype.DeviceRemoteStatus = function(ret){ try{ret.set_string(evtRemoteStatus);}catch(e){ret.set_string('');} }
	
	
	/*********************************************************	
		CACHE
	*********************************************************/
	Exps.prototype.Cookie = function(ret, p){ 
		try{
			ret.set_string(appMobiObj['cache']['getCookie'](p)); 
		}catch(e){ ret.set_string(''); }
	}
	
	Exps.prototype.LocalMediaCacheURL = function(ret, p){ 
		try{
			ret.set_string(appMobiObj['cache']['getMediaCacheLocalURL'](p)); 
		}catch(e){ ret.set_string(''); }
	}
	
	pluginProto.exps = new Exps();

}());