using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategorieController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategorieController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/categorie
        [HttpGet]
        [AllowAnonymous] // opzionale: se vuoi che sia pubblica
        public async Task<IActionResult> GetCategorie()
        {
            var categorie = await _context.CategorieAcquisto
                .Select(c => new { c.CategoriaId, c.Descrizione })
                .ToListAsync();
            return Ok(categorie);
        }

        // POST /api/categorie
        [HttpPost]
        [Authorize(Roles = "Responsabile")]
        public async Task<IActionResult> CreaCategoria([FromBody] CategoriaAcquisto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Descrizione))
                return BadRequest(new { message = "Descrizione obbligatoria" });
            var exists = await _context.CategorieAcquisto.AnyAsync(c => c.Descrizione == dto.Descrizione);
            if (exists)
                return BadRequest(new { message = "Categoria già esistente" });
            _context.CategorieAcquisto.Add(dto);
            await _context.SaveChangesAsync();
            return Ok(new { dto.CategoriaId, dto.Descrizione });
        }

        // PUT /api/categorie/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Responsabile")]
        public async Task<IActionResult> ModificaCategoria(int id, [FromBody] CategoriaAcquisto dto)
        {
            var categoria = await _context.CategorieAcquisto.FindAsync(id);
            if (categoria == null)
                return NotFound();
            if (string.IsNullOrWhiteSpace(dto.Descrizione))
                return BadRequest(new { message = "Descrizione obbligatoria" });
            categoria.Descrizione = dto.Descrizione;
            await _context.SaveChangesAsync();
            return Ok(new { categoria.CategoriaId, categoria.Descrizione });
        }

        // DELETE /api/categorie/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Responsabile")]
        public async Task<IActionResult> EliminaCategoria(int id)
        {
            var categoria = await _context.CategorieAcquisto
                .Include(c => c.Richieste)
                .FirstOrDefaultAsync(c => c.CategoriaId == id);
            if (categoria == null)
                return NotFound();
            if (categoria.Richieste != null && categoria.Richieste.Any())
                return BadRequest(new { message = "Non puoi eliminare una categoria collegata a richieste" });
            _context.CategorieAcquisto.Remove(categoria);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Categoria eliminata" });
        }
    }
} 