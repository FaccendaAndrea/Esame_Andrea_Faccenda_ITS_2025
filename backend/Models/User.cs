using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [Required]
        public string Nome { get; set; } = string.Empty;
        [Required]
        public string Cognome { get; set; } = string.Empty;
        [Required]
        public string Ruolo { get; set; } = string.Empty; // "Dipendente" o "Responsabile"
    }
} 