using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace GameFoundation.GameUtils
{
	public class Room
	{
		public string ID { get; set; }
		public string Name { get; set; }
		public List<Player> Players { get; set; } = new List<Player>();

		public List<int> RemainCards;
		

		enum Stage {
			Ready,Playing, Finallizing
		}

		private Stage status;

		public Room(Player pl)
		{
			this.ID = pl.playerRoomId;
			this.Name = pl.playerRoomName;
			this.addPlayer(pl);
			this.status = Stage.Ready;
		}

		public void addPlayer(Player pl)
		{
			if (this.status != Stage.Ready) {
				return;
			}
			Players.Add(pl);
			//(position in game to calculate respective postion in display of each player)
			// check and prepair again
			#region Assign position for player 
			int post = 0;			
			Players.ForEach(p => {
				if (p.pos_in_room == -1 || p.pos_in_room != post) {					
					p.pos_in_room = post;					
				}				
				post++;
			});
			Players.ForEach(p => {
				this.Broadcast(p, StaticEvent.JOIN_OR_CREATE_ROOM_SERVER_to_CLIENT);
				p.Status = Player.Stage.Idle;
			});
			#endregion
			// Send Start Button to the lastWinner or the player has min Score or the player minPostion in Game
			Player lastWinner = StaticEvent.FindLastWinner(this.Players);
			//lastWinner.Send(lastWinner, StaticEvent.TAKE_START_BUTTON_SERVER_to_CLIENT);
			if (lastWinner != null && this.Players.Count > 1)
			{
				lastWinner.Send(lastWinner, StaticEvent.TAKE_START_BUTTON_SERVER_to_CLIENT);
			}
		}

		public void Broadcast(Player pl, string msgEvent)
		{
			Players.ForEach(p =>
			{
				p.Send(pl, msgEvent);
				pl.Send(p, msgEvent);
			});
		}

		public void removePlayer(Player pl)
		{
			if (this.status == Stage.Playing) {
				// End game, left player pay a penanty to other in Game
				// the declare a winner in State.Finallizing
				return;
			}
			Players.Remove(pl);
			// SendEvent LEFT_ROOM to all players in Room
			Players.ForEach(p =>
			{
				// 1. Send information of new player to everyone in room
				p.Send(pl, StaticEvent.PLAYER_LEFT_ROOM_SERVER_to_CLIENT);
			});
			// Send Start Button to the lastWinner or the player has min Score or the player minPostion in Game
			Player lastWinner = StaticEvent.FindLastWinner(this.Players);
			if (lastWinner != null && this.Players.Count > 1) {
				lastWinner.Send(lastWinner, StaticEvent.TAKE_START_BUTTON_SERVER_to_CLIENT);
			}
			
		}
		// Send start game signal to all of players
		public void StartGame(Player pl) {
			List<int> shuffleCards = StaticEvent.CardShuffle();

			// clear all cards  and other remain in each player
			Players.ForEach(p => {
				p.Cards.Clear();
				p.LostCards.Clear();
				p.EarnedCards.Clear();
				p.PlacedCardsList.Clear();
				p.IsFirstShowCardPlayer = false;
			});
			
			//1. Distribute cards to each player in room. Only one have winner flag
			Player winner = Players.FirstOrDefault(p => p.isWinner == true);
			winner.Cards.Add(shuffleCards[0]);
			shuffleCards.Remove(shuffleCards[0]);
			winner.Status = Player.Stage.Placing;
			winner.IsFirstShowCardPlayer = true;

			
			// Distribute card to each other
			for (var i = 0; i< 9; i++)
			{
				Players.ForEach(p => {
					p.Cards.Add(shuffleCards[0]);
					shuffleCards.Remove(shuffleCards[0]);
				});
			}
			this.RemainCards = shuffleCards;

			#region check
			// using for check during development
			string json = JsonConvert.SerializeObject(RemainCards);
			Console.WriteLine("Remain Cards {0} and total count {1}",json, shuffleCards.Count);
			json = string.Join(",", winner.Cards.ToArray());
			Console.WriteLine("Card on Winner: {0}", json);
			#endregion
			pl.Status =Player.Stage.Placing;
			Players.ForEach(p =>
			{
				p.Send(p, StaticEvent.START_NEW_GAME_SERVER_to_CLIENT, json = string.Join(",", p.Cards.ToArray()));
			});
		}

		internal void EarnCardFromOther(Player pl)
		{
			Player precededPlayer = pl.PrecededPlayer;
			int placedCard = precededPlayer.PlacedCard;
			//	1. Validate to verify whether this card could be take. ?
			
			
			//  2. Set this card to player's earn cards list
			pl.EarnedCards.Add(placedCard);
			//	3. Set this card to preceded's lost card
			precededPlayer.LostCards.Add(placedCard);
			precededPlayer.PlacedCardsList.Remove(placedCard);

			//  4. Change player status to placing or showCards

			if (pl.PlacedCardsList.Count >= 3)
			{
				Console.WriteLine(pl.playerName + " Have to ShowCard");
				pl.Status = Player.Stage.ShowCards;
			}
			else
			{
				pl.Status = Player.Stage.Placing;
			}
			
			//	5. Inform to all players
			Players.ForEach(p => p.Send(pl,StaticEvent.TAKE_CARD_FROM_OTHER_SERVER_to_CLIENT,placedCard.ToString()));
			//	6. Calculate the firsPersonShowCard and then remove placed card from older to newer
			StaticEvent.SwapFirstShowCard(pl, Players);
		}

		internal void TakeNewCard(Player pl)
		{
			// Take a new Card from Desk
			if (pl.Status != Player.Stage.Considering || RemainCards.Count <= 0)  {
				return;
			}
			
			int newCard = RemainCards[0];
			pl.Cards.Add(newCard);
			RemainCards.Remove(newCard);
			Console.WriteLine("Number of Remain Cards: {0}", RemainCards.Count);
			

			Players.ForEach(p =>{
				if(p !=pl) {
					p.Send(pl, StaticEvent.TAKE_CARD_FROM_DESK_SERVER_to_CLIENT, (-1).ToString());
				} else {
					p.Send(pl, StaticEvent.TAKE_CARD_FROM_DESK_SERVER_to_CLIENT, newCard.ToString());
				}
			});
			if (pl.PlacedCardsList.Count >= 3)
			{
				Console.WriteLine(pl.playerName + " Have to ShowCard");
				pl.Status = Player.Stage.ShowCards;
			}
			else
			{
				pl.Status = Player.Stage.Placing;
			}
			
		}

		public void PlacingCard(Player pl, int cardVal)
		{
			// 1. Check the card is valid then remove this card from player.Cards <List>
			if (!pl.Cards.Contains(cardVal))
			{
				return;
			}
			// 3. Check number of placed card on cardLists. If number of placed cards == 4 then player have to show they collection

			//if (pl.PlacedCardsList.Count >= 3)
			//{
			//	Console.WriteLine(pl.playerName + " Have to ShowCard");
			//	ShowCardCollections(pl);

			//}

			pl.Cards.Remove(cardVal);
			pl.PlacedCard = cardVal;
			pl.PlacedCardsList.Add(cardVal);
			// 2. Broadcasd the card was placed to all players
			Players.ForEach(p => {
				p.Send(pl, StaticEvent.PLACING_CARD_SERVER_to_CLIENT, cardVal.ToString());
			});


			// 3. Change Status of next Player
			Player nextPlayer = StaticEvent.FindNextPlayer(pl, Players);
			nextPlayer.PrecededPlayer = pl;
			pl.Status = Player.Stage.Idle;
			nextPlayer.Status = Player.Stage.Considering;
		}

		//public void ShowCardCollections(Player pl) {
		//	// Send ShowCard Message to Player to disable placed card button (place_bnt). the showCard button is going to appeear instead
		//	pl.Send(pl, StaticEvent.SHOW_CARDCOLLECTIONS_SERVER_to_CLIENT, null);
		//}

	}
}
