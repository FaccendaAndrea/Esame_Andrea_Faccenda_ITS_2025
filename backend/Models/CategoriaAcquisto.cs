using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace backend.Models
{
    public class CategoriaAcquisto
    {
        [Key]
        public int CategoriaId { get; set; }
        [Required]
        public string Descrizione { get; set; } = string.Empty;
        public ICollection<RichiestaAcquisto>? Richieste { get; set; }
    }
} 