using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Text;
using Fleck;
using System.Dynamic;
using Newtonsoft.Json;
using System.Linq;

namespace GameFoundation.GameUtils
{
	public class Player : IDisposable
	{
		public string playerName;
		public string playerUID;
		public string playerJwt;
		public float playerBalance;
		public string playerRoomName;
		public string playerRoomId;
		public string avatarUrl;
		public Room playerRoom;
		public int pos_in_room = -1;
		public bool isWinner = false;
		public int lastScore = 0;
		public bool hasShownCardsCollection = false;
		

		private bool isFirstShowCardPlayer = false;

		private Player precededPlayer;



		//
		public List<int> Cards = new List<int>();				// Cards in hand
		public List<int> LostCards = new List<int>();		// Cards were lost to feeding next player :D
		public List<int> EarnedCards = new List<int>(); // Cards were earned from precededPlayer :D
		public List<int> PlacedCardsList = new List<int>(); // Cards were placed  :D
		public List<int> ShownCardsList = new List<int>();
		public int PlacedCard = -1;
		public enum Stage
		{
			Idle, Considering, Placing, ShowCards
		}

		Stage _stage = Stage.Idle;
	
		public Stage Status
		{
			get
			{
				return this._stage;
			}
			set
			{

				_stage = value;


				Send(this, StaticEvent.CHANGE_MINE_STATGE_SERVER_to_CLIENT, this._stage.ToString().ToUpper());
				if (playerRoom != null && _stage != Stage.Idle)
				{
					playerRoom.Players.ForEach(p =>
					{
						p.Send(this, StaticEvent.CHANGE_PLAYER_STATGE_SERVER_to_CLIENT, _stage.ToString().ToUpper());
						Console.WriteLine("from change _stage: {0}  , {1} to {2}", playerName, Status, p.playerName);
					});
				}
				// send this status to client;
				//playerRoom.Players.ForEach(p => {

				//});


			}
		}

		private List<IWebSocketConnection> playerWebsocketList = new List<IWebSocketConnection>();

		public ConcurrentDictionary<string, List<IWebSocketConnection>> Connections { get; set; } = new ConcurrentDictionary<string, List<IWebSocketConnection>>();

		public List<IWebSocketConnection> AllConnections
		{
			get
			{
				return this.playerWebsocketList;
			}
			set
			{
				this.playerWebsocketList = value;				
			}
		}

		public Player PrecededPlayer { get => precededPlayer; set => precededPlayer = value; }
		public bool IsFirstShowCardPlayer { get => isFirstShowCardPlayer; set => isFirstShowCardPlayer = value; }

		#region IDisposable Support
		private bool disposedValue = false; // To detect redundant calls

		protected virtual void Dispose(bool disposing)
		{
			if (!disposedValue)
			{
				if (disposing)
				{
					// TODO: dispose managed state (managed objects).
				}

				// TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
				// TODO: set large fields to null.

				disposedValue = true;
			}
		}

		// TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
		// ~Player() {
		//   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
		//   Dispose(false);
		// }

		// This code added to correctly implement the disposable pattern.
		public void Dispose()
		{
			// Do not change this code. Put cleanup code in Dispose(bool disposing) above.
			Dispose(true);
			// TODO: uncomment the following line if the finalizer is overridden above.
			// GC.SuppressFinalize(this);
		}
		#endregion


		#region GameRule
		//public Player( string playerName,
		//    string playerJwt,
		//    string playerRoomName,
		//    string playerRoomId,
		//    string avatarUrl,
		//    IWebSocketConnection playerWebsocket )
		//{
		//    this.playerName = playerName;
		//    this.playerJwt = playerJwt;
		//    this.playerRoomName = playerRoomName;
		//    this.playerRoomId = playerRoomId;
		//    this.avatarUrl = avatarUrl;
		//    this.playerWebsocketList.Add(playerWebsocket);
		//}
		#endregion

		public void Send(Player pl, String msgEvent, String value = null)
		{
			dynamic expando = new ExpandoObject();
			expando.avatarUrl = pl.avatarUrl;
			expando.playerName = pl.playerName;
			//expando.playerRoomId = pl.playerRoomId;
			//expando.playerRoomName = pl.playerRoomName;
			expando.playerUID = pl.playerUID;
			expando.playerBalance = pl.playerBalance;
			expando.postInGame = pl.pos_in_room;
			expando.post = Utils.Calculate_DislayPost(this,pl);
			expando.msgEvent = msgEvent;
			expando.value = value;

			this.playerWebsocketList.ForEach(s =>
			{
				//Console.WriteLine("s: " + s.ToString() + " : "+JsonConvert.SerializeObject(expando));
				s.Send(JsonConvert.SerializeObject(expando));
			});
		}



	}
}
