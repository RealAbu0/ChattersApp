using ChattersApi.Middleware.Interfaces;
using ChattersApi.Middleware.Models;


namespace ChattersApi.Middleware.Repository
{
    public class RoomRepository : IRoomRepository
    {
        private List<Room> _rooms;

        public RoomRepository()
        {
            _rooms = new List<Room>();
        }
        public void AddUserToRoom(UserMiddleware user, string roomId)
        {
            var room = GetRoom(roomId);
            room.Users.Add(user);
        }

        public string CreateRoom()
        {
            string roomId = Guid.NewGuid().ToString().Substring(0, 9);
            _rooms.Add(new Room(roomId));
            return roomId;
        }

        public IEnumerable<Room> GetAllRooms()
        {
            return _rooms;
        }

        public Room GetRoom(string roomId)
        {
            foreach (var room in _rooms)
            {
                if(room.RoomId == roomId)
                {
                    return room;
                }
            }
            return null;
        }

        public void RemoveRoom(string roomId)
        {
            _rooms.Remove(GetRoom(roomId));
        }

        public void RemoveUserFromRoom(UserMiddleware user, string roomId)
        {
            var targetRoom = GetRoom(roomId);
            foreach(var room in _rooms)
            {
                if(room.RoomId == targetRoom.RoomId)
                {
                    room.Users.Remove(user);
                }
            }
        }
    }
}
