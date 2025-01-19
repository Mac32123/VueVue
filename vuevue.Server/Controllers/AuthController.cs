using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using vuevue.Server.Database;
using vuevue.Server.Services;

namespace vuevue.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IBusService _busService;
        public AuthController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, JwtTokenService jwtTokenService,
            IBusService busService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _signInManager = signInManager;
            _busService = busService;
        }

        [Authorize]
        [HttpPost("busstops2")]
        public async Task<IActionResult> AddBusStopsForUser([FromBody] List<string> busStopIds)
        {
            if (busStopIds == null || busStopIds.Count == 0)
            {
                return BadRequest("Przystanki są wymagane.");
            }

            // Pobieramy identyfikator użytkownika z tokenu JWT
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Brak identyfikatora użytkownika w tokenie.");
            }

            try
            {
                // Wywołujemy metodę serwisu, aby dodać przystanki
                await _busService.AddBusStopsForUser(userId, busStopIds);
                return Ok(new { Message = "Przystanki zostały pomyślnie dodane." });
            }
            catch (Exception ex)
            {
                // Obsługuje ewentualne błędy, np. błędy związane z zapisem do bazy
                return StatusCode(500, new { Message = "Wystąpił błąd podczas zapisywania przystanków.", Error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("busstops")]
        public async Task<IActionResult> GetBusStops()
        {
            //Pobierz przystanki zapisane przez użytkownika
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Brak identyfikatora użytkownika w tokenie.");
            }
            var stops = await _busService.GetBusStopsForUser(userId);
            return Ok(stops);
        }

        [Authorize]
        [HttpGet("busdelete/{id}")]
        public async Task<IActionResult> DeleteBusStop(int id)
        {
            
            //Pobierz przystanki zapisane przez użytkownika
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Brak identyfikatora użytkownika w tokenie.");
            }
            var stops =  _busService.DeleteBusForUser(userId, id.ToString());

            return Ok(stops);
        }


        [Authorize]
        [HttpGet("user_data")]
        public async Task<IActionResult> GetUserData()
        {
            var user = HttpContext.User;
            var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = user.FindFirstValue(ClaimTypes.Email);

            return Ok(new {Id = id, Email = email });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { Message = "User created successfully" });
            }

            return BadRequest(result.Errors);
        }

        // Endpoint logowania użytkownika i generowania tokenu JWT
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
            if (result.Succeeded)
            {
                var token = _jwtTokenService.GenerateJwtToken(user);
                return Ok(new { Token = token });
            }

            return Unauthorized("Invalid username or password");
        }
    }
    public class RegisterModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
