# Template Esame - Full Stack Web App

Questo progetto è un **template riutilizzabile** per applicazioni web full stack, pensato per essere una base solida e moderna per progetti futuri.

## Caratteristiche principali

- **Backend**: ASP.NET Core (C#), Entity Framework Core (SQLite), autenticazione JWT, API REST modulari
- **Frontend**: React (Vite), pagine Login/Registrazione/Home, autenticazione client-side, routing protetto
- **Sicurezza**: Password hashate (BCrypt), token JWT, CORS configurato
- **Testing API**: Swagger UI integrato per testare le API direttamente dal browser
- **Struttura**: Separazione chiara tra backend e frontend, facile da estendere

---

## Come avviare il progetto

### 1. Clona il repository

```sh
git clone <url-repo>
cd <nome-cartella-repo>
```

### 2. Avvia il backend

```sh
cd backend
# (solo la prima volta) dotnet restore
# (solo la prima volta) dotnet ef database update
# Avvio del backend
 dotnet run
```
- Il backend partirà su una porta (es: `http://localhost:5161`).
- Swagger UI sarà disponibile su `/swagger` (es: `http://localhost:5161/swagger`).

### 3. Avvia il frontend

```sh
cd frontend
npm install
npm run dev
```
- Il frontend sarà su `http://localhost:5173`.

### 4. Testa l'applicazione
- Registrati e fai login dal frontend.
- Oppure testa le API da Swagger UI (`/swagger`).

---

## Personalizzazione
- Cambia le pagine React per aggiungere nuove funzionalità.
- Aggiungi nuovi controller e modelli C# per estendere le API.
- Modifica la stringa di connessione o la chiave JWT in `backend/appsettings.json`.

---

## Struttura delle cartelle

```
/backend   # Progetto ASP.NET Core (API, DB, autenticazione)
/frontend  # Progetto React (UI, autenticazione client, routing)
```

---

## Note
- Il database SQLite (`app.db`) e le migration non vengono committati (vedi `.gitignore`).
- Per ambienti di produzione, ricordati di cambiare la chiave JWT e configurare HTTPS.

---

**Autore:** Andrea Faccenda
