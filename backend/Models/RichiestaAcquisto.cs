using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace backend.Models
{
    public class RichiestaAcquisto
    {
        [Key]
        public int RichiestaId { get; set; }
        [Required]
        public DateTime DataRichiesta { get; set; } = DateTime.UtcNow;
        [Required]
        public int CategoriaId { get; set; }
        [ForeignKey("CategoriaId")]
        public CategoriaAcquisto? Categoria { get; set; }
        [Required]
        public string Oggetto { get; set; } = string.Empty;
        [Required]
        public int Quantita { get; set; }
        [Required]
        public decimal CostoUnitario { get; set; }
        public string? Motivazione { get; set; }
        [Required]
        public string Stato { get; set; } = "In attesa"; // "In attesa", "Approvata", "Rifiutata"
        [Required]
        public int UtenteId { get; set; }
        [ForeignKey("UtenteId")]
        public User? Utente { get; set; }
        public DateTime? DataApprovazione { get; set; }
        public int? UtenteApprovazioneId { get; set; }
        [ForeignKey("UtenteApprovazioneId")]
        public User? UtenteApprovazione { get; set; }
    }
} 