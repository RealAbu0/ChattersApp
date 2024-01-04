using ChattersApi.Context;
using ChattersApi.Helpers;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace ChattersApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
       
        public UserController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }

            var user = await _appDbContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username);

            if (user == null)
            {
                return NotFound(new {Message = "User is not found!"});
            }

            if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
            {
                return BadRequest(new { message = "password is incorrect!" });
            }

           
            user.Token = CreateJwtToken(user);

            return Ok(new 
            {
                Token = user.Token,
                Message = "Login Success!"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }
            

            if(await CheckUsernameExist(userObj.Username))
            {
                return BadRequest(new { Message = "User already exists" });
            }
            if(await CheckEmailExists(userObj.Email))
            {
                return BadRequest(new { Message = "Email already exists" });
            }
            
            var userName = CheckUsernameContainsSpecialChars(userObj.Username);

            if(!string.IsNullOrEmpty(userName))
            {
                return BadRequest(new { Message = userName.ToString() });
            }

            var pass = CheckPassword(userObj.Password);
            if (!string.IsNullOrEmpty(pass))
            {
                return BadRequest(new { Message = pass.ToString() });
            }

            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";

            await _appDbContext.Users.AddAsync(userObj);

            await _appDbContext.SaveChangesAsync();

            return Ok(new {Message = "User registered!"});
        }

        [HttpPost("guestname")]
        public async Task<IActionResult> GuestName([FromBody]GuestUserDto name)
        {
            //  Sort this out
            
             name.GuestUserName += "#" + Guid.NewGuid().ToString().Substring(0,8);
            return Ok(new {Message = "Guest user created: " + name.GuestUserName});
           
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> AllUsers()
        {
            var allUsers = await _appDbContext.Users.ToListAsync();
            return Ok(allUsers);
        }


        private async Task<bool> CheckUsernameExist(string username)
        {
            return await _appDbContext.Users.AnyAsync(u => u.Username == username);
        }

        private async Task<bool> CheckEmailExists(string email)
        {
            return await _appDbContext.Users.AnyAsync(e => e.Email == email);
        }

        private string CheckUsernameContainsSpecialChars(string username)
        {
            StringBuilder sb = new StringBuilder();
            if(Regex.IsMatch(username, "[\\,|,!,#,$,%,&,/,(,),=,?,»,«,@,£,§,€,{,},.,-,;,',<,>,_,,]"))
            {
                sb.Append("The username should not contain any special characters");
            }
            return sb.ToString();
        }

        private string CheckPassword(string password)
        {
            StringBuilder sb = new StringBuilder();
            if(password.Length <= 8)
            {
                sb.Append("The password should be minimum of 8 characters long" + Environment.NewLine);
            }
            if(!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]")))
            {
                sb.Append("The password should contain lowercase and uppercase characters" + Environment.NewLine);
            }
            if(!Regex.IsMatch(password, "[0-9]"))
            {
                sb.Append("The password should contain numbers");
            }
            if (!Regex.IsMatch(password, "[\\,|,!,#,$,%,&,/,(,),=,?,»,«,@,£,§,€,{,},.,-,;,',<,>,_,,]"))
            {
                sb.Append("The passowrd should contain a special character" + Environment.NewLine);
            }
            return sb.ToString();
        }

        private string CreateJwtToken(User userObj)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes("secret45353454354jdfg");

            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, userObj.Role),
                new Claim(ClaimTypes.Name, $"{userObj.Firstname} {userObj.Lastname}"),
                new Claim(ClaimTypes.NameIdentifier, userObj.Username)
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddSeconds(5),
                SigningCredentials = credentials
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);
        }
    }
}
