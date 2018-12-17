// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.video = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.video.prototype;
		
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
	
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
			
		var i, len, inst;
		
		// Release all WebGL textures
		for (i = 0, len = this.instances.length; i < len; ++i)
		{
			inst = this.instances[i];
			inst.webGL_texture = null;		// will lazy create again on next draw
		}
	};
	
	var tmpVideo = document.createElement("video");
	var can_play_webm = !!tmpVideo.canPlayType("video/webm");
	var can_play_ogv = !!tmpVideo.canPlayType("video/ogg");
	var can_play_mp4 = !!tmpVideo.canPlayType("video/mp4");
	tmpVideo = null;
	
	function isVideoPlaying(v)
	{
		return v && !v.paused && !v.ended && v.currentTime > 0;
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	// Work around gesture limitations in some browsers
	var playOnNextInput = [];
	
	function playQueued()
	{
		// play() calls can still fail in a user input event due to browser heuristics. Make sure any play calls
		// that fail are added back in to the play queue.
		var tryPlay = playOnNextInput.slice(0);
		cr.clearArray(playOnNextInput);
		
		var i, len, playRet, v;
		for (i = 0, len = tryPlay.length; i < len; ++i)
		{
			v = tryPlay[i];
			playRet = v.play();
			
			if (playRet)
			{
				playRet.catch(function (err)
				{
					addVideoToPlayOnNextInput(v);
				});
			}
		}
	};
	
	document.addEventListener("touchend", playQueued, true);
	document.addEventListener("click", playQueued, true);
	document.addEventListener("keydown", playQueued, true);
	
	function addVideoToPlayOnNextInput(v)
	{
		var i = playOnNextInput.indexOf(v);
		
		if (i === -1)
			playOnNextInput.push(v);
	};
		
	instanceProto.queueVideoPlay = function (add)
	{
		if (!this.video)
			return;
		
		var i;
		var self = this;
		
		// Remove from video play queue if present
		if (!add)
		{
			i = playOnNextInput.indexOf(this.video);
			
			if (i >= 0)
				playOnNextInput.splice(i, 1);
			
			return;
		}
		
		// In WKWebView mode, setting the source is async. If we're waiting for the src to load, queue the play
		// until the src has finished loading. It will call playQueued() when the src is loaded.
		if (this.isSettingSource > 0)
		{
			addVideoToPlayOnNextInput(this.video);
			return;
		}
		
		// Try to play the video immediately. On modern browsers, this returns a promise that rejects if the playback is not allowed
		// at this time. On older browsers it will not return a Promise so we have to fall back to heuristics.
		var playRet;
		try {
			playRet = this.video.play();
		}
		catch (err)
		{
			// Synchronous exception in play() call: queue for next input event
			addVideoToPlayOnNextInput(this.video);
			return;
		}
		
		if (playRet)		// Promise was returned
		{
			// Rejects if can't play at this time
			playRet.catch(function (err)
			{
				// Note object could have been destroyed before promise resolved
				if (self.video)
					addVideoToPlayOnNextInput(self.video);
			});
		}
		// Did not return promise and the play() call was made outside of a user input event on platforms that block autoplay:
		// assume the call did not work; queue for playback on next touch
		else if (this.useNextTouchWorkaround && !this.runtime.isInUserInputEvent)
		{
			addVideoToPlayOnNextInput(this.video);
		}
	};

		
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.webm_src = this.properties[0];
		this.ogv_src = this.properties[1];
		this.mp4_src = this.properties[2];
		
		this.autoplay = this.properties[3];					// 0 = no, 1 = preload, 2 = yes
		this.playInBackground = (this.properties[4] !== 0);	// 0 = no, 1 = yes
		this.videoWasPlayingOnSuspend = false;
		
		this.video = document.createElement("video");
		this.video.crossOrigin = "anonymous";
		this.video["playsInline"] = true;					// ensure inline playback on iOS
		
		this.webGL_texture = null;
		
		this.currentTrigger = -1;
		
		// IE11/Edge hack: WebGL doesn't support drawing videos here, so render to a canvas then upload the canvas to a texture!
		this.viaCanvas = null;
		this.viaCtx = null;
		this.useViaCanvasWorkaround = this.runtime.isIE || this.runtime.isMicrosoftEdge;
		this.isSettingSource = 0;
		
		var self = this;
		
		this.video.addEventListener("canplay", function () {
			self.currentTrigger = 0;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		this.video.addEventListener("canplaythrough", function () {
			self.currentTrigger = 1;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		this.video.addEventListener("ended", function () {
			self.currentTrigger = 2;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		this.video.addEventListener("error", function () {
			self.currentTrigger = 3;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		this.video.addEventListener("loadstart", function () {
			self.currentTrigger = 4;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		this.video.addEventListener("playing", function () {
			self.currentTrigger = 5;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		this.video.addEventListener("pause", function () {
			self.currentTrigger = 6;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		this.video.addEventListener("stalled", function () {
			self.currentTrigger = 7;
			self.runtime.trigger(cr.plugins_.video.prototype.cnds.OnPlaybackEvent, self);
		});
		
		// Work around iOS & Android's requirement of having a user gesture start playback.
		// This is only used as a fall-back heuristic if play() does not return a Promise.
		this.useNextTouchWorkaround = ((this.runtime.isiOS || (this.runtime.isAndroid && (this.runtime.isChrome || this.runtime.isAndroidStockBrowser))) && !this.runtime.isCrosswalk && !this.runtime.isDomFree);
		
		// Set autoplay/preload setting
		if (this.autoplay === 0)
		{
			this.video.autoplay = false;
			this.video.preload = "none";
		}
		else if (this.autoplay === 1)
		{
			this.video.autoplay = false;
			this.video.preload = "auto";
		}
		else if (this.autoplay === 2)
		{
			// note wait until the source has been set before attempting a play() call
			this.video.autoplay = true;
		}
		
		this.setSource(this.webm_src, this.ogv_src, this.mp4_src);
		
		if (this.autoplay === 2)
			this.queueVideoPlay(true);
		
		this.visible = (this.properties[5] !== 0);
		
		// Tick this object so we can set to redraw if the video is playing
		this.runtime.tickMe(this);
		
		// Get suspend callbacks if should not play in background
		if (!this.recycled)
		{
			var self = this;
			
			this.runtime.addSuspendCallback(function(s)
			{
				self.onSuspend(s);
			});
		}
	};
	
	instanceProto.onSuspend = function (s)
	{
		if (this.playInBackground || !this.video)
			return;
		
		if (s)
		{
			if (isVideoPlaying(this.video))
			{
				this.queueVideoPlay(false);
				this.video.pause();
				this.videoWasPlayingOnSuspend = true;
			}
		}
		else
		{
			if (this.videoWasPlayingOnSuspend)
			{
				this.queueVideoPlay(true);
				this.videoWasPlayingOnSuspend = false;
			}
		}
	};
	
	instanceProto.setSource = function (webm_src, ogv_src, mp4_src)
	{
		var self = this;
		
		// Assign src depending on supported format and available sources.
		// Note after export all filenames are lowercased, so lowercase the path in case the server
		// is case-sensitive. During preview the preview server is case-insensitive.
		// Note: despite the name, setImageSrc just sets the 'src' attribute of the given object,
		// so it can be used to help work around WKWebView issues for videos too.
		var useSrc = "";
		
		if (can_play_webm && webm_src)
			useSrc = webm_src.toLowerCase();
		else if (can_play_ogv && ogv_src)
			useSrc = ogv_src.toLowerCase();
		else if (can_play_mp4 && mp4_src)
			useSrc = mp4_src.toLowerCase();
		
		if (useSrc)
		{
			if (this.runtime.isWKWebView && !this.runtime.isAbsoluteUrl(useSrc))
			{
				// HACK: in WKWebView mode, we can load local videos from blob URLs. This requires a hack to set the right blob type
				// otherwise Safari refuses to play it. Also the Cordova local file reader requires loading the entire file in to memory
				// to create a blob from it; this is obviously wasteful but there aren't any better options right now, especially since
				// the previous HTTP server workaround was also very hacky, and for some reason stopped working in iOS 11.
				// Also rather unfortunately this forces us on an async path, so we have to specially handle the "setting source" state.
				this.isSettingSource++;
				
				this.runtime.fetchLocalFileViaCordovaAsURL(useSrc, function (url)
				{
					self.isSettingSource--;
					self.video.src = url;			// load video from blob URL
					playQueued();					// may have queued a play while setting source; try play now src is set
				}, function (err)
				{
					console.error("[Video] Failed to load video '" + useSrc + "': ", err);
					self.isSettingSource--;
					self.video.src = useSrc;		// error loading local video; try to load the original source anyway
				});
			}
			else
			{
				this.video.src = useSrc;
			}
		}
		
		// Delete WebGL texture and 2d canvas - will be recreated at new video
		// size when new video ready
		if (this.runtime.glwrap && this.webGL_texture)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
			this.webGL_texture = null;
		}
		
		this.viaCanvas = null;
		this.viaCtx = null;
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
		this.queueVideoPlay(false);
		
		if (isVideoPlaying(this.video))
			this.video.pause();		// stop playback
		
		if (this.runtime.glwrap && this.webGL_texture)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
			this.webGL_texture = null;
		}
		
		this.viaCanvas = null;
		this.viaCtx = null;
		this.video.src = "";		// memory is not always cleaned up unless we drop the src!
		this.video = null;
	};
	
	instanceProto.tick = function ()
	{
		if (isVideoPlaying(this.video))
			this.runtime.redraw = true;
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			"s": (this.video.src || ""),
			"p": !!isVideoPlaying(this.video),
			"t": (this.video.currentTime || 0)
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// Note <r212 does not save any state, so don't try to restore anything if no save data available.
		if (!o || typeof o["s"] === "undefined")
			return;
		
		var src = o["s"];
		this.setSource(src, src, src);
		
		try {
			this.video.currentTime = o["t"];
		}
		catch (e) {};		// ignore if throws
		
		if (o["p"])			// is playing
		{
			this.queueVideoPlay(true);
		}
		else
		{
			this.queueVideoPlay(false);
			this.video.pause();
		}
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function (ctx)
	{
		if (!this.video)
			return;		// no video to draw
		
		// Render video with correct aspect ratio to the object rectangle area
		var videoWidth = this.video.videoWidth;
		var videoHeight = this.video.videoHeight;
		
		if (videoWidth <= 0 || videoHeight <= 0)
			return;		// not yet loaded metadata
		
		var videoAspect = videoWidth / videoHeight;
		var dispWidth = this.width;
		var dispHeight = this.height;
		var dispAspect = dispWidth / dispHeight;
		var offx = 0;
		var offy = 0;
		var drawWidth = 0;
		var drawHeight = 0;
		
		// aspect scale the video to the object's draw area
		if (dispAspect > videoAspect)
		{
			drawWidth = dispHeight * videoAspect;
			drawHeight = dispHeight;
			offx = Math.floor((dispWidth - drawWidth) / 2);
			
			if (offx < 0)
				offx = 0;
		}
		else
		{
			drawWidth = dispWidth;
			drawHeight = dispWidth / videoAspect;
			offy = Math.floor((dispHeight - drawHeight) / 2);
			
			if (offy < 0)
				offy = 0;
		}
		
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.video, this.x + offx, this.y + offy, drawWidth, drawHeight);
	};
	
	var tmpRect = new cr.rect(0, 0, 0, 0);
	var tmpQuad = new cr.quad();
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
		if (!this.video)
			return;		// no video to draw
		
		// Render video with correct aspect ratio to the object rectangle area
		var videoWidth = this.video.videoWidth;
		var videoHeight = this.video.videoHeight;
		
		if (videoWidth <= 0 || videoHeight <= 0)
			return;		// not yet loaded metadata
		
		var videoAspect = videoWidth / videoHeight;
		var dispWidth = this.width;
		var dispHeight = this.height;
		var dispAspect = dispWidth / dispHeight;
		var offx = 0;
		var offy = 0;
		var drawWidth = 0;
		var drawHeight = 0;
		
		// aspect scale the video to the object's draw area
		if (dispAspect > videoAspect)
		{
			drawWidth = dispHeight * videoAspect;
			drawHeight = dispHeight;
			offx = Math.floor((dispWidth - drawWidth) / 2);
			
			if (offx < 0)
				offx = 0;
		}
		else
		{
			drawWidth = dispWidth;
			drawHeight = dispWidth / videoAspect;
			offy = Math.floor((dispHeight - drawHeight) / 2);
			
			if (offy < 0)
				offy = 0;
		}
		
		// Lazy-create texture
		if (!this.webGL_texture)
		{
			this.webGL_texture = glw.createEmptyTexture(videoWidth, videoHeight, this.runtime.linearSampling, false, false);
		}
		
		if (this.useViaCanvasWorkaround)
		{
			// Can't upload videos directly to a texture, so render via a canvas 2D context.
			// If the context does not yet exist, create it.
			if (!this.viaCtx)
			{
				this.viaCanvas = document.createElement("canvas");
				this.viaCanvas.width = videoWidth;
				this.viaCanvas.height = videoHeight;
				this.viaCtx = this.viaCanvas.getContext("2d");
			}
			
			this.viaCtx.drawImage(this.video, 0, 0);
			glw.videoToTexture(this.viaCanvas, this.webGL_texture);
		}
		else
		{
			glw.videoToTexture(this.video, this.webGL_texture);
		}
		
		glw.setBlend(this.srcBlend, this.destBlend);
		glw.setOpacity(this.opacity);
		glw.setTexture(this.webGL_texture);
		
		tmpRect.set(this.x + offx, this.y + offy, this.x + offx + drawWidth, this.y + offy + drawHeight);
		tmpQuad.set_from_rect(tmpRect);
		glw.quad(tmpQuad.tlx, tmpQuad.tly, tmpQuad.trx, tmpQuad.try_, tmpQuad.brx, tmpQuad.bry, tmpQuad.blx, tmpQuad.bly);
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
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/
	
	function dbToLinear_nocap(x)
	{
		return Math.pow(10, x / 20);
	};
	
	function linearToDb_nocap(x)
	{
		return (Math.log(x) / Math.log(10)) * 20;
	};
	
	function dbToLinear(x)
	{
		var v = dbToLinear_nocap(x);
		if (v < 0)
			v = 0;
		if (v > 1)
			v = 1;
		return v;
	};
	
	function linearToDb(x)
	{
		if (x < 0)
			x = 0;
		if (x > 1)
			x = 1;
		return linearToDb_nocap(x);
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.IsPlaying = function ()
	{
		return isVideoPlaying(this.video);
	};
	
	Cnds.prototype.IsPaused = function ()
	{
		return this.video.paused;
	};
	
	Cnds.prototype.HasEnded = function ()
	{
		return this.video.ended;
	};
	
	Cnds.prototype.IsMuted = function ()
	{
		return this.video.muted;
	};
	
	Cnds.prototype.OnPlaybackEvent = function (trig)
	{
		return this.currentTrigger === trig;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetSource = function (webm_src, ogv_src, mp4_src)
	{
		this.setSource(webm_src, ogv_src, mp4_src);
		this.video.load();
	};
	
	Acts.prototype.SetPlaybackTime = function (s)
	{
		try {
			this.video.currentTime = s;
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Exception setting video playback time: ", e);
		}
	};
	
	Acts.prototype.SetLooping = function (l)
	{
		this.video.loop = (l !== 0);
	};
	
	Acts.prototype.SetMuted = function (m)
	{
		this.video.muted = (m !== 0);
	};
	
	Acts.prototype.SetVolume = function (v)
	{
		this.video.volume = dbToLinear(v);
	};
	
	Acts.prototype.Pause = function ()
	{
		this.queueVideoPlay(false);		// remove any play-on-next-touch queue, since we don't want it to be playing any more
		this.video.pause();
	};
	
	Acts.prototype.Play = function ()
	{
		this.queueVideoPlay(true);
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.PlaybackTime = function (ret)
	{
		ret.set_float(this.video.currentTime || 0);
	};
	
	Exps.prototype.Duration = function (ret)
	{
		ret.set_float(this.video.duration || 0);
	};
	
	Exps.prototype.Volume = function (ret)
	{
		ret.set_float(linearToDb(this.video.volume || 0));
	};
	
	pluginProto.exps = new Exps();

}());