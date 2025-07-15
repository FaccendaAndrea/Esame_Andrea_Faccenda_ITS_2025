using Microsoft.EntityFrameworkCore;
using backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<CategoriaAcquisto> CategorieAcquisto { get; set; }
    public DbSet<RichiestaAcquisto> RichiesteAcquisto { get; set; }
} 