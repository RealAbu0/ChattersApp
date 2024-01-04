namespace ChattersApi.Middleware.Models
{
    public class Room
    {
        public Room(string roomId)
        {
            RoomId = roomId;
            Users = new List<UserMiddleware>();
        }

        public string RoomId { get; set;} = string.Empty;
        public List<UserMiddleware> Users { get; set;}  

    }
}
