# CelePlanner — Specifica completa (v1)

## 1) Obiettivo e contesto
- Scopo: web app interna per la gestione operativa del palcoscenico a partire da Google Calendar (sorgente in sola lettura).
- Perimetro:
  - Sincronizzare gli eventi all-day (da oggi in poi) in un DB locale.
  - Arricchire ogni evento con convocazioni, squadre tecniche, stage manager, showtimes, allegati e note.
  - Supportare più eventi nello stesso giorno e più spettacoli (showtimes) nello stesso evento, con stage manager per singolo spettacolo.
- Non obiettivi: calendario pubblico/marketing, viste complesse di galleria foto.

## 2) Assunzioni operative
- Eventi utili su Google Calendar sono tutti **all-day** (gli altri ignorati).
- Possono esistere più eventi nella stessa `event_date` (anche cancellati/nuovi nello stesso giorno).
- Ogni evento può avere **1..N showtimes** nello stesso giorno.
- Montaggio e smontaggio sono **unici** per evento (non per showtime).
- Il sistema è **resiliente ai riavvii** e recupera delta via `syncToken`.

## 3) Ruoli e autenticazione
- Ruoli: `viewer` (lettura), `editor` (modifica), `admin` (utenti/anagrafica).
- Login semplice (email+password), cookie di sessione lato server.
- Stage manager (responsabile di palcoscenico): **solo interni**; può anche ricoprire ruoli tecnici.

## 4) Modello dati (relazionale)
DB: PostgreSQL. Allegati su filesystem.

### 4.1 Tabelle
- **events**: evento all-day (giorno di teatro). `event_id` (UUID PK), `gcal_id` (UNIQUE), `event_date`, `title`, `location?`, `description?`, `status` (`confirmed|cancelled`), `notes?`, `created_utc`, `updated_utc`.
- **event_showtimes**: 1..N spettacoli per evento. PK (`event_id`,`idx`), `show_time` (TIME).
- **event_show_stage_managers**: SM per singolo spettacolo. PK (`event_id`,`idx`), `person_id` (FK → persons). Regola: `persons.internal = true`.
- **event_phase_times**: convocazioni per fase (uniche per evento): `phase` in (`setup|show|teardown`), `tech_call_time?`; per `setup|teardown` anche `loaders_call_time?` e `loaders_quantity`.
- **persons**: anagrafica tecnici: `name`, `email?`, `internal` (BOOL), `note?`.
- **event_staff_assignments**: assegnazioni di giornata per fase/ruolo (`stagehand|electrician|sound`), con `is_stage_manager` (non usato per SM per showtime).
- **attachments**: metadati file e path relativo.
- **users / user_roles / sessions**: login e RBAC.

### 4.2 File system allegati
`/files/{YYYY}/{MM}/{YYYY-MM-DD - <slug titolo>}-{shortid}/...`  
`shortid` = primi 6–8 caratteri di `event_id` (evita collisioni). Nessun limite applicativo su formati/dimensioni.

## 5) Sincronizzazione Google → DB
- API Google Calendar read-only, **incrementale** con `syncToken`.
- Prima sync: da **oggi** (timezone Europe/Rome), `showDeleted=true`. Poi solo delta (paginated).
- Solo eventi **all-day** (`start.date` valorizzato). Non all-day: ignorati.
- Upsert su `events` per `gcal_id`; cancellazione → `status=cancelled` (non delete).
- Se `410 Gone`: invalidare `syncToken`, rifare prima sync da oggi.
- Email **digest** opzionale a fine run con modifiche (NEW/UPD/CANCEL).

## 6) API (contratto alto livello)
- `/auth/login` (POST) / `/auth/logout` (POST)
- `/api/events` (GET) lista periodo
- `/api/events/{event_id}` (GET) dettaglio
- `/api/events/{event_id}` (PATCH) aggiornamenti
- `/api/events/{event_id}/attachments` (POST multipart) upload
- `/api/attachments/{attachment_id}` (DELETE)
- `/api/persons` (GET, viewer+) — `/api/persons` (POST, admin)
- `/files/{path}` (GET protetto) — serve allegati
- `/healthz`

### 6.1 Dettaglio/PATCH — campi principali
- `show_times`: array `HH:mm`, unici e ordinati.
- `show_stage_managers`: array `{ idx, person_id }` (SM per singolo showtime) — `person.internal = true`.
- `phase_times`: `{ phase, tech_call_time, loaders_call_time?, loaders_quantity? }`; loaders solo per `setup|teardown`.
- `staff`: `{ phase, role, person_ids[] }` (di giornata).

## 7) UX — Vista Giornaliera (riferimento)
- Header: data grande, titolo, stato; tabs se più eventi nello stesso giorno; toggle “mostra cancellati”.
- Montaggio (🔧): SM giornata (interni), orario tecnici, facchini (orario + quantità), tecnici per ruolo (nomi).
- Spettacolo (🎭): chip showtime (`16:00•21:00`); per ogni showtime selezione SM (interno); orario tecnici show (unico).
- Smontaggio (🧰): come montaggio.
- Allegati (extra) + Note evento.

## 8) Regole/validazioni chiave
- SM per showtime: solo interni; `idx` deve esistere in showtimes.
- Convocazioni: un orario tecnici per fase; loaders solo setup/teardown (numero + orario).
- Staff: chiunque può fare qualsiasi ruolo; lo stesso nome può comparire in più fasi/ruoli.
- Eventi cancellati non si eliminano; `status=cancelled`.

## 9) Test di accettazione (estratto)
1. Prima sync: crea eventi futuri all-day; passati ignorati.
2. Delta update: campi cambiati in Google → aggiornati in DB.
3. Cancellazione Google → `status=cancelled`.
4. Doppio spettacolo con due SM interni differenti → OK.
5. Vincolo SM esterno → rifiutato.
6. Loaders su setup/teardown visibili come numero+orario; non per show.
7. Upload allegati multipli (PDF/HEIC/MP4) → salvati su path convenzionato e protetti.
8. Doppio evento lo stesso giorno → selettore + toggle cancellati.
