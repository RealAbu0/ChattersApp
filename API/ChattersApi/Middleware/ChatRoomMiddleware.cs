using ChattersApi.Middleware.Interfaces;
using ChattersApi.Middleware.Models;
using Domain.Models;
using Newtonsoft.Json;
using System.Net.WebSockets;
using System.Text;

namespace ChattersApi.Middleware
{
    public class ChatRoomMiddleware
    {
        public static IRoomRepository _iRoom;
        private readonly RequestDelegate _requestDelegate;

        public ChatRoomMiddleware(RequestDelegate requestDelegate, IRoomRepository iRoom)
        {
            _requestDelegate = requestDelegate;
            _iRoom = iRoom;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            if(!httpContext.WebSockets.IsWebSocketRequest)
            {
                await _requestDelegate.Invoke(httpContext);
                return;
            }

            CancellationToken ct = httpContext.RequestAborted;
            WebSocket currentSocket = await httpContext.WebSockets.AcceptWebSocketAsync();
            var RequestStringQueryParams = httpContext.Request.Query;
            var userName = RequestStringQueryParams["username"];
            var roomId = RequestStringQueryParams["room"];
            var socketId = Guid.NewGuid().ToString();

            var currentUser = new UserMiddleware
            {
                Username = userName,
                UserConnectionSocketId = socketId,
                UserConnectionSocket = currentSocket,
            };

            _iRoom.AddUserToRoom(currentUser, roomId);

            foreach(var user in _iRoom.GetRoom(roomId).Users)
            {
                if(user.UserConnectionSocket.State != WebSocketState.Open)
                {
                    continue;
                }

                await SendStringAsync(user.UserConnectionSocket, "{\"messageEventType\":1,\"message\":\"" + currentUser.Username + " has joined \"}", ct);
            }

            while (true)
            {
                if (ct.IsCancellationRequested)
                {
                    foreach(var user in _iRoom.GetRoom(roomId).Users)
                    {
                        if(user.UserConnectionSocket.State == WebSocketState.Open)
                        {
                            await SendStringAsync(user.UserConnectionSocket, "{\"messageEventType\":1,\"message\":\"" + currentUser.Username + " has left \"}", ct);
                        }
                    }
                    break;
                }

                var response = await ReceiveStringAsync(currentSocket, ct);

                if(response == null)
                {
                    break;
                }

                var chatMessageEvent = JsonConvert.DeserializeObject<ChatMessageEvent>(response);

                if (string.IsNullOrEmpty(response))
                {
                    if(currentSocket.State != WebSocketState.Open)
                    {
                        break;
                    }

                    continue;
                }

                foreach(var user in _iRoom.GetRoom(roomId).Users)
                {
                    if(user.UserConnectionSocket.State != WebSocketState.Open)
                    {
                        continue;
                    }


                    if (user.UserConnectionSocket == currentSocket)
                    {
                        continue;
                    }

                    await SendStringAsync(user.UserConnectionSocket, response, ct);
                }


            }

            _iRoom.RemoveUserFromRoom(currentUser, roomId);

            foreach(var user in _iRoom.GetRoom(roomId).Users)
            {
                if(user.UserConnectionSocket.State == WebSocketState.Open)
                {
                    await SendStringAsync(user.UserConnectionSocket, "{\"messageEventType\":1,\"message\":\"" + currentUser.Username + " has left \"}", ct);
                }
            }

            if(currentSocket.State == WebSocketState.Open)
            {
                await currentSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", ct);
            }

            currentSocket.Dispose();



        }

        private static Task SendStringAsync(WebSocket ws, string data, CancellationToken ct = default(CancellationToken))
        {
            var buffer = Encoding.UTF8.GetBytes(data);
            var segment = new ArraySegment<byte>(buffer);
            return ws.SendAsync(segment, WebSocketMessageType.Text, true, ct);
        }

        private static async Task<string> ReceiveStringAsync(WebSocket ws, CancellationToken ct = default(CancellationToken))
        {
            var buffer = new ArraySegment<byte>(new byte[8192]);

            using(var ms = new MemoryStream())
            {
                WebSocketReceiveResult result;

                do
                {
                    ct.ThrowIfCancellationRequested();
                    result = await ws.ReceiveAsync(buffer, ct);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                }
                while (!result.EndOfMessage);
                
                ms.Seek(0, SeekOrigin.Begin);
                if(result.MessageType != WebSocketMessageType.Text) 
                {
                    return null;
                }
                using(var reader =  new StreamReader(ms, Encoding.UTF8))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }
        
    }
}
