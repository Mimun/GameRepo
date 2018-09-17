using System;
using System.Collections.Generic;
using System.Text;
using System.Reactive.Linq;
using System.Linq;

namespace GameFoundation.GameUtils
{
	public static class Utils
	{
		public static IDisposable SetTimeout(Action action, double timeSpan)
		{
			var result = Observable.Timer(TimeSpan.FromMilliseconds(0), TimeSpan.FromMilliseconds(timeSpan)).Subscribe(_ => action?.Invoke());
			return result;
		}
		public static IDisposable SetInterval(Action action, int timeSpan)
		{
			var result = Observable.Timer(TimeSpan.FromMilliseconds(timeSpan), TimeSpan.FromMilliseconds(timeSpan)).Subscribe(_ => action?.Invoke());
			return null;
		}
		public static int Calculate_DislayPost(Player host, Player client)
		{
			//counter start from 0;
			int maxPlayer_InGame = 4;
			
			int hostPos = host.pos_in_room;
			int clientPos = client.pos_in_room;
			int postInGame =   clientPos - hostPos;
			if (postInGame < 0)
			{
				postInGame = maxPlayer_InGame + postInGame;
			}
			return postInGame;
		}
		

	}


}
