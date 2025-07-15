using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.Nome) || string.IsNullOrWhiteSpace(dto.Cognome) || string.IsNullOrWhiteSpace(dto.Ruolo))
                return BadRequest(new { message = "Tutti i campi sono obbligatori" });
            if (!dto.Email.Contains("@") || dto.Password.Length < 6)
                return BadRequest(new { message = "Email non valida o password troppo corta (min 6 caratteri)" });
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email già registrata" });
            if (dto.Ruolo != "Dipendente" && dto.Ruolo != "Responsabile")
                return BadRequest(new { message = "Ruolo non valido" });

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Nome = dto.Nome,
                Cognome = dto.Cognome,
                Ruolo = dto.Ruolo
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registrazione avvenuta" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Email e password sono obbligatori" });
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Credenziali non valide" });

            var token = GenerateJwtToken(user);
            return Ok(new {
                token,
                user = new {
                    user.Id,
                    user.Email,
                    user.Nome,
                    user.Cognome,
                    user.Ruolo
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "super_secret_jwt_key");
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Ruolo),
                new Claim("nome", user.Nome),
                new Claim("cognome", user.Cognome)
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class UserRegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Cognome { get; set; } = string.Empty;
        public string Ruolo { get; set; } = string.Empty;
    }
    public class UserLoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
} 