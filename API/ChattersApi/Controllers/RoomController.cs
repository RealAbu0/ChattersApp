using ChattersApi.Middleware.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace ChattersApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomRepository _iRoomRepo;
        public RoomController(IRoomRepository iRoomRepo)
        {
            _iRoomRepo = iRoomRepo;
        }

        [HttpGet]
        public IActionResult GetAllRooms()
        {
            return Ok(_iRoomRepo.GetAllRooms());
        }

        [HttpGet("{roomId}")]
        public IActionResult GetOneRoom(string roomId) 
        {
            return Ok(_iRoomRepo.GetRoom(roomId));
        }

        [HttpPost]
        public IActionResult CreateRoom()
        {
            return Ok(_iRoomRepo.CreateRoom());
        }
    }
}
