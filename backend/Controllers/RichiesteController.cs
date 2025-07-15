using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RichiesteController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RichiesteController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/richieste
        [HttpGet]
        public async Task<IActionResult> GetRichieste()
        {
            var ruolo = User.FindFirstValue(ClaimTypes.Role);
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (ruolo == "Responsabile")
            {
                var tutte = await _context.RichiesteAcquisto
                    .Include(r => r.Categoria)
                    .Include(r => r.Utente)
                    .Include(r => r.UtenteApprovazione)
                    .ToListAsync();
                return Ok(tutte);
            }
            else
            {
                var proprie = await _context.RichiesteAcquisto
                    .Where(r => r.UtenteId == userId)
                    .Include(r => r.Categoria)
                    .Include(r => r.Utente)
                    .Include(r => r.UtenteApprovazione)
                    .ToListAsync();
                return Ok(proprie);
            }
        }

        // GET /api/richieste/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRichiesta(int id)
        {
            var ruolo = User.FindFirstValue(ClaimTypes.Role);
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var richiesta = await _context.RichiesteAcquisto
                .Include(r => r.Categoria)
                .Include(r => r.Utente)
                .Include(r => r.UtenteApprovazione)
                .FirstOrDefaultAsync(r => r.RichiestaId == id);
            if (richiesta == null)
                return NotFound();
            if (ruolo != "Responsabile" && richiesta.UtenteId != userId)
                return Forbid();
            return Ok(richiesta);
        }

        // POST /api/richieste
        [HttpPost]
        public async Task<IActionResult> CreaRichiesta([FromBody] RichiestaAcquistoDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var richiesta = new RichiestaAcquisto
            {
                CategoriaId = dto.CategoriaId,
                Oggetto = dto.Oggetto,
                Quantita = dto.Quantita,
                CostoUnitario = dto.CostoUnitario,
                Motivazione = dto.Motivazione,
                UtenteId = userId,
                Stato = "In attesa",
                DataRichiesta = DateTime.UtcNow,
                DataApprovazione = null,
                UtenteApprovazioneId = null
            };
            _context.RichiesteAcquisto.Add(richiesta);
            await _context.SaveChangesAsync();
            return Ok(richiesta);
        }

        // PUT /api/richieste/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ModificaRichiesta(int id, [FromBody] RichiestaAcquistoDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var ruolo = User.FindFirstValue(ClaimTypes.Role);
            var richiesta = await _context.RichiesteAcquisto.FindAsync(id);
            if (richiesta == null)
                return NotFound();
            if (richiesta.Stato == "Approvata")
                return BadRequest(new { message = "Non puoi modificare una richiesta approvata" });
            if (ruolo != "Responsabile" && richiesta.UtenteId != userId)
                return Forbid();
            richiesta.CategoriaId = dto.CategoriaId;
            richiesta.Oggetto = dto.Oggetto;
            richiesta.Quantita = dto.Quantita;
            richiesta.CostoUnitario = dto.CostoUnitario;
            richiesta.Motivazione = dto.Motivazione;
            await _context.SaveChangesAsync();
            return Ok(richiesta);
        }

        // DELETE /api/richieste/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminaRichiesta(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var ruolo = User.FindFirstValue(ClaimTypes.Role);
            var richiesta = await _context.RichiesteAcquisto.FindAsync(id);
            if (richiesta == null)
                return NotFound();
            if (richiesta.Stato == "Approvata" && ruolo != "Responsabile")
                return Forbid();
            if (ruolo != "Responsabile" && richiesta.UtenteId != userId)
                return Forbid();
            _context.RichiesteAcquisto.Remove(richiesta);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Richiesta eliminata" });
        }

        // GET /api/richieste/da-approvare
        [HttpGet("da-approvare")]
        [Authorize(Roles = "Responsabile")]
        public async Task<IActionResult> GetDaApprovare()
        {
            var richieste = await _context.RichiesteAcquisto
                .Where(r => r.Stato == "In attesa")
                .Include(r => r.Categoria)
                .Include(r => r.Utente)
                .ToListAsync();
            return Ok(richieste);
        }

        // PUT /api/richieste/{id}/approva
        [HttpPut("{id}/approva")]
        [Authorize(Roles = "Responsabile")]
        public async Task<IActionResult> ApprovaRichiesta(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var richiesta = await _context.RichiesteAcquisto.FindAsync(id);
            if (richiesta == null)
                return NotFound();
            if (richiesta.Stato != "In attesa")
                return BadRequest(new { message = "Richiesta già gestita" });
            richiesta.Stato = "Approvata";
            richiesta.DataApprovazione = DateTime.UtcNow;
            richiesta.UtenteApprovazioneId = userId;
            await _context.SaveChangesAsync();
            return Ok(richiesta);
        }

        // PUT /api/richieste/{id}/rifiuta
        [HttpPut("{id}/rifiuta")]
        [Authorize(Roles = "Responsabile")]
        public async Task<IActionResult> RifiutaRichiesta(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var richiesta = await _context.RichiesteAcquisto.FindAsync(id);
            if (richiesta == null)
                return NotFound();
            if (richiesta.Stato != "In attesa")
                return BadRequest(new { message = "Richiesta già gestita" });
            richiesta.Stato = "Rifiutata";
            richiesta.DataApprovazione = DateTime.UtcNow;
            richiesta.UtenteApprovazioneId = userId;
            await _context.SaveChangesAsync();
            return Ok(richiesta);
        }
    }

    // DTO per la creazione richiesta
    public class RichiestaAcquistoDto
    {
        public int CategoriaId { get; set; }
        public string Oggetto { get; set; } = string.Empty;
        public int Quantita { get; set; }
        public decimal CostoUnitario { get; set; }
        public string? Motivazione { get; set; }
    }
} 