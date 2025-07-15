using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Inserisci 'Bearer {token}'",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=app.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            builder.Configuration["Jwt:Key"] ?? "questaeunachiavesegretalunghissima1234567890!"
        ))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSwagger();
app.UseSwaggerUI();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.UseAuthentication();
app.UseAuthorization();
app.UseCors();
app.MapControllers();

// Middleware globale di gestione errori
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var result = JsonSerializer.Serialize(new { error = "Errore interno del server", details = ex.Message });
        await context.Response.WriteAsync(result);
    }
});

void SeedDatabase(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.Users.Any())
    {
        // Utenti
        db.Users.AddRange(
            new backend.Models.User
            {
                Email = "boss@azienda.it",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Nome = "Mario",
                Cognome = "Rossi",
                Ruolo = "Responsabile"
            },
            new backend.Models.User
            {
                Email = "anna.dip@azienda.it",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Nome = "Anna",
                Cognome = "Bianchi",
                Ruolo = "Dipendente"
            },
            new backend.Models.User
            {
                Email = "luca.dip@azienda.it",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Nome = "Luca",
                Cognome = "Verdi",
                Ruolo = "Dipendente"
            }
        );
        db.SaveChanges();

        // Categorie
        db.CategorieAcquisto.AddRange(
            new backend.Models.CategoriaAcquisto { Descrizione = "Informatica" },
            new backend.Models.CategoriaAcquisto { Descrizione = "Cancelleria" },
            new backend.Models.CategoriaAcquisto { Descrizione = "Arredamento" },
            new backend.Models.CategoriaAcquisto { Descrizione = "Servizi" }
        );
        db.SaveChanges();

        // Recupero oggetti con Id
        var responsabile = db.Users.First(u => u.Ruolo == "Responsabile");
        var dip1 = db.Users.First(u => u.Email == "anna.dip@azienda.it");
        var dip2 = db.Users.First(u => u.Email == "luca.dip@azienda.it");
        var cat1 = db.CategorieAcquisto.First(c => c.Descrizione == "Informatica");
        var cat2 = db.CategorieAcquisto.First(c => c.Descrizione == "Cancelleria");
        var cat3 = db.CategorieAcquisto.First(c => c.Descrizione == "Arredamento");
        var cat4 = db.CategorieAcquisto.First(c => c.Descrizione == "Servizi");

        // Richieste di acquisto
        var richieste = new List<backend.Models.RichiestaAcquisto>
        {
            new backend.Models.RichiestaAcquisto {
                DataRichiesta = DateTime.UtcNow.AddMonths(-2),
                CategoriaId = cat1.CategoriaId,
                Oggetto = "Notebook Lenovo ThinkPad",
                Quantita = 2,
                CostoUnitario = 1200,
                Motivazione = "Sostituzione vecchi PC",
                Stato = "Approvata",
                UtenteId = dip1.Id,
                DataApprovazione = DateTime.UtcNow.AddMonths(-2).AddDays(2),
                UtenteApprovazioneId = responsabile.Id
            },
            new backend.Models.RichiestaAcquisto {
                DataRichiesta = DateTime.UtcNow.AddMonths(-1),
                CategoriaId = cat2.CategoriaId,
                Oggetto = "Blocchi appunti A4",
                Quantita = 50,
                CostoUnitario = 1.5m,
                Motivazione = "Rifornimento magazzino",
                Stato = "Approvata",
                UtenteId = dip2.Id,
                DataApprovazione = DateTime.UtcNow.AddMonths(-1).AddDays(1),
                UtenteApprovazioneId = responsabile.Id
            },
            new backend.Models.RichiestaAcquisto {
                DataRichiesta = DateTime.UtcNow.AddDays(-20),
                CategoriaId = cat3.CategoriaId,
                Oggetto = "Sedia ergonomica",
                Quantita = 5,
                CostoUnitario = 180,
                Motivazione = "Nuovi arrivi in ufficio",
                Stato = "Rifiutata",
                UtenteId = dip1.Id,
                DataApprovazione = DateTime.UtcNow.AddDays(-18),
                UtenteApprovazioneId = responsabile.Id
            },
            new backend.Models.RichiestaAcquisto {
                DataRichiesta = DateTime.UtcNow.AddDays(-10),
                CategoriaId = cat4.CategoriaId,
                Oggetto = "Servizio pulizie straordinario",
                Quantita = 1,
                CostoUnitario = 350,
                Motivazione = "Evento aziendale",
                Stato = "In attesa",
                UtenteId = dip2.Id
            },
            new backend.Models.RichiestaAcquisto {
                DataRichiesta = DateTime.UtcNow.AddDays(-5),
                CategoriaId = cat1.CategoriaId,
                Oggetto = "Monitor 27 pollici",
                Quantita = 3,
                CostoUnitario = 250,
                Motivazione = "Upgrade postazioni",
                Stato = "In attesa",
                UtenteId = dip1.Id
            },
            new backend.Models.RichiestaAcquisto {
                DataRichiesta = DateTime.UtcNow.AddDays(-3),
                CategoriaId = cat2.CategoriaId,
                Oggetto = "Penna a sfera blu",
                Quantita = 100,
                CostoUnitario = 0.8m,
                Motivazione = "Uso quotidiano",
                Stato = "In attesa",
                UtenteId = dip2.Id
            }
        };
        db.RichiesteAcquisto.AddRange(richieste);
        db.SaveChanges();
    }
}

// Chiamo il seed all'avvio
SeedDatabase(app);

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
