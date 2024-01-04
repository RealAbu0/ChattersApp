using ChattersApi.Middleware.Models;


namespace ChattersApi.Middleware.Interfaces
{
    public interface IRoomRepository
    {
        public string CreateRoom();
        public Room GetRoom(string roomId);
        public IEnumerable<Room> GetAllRooms();
        public void RemoveRoom(string roomId);
        public void AddUserToRoom(UserMiddleware user, string roomId);
        public void RemoveUserFromRoom(UserMiddleware user, string roomId);

    }
}
