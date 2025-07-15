using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class CategoriaAcquisto
    {
        [Key]
        public int CategoriaId { get; set; }
        [Required]
        public string Descrizione { get; set; } = string.Empty;
        [JsonIgnore]
        public ICollection<RichiestaAcquisto>? Richieste { get; set; }
    }
} 