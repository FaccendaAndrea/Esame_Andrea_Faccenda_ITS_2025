using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Responsabile")]
    public class StatisticheController : ControllerBase
    {
        private readonly AppDbContext _context;
        public StatisticheController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/statistiche/richieste
        [HttpGet("richieste")]
        public async Task<IActionResult> GetStatisticheRichieste()
        {
            var stats = await _context.RichiesteAcquisto
                .Include(r => r.Categoria)
                .GroupBy(r => new { Mese = r.DataRichiesta.Month, Anno = r.DataRichiesta.Year, r.CategoriaId, Categoria = r.Categoria!.Descrizione })
                .Select(g => new
                {
                    g.Key.Anno,
                    g.Key.Mese,
                    g.Key.CategoriaId,
                    Categoria = g.Key.Categoria,
                    NumeroRichieste = g.Count(),
                    TotaleQuantita = g.Sum(r => r.Quantita),
                    TotaleSpesa = g.Sum(r => r.Quantita * r.CostoUnitario)
                })
                .OrderByDescending(x => x.Anno).ThenByDescending(x => x.Mese)
                .ToListAsync();
            return Ok(stats);
        }
    }
} 