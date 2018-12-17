// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Kongregate = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Kongregate.prototype;
		
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
	
	// Kongegate API
	var kongregate = null;
	var kRuntime = null;
	var kInst = null;
	var kUserID = 0;
	var kUserName = "Guest";
	
	function OnKongregateInPageLogin()
	{
		kUserID = kongregate["services"]["getUserId"]();
		kUserName = kongregate["services"]["getUsername"]();
		kRuntime.trigger(cr.plugins_.Kongregate.prototype.cnds.OnLogin, kInst);
	};
	
	function KongregateLoadComplete()
	{
		kongregate = window["kongregateAPI"]["getAPI"]();
		kongregate["services"]["connect"]();
		kongregate["services"]["addEventListener"]("login", OnKongregateInPageLogin);
		kUserID = kongregate["services"]["getUserId"]();
		kUserName = kongregate["services"]["getUsername"]();
		
		if (kUserID > 0)
			kRuntime.trigger(cr.plugins_.Kongregate.prototype.cnds.OnLogin, kInst);
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		kRuntime = this.runtime;
		kInst = this;
		
		if (!this.runtime.isDomFree && typeof window["kongregateAPI"] !== "undefined")
			window["kongregateAPI"]["loadAPI"](KongregateLoadComplete);
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
	};
	
	instanceProto.onLayoutChange = function ()
	{
		// re-trigger 'on login' as appropriate for the new layout
		if (kUserID > 0)
			kRuntime.trigger(cr.plugins_.Kongregate.prototype.cnds.OnLogin, kInst);
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsGuest = function ()
	{
		if (!kongregate)
			return true;		// preview mode
		
		return kongregate["services"]["isGuest"]();
	};
	
	Cnds.prototype.OnLogin = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.ShowRegBox = function ()
	{
		if (kongregate && kUserID === 0)
			kongregate["services"]["showRegistrationBox"]();
	};
	
	Acts.prototype.SubmitStat = function (name_, value_)
	{
		if (kongregate)
			kongregate["stats"]["submit"](name_, value_);
	};
	
	Acts.prototype.ShowShoutBox = function (msg)
	{
		if (kUserID > 0)
			kongregate["services"]["showShoutBox"](msg);
	};
	
	Acts.prototype.ShowSignInBox = function ()
	{
		if (kongregate && kUserID === 0)
			kongregate["services"]["showSignInBox"]();
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.UserID = function (ret)
	{
		ret.set_int(kUserID);
	};
	
	Exps.prototype.UserName = function (ret)
	{
		ret.set_string(kUserName);
	};
	
	pluginProto.exps = new Exps();

}());