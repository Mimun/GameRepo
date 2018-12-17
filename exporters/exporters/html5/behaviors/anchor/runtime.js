﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Anchor = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Anchor.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		this.anch_left = this.properties[0];		// 0 = left, 1 = right, 2 = none
		this.anch_top = this.properties[1];			// 0 = top, 1 = bottom, 2 = none
		this.anch_right = this.properties[2];		// 0 = none, 1 = right
		this.anch_bottom = this.properties[3];		// 0 = none, 1 = bottom
		
		this.inst.update_bbox();
		this.xleft = this.inst.bbox.left;
		this.ytop = this.inst.bbox.top;
		this.xright = this.runtime.original_width - this.inst.bbox.left;
		this.ybottom = this.runtime.original_height - this.inst.bbox.top;
		this.rdiff = this.runtime.original_width - this.inst.bbox.right;
		this.bdiff = this.runtime.original_height - this.inst.bbox.bottom;
		
		this.enabled = (this.properties[4] !== 0);
	};
	
	behinstProto.saveToJSON = function ()
	{
		return {
			"xleft": this.xleft,
			"ytop": this.ytop,
			"xright": this.xright,
			"ybottom": this.ybottom,
			"rdiff": this.rdiff,
			"bdiff": this.bdiff,
			"enabled": this.enabled
		};
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.xleft = o["xleft"];
		this.ytop = o["ytop"];
		this.xright = o["xright"];
		this.ybottom = o["ybottom"];
		this.rdiff = o["rdiff"];
		this.bdiff = o["bdiff"];
		this.enabled = o["enabled"];
	};

	behinstProto.tick = function ()
	{
		if (!this.enabled)
			return;
		
		var n;
		var layer = this.inst.layer;
		var inst = this.inst;
		var bbox = this.inst.bbox;
		
		// Anchor left to window left
		if (this.anch_left === 0)
		{
			inst.update_bbox();
			n = (layer.viewLeft + this.xleft) - bbox.left;
			
			if (n !== 0)
			{
				inst.x += n;
				inst.set_bbox_changed();
			}
		}
		
		// Anchor left to window right
		else if (this.anch_left === 1)
		{
			inst.update_bbox();
			n = (layer.viewRight - this.xright) - bbox.left;

			if (n !== 0)
			{
				inst.x += n;
				inst.set_bbox_changed();
			}
		}
		
		// Anchor top to window top
		if (this.anch_top === 0)
		{
			inst.update_bbox();
			n = (layer.viewTop + this.ytop) - bbox.top;

			if (n !== 0)
			{
				inst.y += n;
				inst.set_bbox_changed();
			}
		}
		
		// Anchor top to window bottom
		else if (this.anch_top === 1)
		{
			inst.update_bbox();
			n = (layer.viewBottom - this.ybottom) - bbox.top;

			if (n !== 0)
			{
				inst.y += n;
				inst.set_bbox_changed();
			}
		}
		
		// Anchor right to window right
		if (this.anch_right === 1)
		{
			inst.update_bbox();
			n = (layer.viewRight - this.rdiff) - bbox.right;
			
			if (n !== 0)
			{
				inst.width += n;
				
				if (inst.width < 0)
					inst.width = 0;
				
				inst.set_bbox_changed();
			}
		}
		
		// Anchor bottom to window bottom
		if (this.anch_bottom === 1)
		{
			inst.update_bbox();
			n = (layer.viewBottom - this.bdiff) - bbox.bottom;
			
			if (n !== 0)
			{
				inst.height += n;
				
				if (inst.height < 0)
					inst.height = 0;
				
				inst.set_bbox_changed();
			}
		}
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SetEnabled = function (e)
	{
		// Is enabled and disabling
		if (this.enabled && e === 0)
			this.enabled = false;
		// Is disabled and enabling
		else if (!this.enabled && e !== 0)
		{
			this.inst.update_bbox();
			this.xleft = this.inst.bbox.left;
			this.ytop = this.inst.bbox.top;
			this.xright = this.runtime.original_width - this.inst.bbox.left;
			this.ybottom = this.runtime.original_height - this.inst.bbox.top;
			this.rdiff = this.runtime.original_width - this.inst.bbox.right;
			this.bdiff = this.runtime.original_height - this.inst.bbox.bottom;
			this.enabled = true;
		}
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	behaviorProto.exps = new Exps();
	
}());