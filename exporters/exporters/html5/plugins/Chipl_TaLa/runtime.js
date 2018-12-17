// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");
/// Global objects and function 
// var GameHandler = {}
// GameHandler.setUserInfo = function (user){
// 	GameHandler.userInfo = user;
// }

// GameHandler.playerInfos = [];

// //  Test region
// var user = {
// 	msgEvent: "JOIN_OR_CREATE_ROOM_CLIENT_to_SERVER",
// 	playerName: 'chipl_2',
// 	avatarUrl: "something.png",
// 	playerJwt: "aabbcccderfd",
// 	game: "Tala",
// 	playerRoomId: 1,
// 	playerRoomName: "Meocon"
// };

// GameHandler.setUserInfo(user);

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.GameTaLaPlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.GameTaLaPlugin.prototype;
		
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

	var userInfo = {};

	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;		
		// Chipl Code Start here
		// this.userInfo = GameHandler.userInfo;
		// console.log('userInfo:', this.userInfo)
		// Chipl Code End here
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
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
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

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	//0 the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};
	
	//1 ... other conditions here ...
	Cnds.prototype.OnOpened = function ()
	{
		return true;
	};
	//2
	Cnds.prototype.OnClosed = function ()
	{
		return true;
	};
	//3
	Cnds.prototype.OnError = function ()
	{
		return true;
	};
	//4
	Cnds.prototype.OnMessage = function ()
	{
		return true;
	};
	//5
	Cnds.prototype.IsOpen = function ()
	{
		return this.ws && this.ws.readyState === 1 /* OPEN */;
	};
	//6
	Cnds.prototype.IsConnecting = function ()
	{
		return this.ws && this.ws.readyState === 0 /* CONNECTING */;
	};
	//7
	Cnds.prototype.IsSupported = function ()
	{
		return isSupported;
	};	
	//8
	Cnds.prototype.NewPlayerJoin = function ()
	{
		return true;
	};	

	// 9 PlayerLeft
	Cnds.prototype.PlayerLeft = function ()
	{
		return true;
	};	

	//10 CheckPlayer
	Cnds.prototype.CheckPlayer = function (index){
		var result = false;
		for (var i = 0; i < GameHandler.playerInfos.length; i++){
			if (GameHandler.playerInfos[i].post == index){
				result = true;
				break;
			}
		}		
		return result;
	}

	//11 DealCard
	Cnds.prototype.DealCard = function (){
		return true;
	}

	//12 Display Start Button
	Cnds.prototype.DisplayStartButton = function (){
		return true;
	}

	//13 UserStatusChange
	Cnds.prototype.UserStatusChange = function (){
		return true;
	}	
	//14 PlayerPlacingCard
	Cnds.prototype.PlayerPlacingCard = function (){
		return true;
	}
	//15 NewCardFromDesk
	Cnds.prototype.NewCardFromDesk = function (){
		return true;
	}

	//16 EarnCardFromOther	
	Cnds.prototype.EarnCardFromOther = function (){
		return true;
	}

	//17 PlayerStatusChange
	Cnds.prototype.PlayerStatusChange = function (){
		return true;
	}
	// 18
	// MovingPlacedCard
	Cnds.prototype.MovingPlacedCard = function (){
		return true;
	}
	//19
	// ShowMyCardCollections
	Cnds.prototype.ShowCardCollections = function (){
		return true;
	}
	// 20
	// JoinCardsToOtherCollection
	Cnds.prototype.JoinCardsToOtherCollection = function (){
		return true;
	}
	// 21
	//DeclareRummy
	Cnds.prototype.DeclareRummy = function (){
		return true;
	}

	//22
	// FinalRound
	Cnds.prototype.FinalRound = function (){
		return true;
	}

	// 23
	//HideScoringBoard
	Cnds.prototype.HideScoringBoard = function (){
		return true;
	}

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		console.log(myparam);
	};

	// Connect to Server
	Acts.prototype.Connect = function (ws_url, protocol){
		
		if (this.ws){
			this.ws.close();
		}
		var self = this;
		var webSocket = window.WebSocket || window.MozWebSocket;

		let websocketURL ;
		if (GameHandler.websocketURL){
			//"ws://localhost.io:8765"
			websocketURL = GameHandler.websocketURL
		}else{
			websocketURL = ws_url;
		}
		this.ws = new webSocket(websocketURL);
		this.ws.onopen = function (e) {        	
			do {
			}
			while (self.ws.readyState !== 1);
			// self.ws.send("Iam here")	;
			// Chipl code
			self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.OnOpened,self);
			
			if (GameHandler.userInfo){
				self.ws.send( JSON.stringify(GameHandler.userInfo));
			}
			
        }

        this.ws.onclose = function (e) {
            self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.OnClosed,self);
        }

        this.ws.onmessage = function (e) {
                //var dataObject = JSON.parse(e.data);
                //console.log(dataObject);
                // console.log("Event: ",e);
                // console.log(e.data);
				// ws.send(" I am here.. available");
				var player = JSON.parse(e.data);
				var serverEventType = player.msgEvent;
				switch(serverEventType){
					case "JOIN_OR_CREATE_ROOM_SERVER_to_CLIENT":
						var found = false;
						for (var i = 0; i< GameHandler.playerInfos.length; i++){
							if (GameHandler.playerInfos[i].playerUID == player.playerUID){
								found = true;
								GameHandler.playerInfos[i]=player;
								// break;
							}
						}						
						if (!found){
							GameHandler.playerInfos.push(player);
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.NewPlayerJoin,self);
						}	
						// console.log("JOIN_OR_CREATE_ROOM_SERVER_to_CLIENT", "post:", player.post, player);					
						break;
					case "PLAYER_LEFT_ROOM_SERVER_to_CLIENT":
							GameHandler.playerInfos = GameHandler.playerInfos.filter(item=>{
								return item.playerUID != player.playerUID;
							})
							GameHandler.leftPlayer = player;
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.PlayerLeft,self);
						break;
					case "TAKE_START_BUTTON_SERVER_to_CLIENT":
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.DisplayStartButton,self);
						break;
					case "START_NEW_GAME_SERVER_to_CLIENT":
							GameHandler.userInfo.Cards = player.value;
							// console.log("START_NEW_GAME_SERVER_to_CLIENT");
							// console.log(player.value);
							GameHandler.ShowCardPlayerStatus = [];
							GameHandler.informDeclareRummy = "";
							GameHandler.lastResult = null;
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.DealCard,self);
						break;
					case "CHANGE_MINE_STATGE_SERVER_to_CLIENT":
							GameHandler.stage = player.value;
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.UserStatusChange,self);
						break;
					case "CHANGE_PLAYER_STATGE_SERVER_to_CLIENT":
						GameHandler.playerChangeStage = player;
						self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.PlayerStatusChange,self);
					break;
					// PlayerPlacingCard
					case "PLACING_CARD_SERVER_to_CLIENT":
							GameHandler.lastPlacedPlayer = player;
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.PlayerPlacingCard,self);
						break;
					case "TAKE_CARD_FROM_DESK_SERVER_to_CLIENT":
							GameHandler.lastPlayerTakeCardFromDesk = player;
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.NewCardFromDesk,self);
						break;
					case "TAKE_CARD_FROM_OTHER_SERVER_to_CLIENT":
						GameHandler.lastPlayerEarnCard = player;
						self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.EarnCardFromOther,self);
					break;
					case "MOVE_PLACEDCARD_FROM_OTHER_SERVER_to_CLIENT":
						GameHandler.movingCardInfo = player;
						self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.MovingPlacedCard,self);
					break;
					case "SHOW_CARDCOLLECTIONS_SERVER_to_CLIENT": 
						//ShowMyCardCollections
						GameHandler.ShowCardCollectionsInfo = player;
						GameHandler.ShowCardPlayerStatus[player.post] = true;
						
						self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.ShowCardCollections,self);
					break;
					case "JOIN_CARD_TO_ANOTHER_SERVER_to_CLIENT": 
					//ShowMyCardCollections
					GameHandler.JoinCardCollectionsInfo = player;
					// console.log("From : JOIN_CARD_TO_ANOTHER_SERVER_to_CLIENT", JSON.parse(player.value));
					self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.JoinCardsToOtherCollection,self);
					break;
					case "INFORM_GO_OUT_SERVER_to_CLIENT":
						// console.log(JSON.parse(player.value).message);
						// console.log(e.data.value);
						// DeclareRummy
						GameHandler.informDeclareRummy = JSON.parse(player.value).message;
						//GameHandler
						self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.DeclareRummy,self);
					break;
					case "DECLARE_WINNER_SERVER_to_CLIENT":							
							console.log("Winner--------------------:", JSON.parse(player.value).result);
							GameHandler.lastResult = JSON.parse(player.value).result;
							//FinalRound
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.FinalRound,self);
							break;
					case "SHOW_MESSAGE":							
							
							break;
					case "HIDE_SCORING_BOARD_SERVER_to_CLIENT":
							// if (c2_callFunction){
							// 	// c2_callFunction("HiringScoreBoard", []);								
							// }
							//HideScoringBoard
							self.runtime.trigger(cr.plugins_.GameTaLaPlugin.prototype.cnds.HideScoringBoard,self);
							break;

					default :
							console.log(player, "-----------Default---------------");
				}
        }

	}

	Acts.prototype.Close = function ()
	{
		if (this.ws)
			this.ws.close();
	};
	
	Acts.prototype.Send = function (msg_)
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		this.ws.send(msg_);
	};
	// SendStart	
	Acts.prototype.SendStartGame = function ()
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "START_NEW_GAME_CLIENT_to_SERVER";
		sendObj = {msgEvent: msg}
		this.ws.send(JSON.stringify(sendObj));
	};

	//PlacingCard
	Acts.prototype.PlacingCard = function (cardVal)
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "PLACING_CARD_CLIENT_to_SERVER";
		sendObj = {	msgEvent: msg,
					cardVal: cardVal}
		this.ws.send(JSON.stringify(sendObj));
	};
	//
	// TakeCardFromDesk
	Acts.prototype.TakeCardFromDesk = function ()
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "TAKE_CARD_FROM_DESK_CLIENT_to_SERVER";
		sendObj = {	msgEvent: msg}					
		this.ws.send(JSON.stringify(sendObj));
	};

	// EarCardFromOther
	Acts.prototype.EarCardFromOther = function ()
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "TAKE_CARD_FROM_OTHER_CLIENT_to_SERVER";
		sendObj = {	msgEvent: msg}					
		this.ws.send(JSON.stringify(sendObj));
	};
	// ShowCardCollectionToOther
	Acts.prototype.EarCardFromOther = function ()
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "TAKE_CARD_FROM_OTHER_CLIENT_to_SERVER";
		sendObj = {	msgEvent: msg}					
		this.ws.send(JSON.stringify(sendObj));
	};
	// ShowCardCollectionToOther
	Acts.prototype.ShowCardCollectionToOther = function (cardList)
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "SHOW_CARDCOLLECTIONS_CLIENT_to_SERVER";
		sendObj = {	msgEvent: msg,
					cardList: cardList,
					isFirstTime: !GameHandler.ShowCardPlayerStatus[0]
					}
		console.log("Show card list", sendObj);
		this.ws.send(JSON.stringify(sendObj));
	};

	// JoinCardToOtherCollection
	Acts.prototype.JoinCardToOtherCollection = function (cardList, post)
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "JOIN_CARD_TO_ANOTHER_CLIENT_to_SERVER";
		sendObj = {	msgEvent: msg,
					cardList: cardList,
					post: post
					}
		console.log("Join card list", sendObj);
		this.ws.send(JSON.stringify(sendObj));
	};

	//AcceptScoringBoard
	Acts.prototype.AcceptScoringBoard = function ()
	{		
		if (!this.ws || this.ws.readyState !== 1 /* OPEN */){			
			return;
		}			
		msg = "ACCEPT_SCORING_BOARD_CLIENT_to_SERVER";
		sendObj = {	msgEvent: msg}					
		this.ws.send(JSON.stringify(sendObj));
	};

	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	// Other
	Exps.prototype.OtherExpression = function(ret, a,b){
		ret.set_string("hello");
	}
	//
	Exps.prototype.SpecialExpression = (ret, a, b)=>{
		ret.set_float(a + b);
	}

	Exps.prototype.GetPlayerName = (ret, index)=>{		
		var result = "";
		for (var i = 0; i<GameHandler.playerInfos.length; i++){
			if (GameHandler.playerInfos[i].post == index){
				result = GameHandler.playerInfos[i].playerName;
				console.log("Result form GetPlayerName: ", result);
				break;
			}
		}
		ret.set_string(result);
	}	
	
	Exps.prototype.GetPlayerAvatar = (ret, index)=>{
		var result = "";
		for (var i = 0; i<GameHandler.playerInfos.length; i++){
			if (GameHandler.playerInfos[i].post == index){
				result = GameHandler.playerInfos[i].avatarUrl;
				console.log("Result form GetPlayerName: ", result);
				break;
			}
		}
		ret.set_string(result);
	}

	Exps.prototype.GetPlayerBalance = (ret, index)=>{
		var result = "";
		for (var i = 0; i<GameHandler.playerInfos.length; i++){
			if (GameHandler.playerInfos[i].post == index){
				result = GameHandler.playerInfos[i].balance;
				console.log("Result form GetPlayerName: ", result);
				break;
			}
		}
		ret.set_string(result);
	}

	Exps.prototype.GetLeftPlayerPos = (ret)=>{
		ret.set_int(GameHandler.leftPlayer.post);
	}
	// GetCards
	Exps.prototype.GetCards = (ret)=>{
		ret.set_string(GameHandler.userInfo.Cards);
	}

	//	GetUserStatus	
	Exps.prototype.GetUserStatus = (ret)=>{
		//	ret.set_string(GameHandler.userInfo.Stage);
		ret.set_string(GameHandler.stage);
	}

	// GetPlayersStatus
	Exps.prototype.GetPlayersStatus = (ret, type)=>{
		if (type == 0){
			ret.set_int(GameHandler.playerChangeStage.post);
		}
		if (type == 1){
			ret.set_string(GameHandler.playerChangeStage.value);
		}		
	}

	//GetPlacedCardInfo
	Exps.prototype.GetPlacedCardInfo = (ret, type)=>{
		if (type == 0){
			ret.set_int(GameHandler.lastPlacedPlayer.post);
		}
		if (type == 1){
			ret.set_int(GameHandler.lastPlacedPlayer.value);
		}		
	}

	// GetNewCardFromDeskInfo
	Exps.prototype.GetNewCardFromDeskInfo = (ret, type)=>{
		if (type == 0){
			ret.set_int(GameHandler.lastPlayerTakeCardFromDesk.post);
		}
		if (type == 1){
			ret.set_int(GameHandler.lastPlayerTakeCardFromDesk.value);
		}		
	}
	
	// 	GameHandler.lastPlayerEarnCard = player;
	//	GetEarnedCardInfo
	Exps.prototype.GetEarnedCardInfo = (ret, type)=>{
		if (type == 0){
			ret.set_int(GameHandler.lastPlayerEarnCard.post);
		}
		if (type == 1){
			ret.set_int(GameHandler.lastPlayerEarnCard.value);
		}		
	}

	// GetMovingCardInfo
	Exps.prototype.GetMovingCardInfo = (ret, type)=>{
		if (type == 0){
			ret.set_int(GameHandler.movingCardInfo.post);
		}
		if (type == 1){
			ret.set_int(GameHandler.movingCardInfo.value);
		}		
	}
	// GetShowCollectionCardInfo
	Exps.prototype.GetShowCollectionCardInfo = (ret, type)=>{
		if (type == 0){
			ret.set_int(GameHandler.ShowCardCollectionsInfo.post);
		}
		if (type == 1){
			ret.set_string(GameHandler.ShowCardCollectionsInfo.value);
		}		
	}

	//GetShowCardPlayerStatus
	Exps.prototype.GetShowCardPlayerStatus = (ret,post)=>{
		if (GameHandler.ShowCardPlayerStatus[post]){
			ret.set_int(1);
		}else{
			ret.set_int(0);
		}				
	}
	// GetJoinCardCollectionsInfo
	Exps.prototype.GetJoinCardCollectionsInfo = (ret,type)=>{
		if (type == 0){
			ret.set_int(JSON.parse(GameHandler.JoinCardCollectionsInfo.value).srcPost);
		}
		if (type == 1){
			ret.set_int(JSON.parse(GameHandler.JoinCardCollectionsInfo.value).desPost);
		}
		if (type == 2){
			ret.set_string(JSON.parse(GameHandler.JoinCardCollectionsInfo.value).cardVal);
		}				
	}

	//GetRummyDeclareMsg	
	Exps.prototype.GetRummyDeclareMsg = (ret)=>{
		// console.log("From GetRummyDeclare:", GameHandler.informDeclareRummy);
		ret.set_string(GameHandler.informDeclareRummy);	
	}

	//GetLastResult
	Exps.prototype.GetLastResult = (ret,pos,type)=>{	
		
		// let testObj = 		[{id: "2", name: "chipl_2", point: 0, cardList: "26,27,28,35,36,37,48,49,50,51", post: 0},
		// {id: "1", name: "chipl_1", point: 0, cardList: "0,1,2,4,17,30,8,34,47", post: 2},
		// {id: "3", name: "chipl_3", point: 0, cardList: "3,16,29,31,32,33,23,24,25", post: 3},
		// {id: "4", name: "chipl_4", point: 0, cardList: "40,41,42,5,6,7,44,45,46", post: 1}]
		// length: 4

		// GameHandler.lastResult[pos]
		// let obj = GameHandler.lastResult.find(obj => obj.post == pos);
		// if (c2_callFunction){
		// 	c2_callFunction("ShowFinal", ["param1", "param2"]);
		// }    


		let obj = GameHandler.lastResult[pos];

		if (c2_callFunction && obj){
			c2_callFunction("ShowFinal", [pos,obj.name, obj.cardList, obj.avatarUrl, obj.message]);
			console.log ("Avatar: ", obj.avatarUrl, obj.cardList);
		}
		//ret.set_string(GameHandler.informDeclareRummy);	
	}

	// ... other expressions here ...

	
	pluginProto.exps = new Exps();

}());