# Esame ITS 2025 – Andrea Faccenda

Applicazione web full stack per la gestione delle richieste di acquisto, con autenticazione, dashboard dipendente/responsabile, statistiche e gestione categorie.

---

## **Tecnologie**

- **Backend:** ASP.NET Core (C#), Entity Framework Core (SQLite), autenticazione JWT, API REST
- **Frontend:** React (Vite), autenticazione client-side, routing protetto, notifiche, filtri avanzati
- **Sicurezza:** Password hashate (BCrypt), token JWT, CORS configurato

---

## **Avvio rapido**

### 1. Clona il repository

```sh
git clone <url-repo>
cd Esame_Andrea_Faccenda_ITS_2025
```

### 2. Avvia il backend

```sh
cd backend
dotnet restore
dotnet ef database update   # solo la prima volta, se necessario
dotnet run
```
- Il backend sarà su `http://localhost:5161`
- Swagger UI: `http://localhost:5161/swagger`

### 3. Avvia il frontend

```sh
cd frontend
npm install
npm run dev
```
- Il frontend sarà su `http://localhost:5173`

---

## **Funzionalità principali**

- Login/registrazione con ruoli (Dipendente/Responsabile)
- Dashboard dipendente: crea, modifica, elimina richieste di acquisto
- Dashboard responsabile: filtra, approva, rifiuta richieste, statistiche, gestione categorie
- Notifiche (alert) per tutte le azioni importanti
- Filtri avanzati e ricerca
- UI moderna, responsive, accessibile

---

## **Struttura delle cartelle**

```
/backend    # Progetto ASP.NET Core (API, DB, autenticazione)
/frontend   # Progetto React (UI, autenticazione client, routing)
```

---

## **Cosa NON includere nella zip**

- `node_modules/` (frontend)
- `frontend/dist/`, `frontend/.vite/`, `frontend/.eslintcache`
- `backend/bin/`, `backend/obj/`
- `.git/`, `.vscode/`, file temporanei o di log

**Chi riceve la zip dovrà solo lanciare `npm install` e `dotnet restore` per ricreare tutto.**

---

## **Personalizzazione**

- Modifica le pagine React in `frontend/src/pages/` per nuove funzionalità o stile
- Aggiungi controller/modelli in `backend/Controllers/` e `backend/Models/`
- Cambia la stringa di connessione o la chiave JWT in `backend/appsettings.json`

---

## **Note**

- Il database SQLite (`app.db`) e le migration non vanno committati (vedi `.gitignore`)
- Per produzione, cambia la chiave JWT e configura HTTPS

---

**Autore:** Andrea Faccenda
