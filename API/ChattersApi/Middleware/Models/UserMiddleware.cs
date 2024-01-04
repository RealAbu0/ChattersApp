using System.Net.WebSockets;

namespace ChattersApi.Middleware.Models
{
    public class UserMiddleware
    {
        public string Username { get; set; } = string.Empty;
        public string UserConnectionSocketId { get; set; } = string.Empty;
        public WebSocket UserConnectionSocket { get; set; }
    }
}
