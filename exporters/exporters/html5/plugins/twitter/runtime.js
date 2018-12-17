// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Twitter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.Twitter.prototype;
		
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
	
	var isLoading = true;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// Not supported in directCanvas
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Twitter plugin not supported on this platform - the object will not be created");
			return;
		}
		
		this.elem = document.createElement("div");
		
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		this.element_hidden = false;
		
		this.buttonType = this.properties[0];		// 0 = follow, 1 = share, 2 = mention, 3 = hashtag
		this.buttonShare = this.properties[1];
		this.buttonText = this.properties[2];
		this.buttonVia = this.properties[3];
		this.buttonHashtags = this.properties[4];
		
		// Is initially hidden
		if (this.properties[5] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
			this.element_hidden = true;
		}
		
		this.buttonCount = this.properties[6];		// 0 = none, 1 = horizontal, 2 = vertical
		this.buttonSize = this.properties[7];		// 0 = medium, 1 = large
		this.buttonLang = this.properties[8] || "en";
		
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
			
		this.updatePosition(true);
		
		this.runtime.tickMe(this);
		
		var self = this;
		
		// Load Twitter API
		if (!window["twttr"])
		{
			window["twttr"] = (function (d,s,id) {
			  var t, js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
			  js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
			  return window["twttr"] || (t = { _e: [], ready: function(f){ t._e.push(f) } });
			}(document, "script", "twitter-wjs"));
			
			window["twttr"].ready(function (twttr)
			{
				loadTwitterButton(twttr, self);
			});
		}
		else if (isLoading)
		{
			window["twttr"].ready(function (twttr)
			{
				loadTwitterButton(twttr, self);
			});
		}
		else
			loadTwitterButton(window["twttr"], self);
	};
	
	function loadTwitterButton(twttr, self)
	{
		isLoading = false;
		
		var params;
		var countstr = "none";
		
		if (self.buttonCount === 1)
			countstr = "horizontal";
		else if (self.buttonCount === 2)
			countstr = "vertical";
		
		var sizestr = (self.buttonSize === 0 ? "medium" : "large");
		
		if (self.buttonType === 0)	// follow
		{
			twttr["widgets"]["createFollowButton"](
				self.buttonShare,
				self.elem,
				function () {
					triggerOnLoaded(self);
				},
				{
					"count": countstr,
					"size": sizestr,
					"lang": self.buttonLang
				}
			);
		}
		else if (self.buttonType === 1)	// share
		{
			params = {
					"count": countstr,
					"size": sizestr,
					"lang": self.buttonLang,
					"text": self.buttonText
			};
			
			if (self.buttonVia)
				params["via"] = self.buttonVia;
			
			if (self.buttonHashtags)
				params["hashtags"] = self.buttonHashtags;
			
			twttr["widgets"]["createShareButton"](
				self.buttonShare,
				self.elem,
				function () {
					triggerOnLoaded(self);
				},
				params
			);
		}
		else if (self.buttonType === 2)	// mention
		{
			params = {
					"count": countstr,
					"size": sizestr,
					"lang": self.buttonLang,
					"text": self.buttonText
			};
			
			if (self.buttonVia)
				params["via"] = self.buttonVia;
			
			if (self.buttonHashtags)
				params["hashtags"] = self.buttonHashtags;
			
			twttr["widgets"]["createMentionButton"](
				self.buttonShare,
				self.elem,
				function () {
					triggerOnLoaded(self);
				},
				params
			);
		}
		else if (self.buttonType === 3)	// hashtag
		{
			params = {
					"count": countstr,
					"size": sizestr,
					"lang": self.buttonLang,
					"text": self.buttonText
			};
			
			if (self.buttonVia)
				params["via"] = self.buttonVia;
			
			if (self.buttonHashtags)
				params["hashtags"] = self.buttonHashtags;
			
			twttr["widgets"]["createHashtagButton"](
				self.buttonShare,
				self.elem,
				function () {
					triggerOnLoaded(self);
				},
				params
			);
		}
	};
	
	function triggerOnLoaded(self)
	{
		self.runtime.trigger(cr.plugins_.Twitter.prototype.cnds.OnLoaded, self);
	};
	
	instanceProto.saveToJSON = function ()
	{
		var o = {
		};
		
		return o;
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	};
	
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
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
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			
			this.element_hidden = true;
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
		
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
			
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
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
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
			"title": "Button",
			"properties": [
				{"name": "Text", "value": this.isCheckbox ? this.labelText.nodeValue : this.elem.value},
				{"name": "Checked", "value": this.isCheckbox ? this.elem.checked : false, "readonly": !this.isCheckbox}
			]
		});
		*/
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		/*
		if (name === "Text")
		{
			if (this.isCheckbox)
				this.labelText.nodeValue = value;
			else
				this.elem.value = value;
		}
		else if (name === "Checked" && this.isCheckbox)
		{
			this.elem.checked = value;
		}
		*/
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnLoaded = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	/*
	Acts.prototype.SetText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		
		if (this.isCheckbox)
			this.labelText.nodeValue = text;
		else
			this.elem.value = text;
	};
	*/
	
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.visible = (vis !== 0);
	};
	
	Acts.prototype.SetShare = function (str)
	{
		this.buttonShare = str;
	};
	
	Acts.prototype.SetText = function (str)
	{
		this.buttonText = str;
	};
	
	Acts.prototype.SetVia = function (str)
	{
		this.buttonVia = str;
	};
	
	Acts.prototype.SetHashtags = function (str)
	{
		this.buttonHashtags = str;
	};
	
	Acts.prototype.Reload = function ()
	{
		if (this.runtime.isDomFree || isLoading)		// ignore reload requests while still loading
			return;
		
		jQuery(this.elem).remove();

		this.elem = document.createElement("div");
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		if (this.element_hidden)
			jQuery(this.elem).hide();
		
		loadTwitterButton(window["twttr"], this);
		this.updatePosition(true);
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

}());