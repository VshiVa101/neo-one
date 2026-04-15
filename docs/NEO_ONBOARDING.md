# Neo Onboarding — Neo-One

Last updated: 2026-04-15

Questo documento è la guida "a prova d'errore" per Neo: accesso admin, flusso operativo minimo, e il profilo XnConvert raccomandato per preparare le immagini al sito.

## 1) Accesso admin

- URL Admin: https://neo-one.vercel.app/admin
- Email: neo@neo-one.art
- Password: (inviata separatamente, cambiare al primo accesso)

Passaggi obbligatori dopo il primo login:

1. Vai su `Account` / `Profile` → clicca `Change password` e imposta una nuova password robusta.
2. Salva le credenziali nel tuo password manager (1Password, Bitwarden, o simili).
3. Controlla `Media` → assicurati che le immagini caricate siano in WebP e abbiano nomi senza spazi.

## 2) Flusso rapido per caricare una Opera

1. Prepara le immagini con XnConvert (vedi sezione seguente).
2. Apri Admin → `Media` → `Add` → trascina il file WebP.
3. Vai su `Artworks` → `Add New`:
   - `Title` → titolo
   - `Image` → seleziona il file caricato
   - `Alt text` → breve descrizione
   - `Save` / `Publish`

## 3) XnConvert — Profilo raccomandato (NEO_ONE_WEB)

Impostazioni precise da salvare come profilo (nome suggerito: **NEO_ONE_WEB**):

- Scheda ORIGINE: trascina tutti i file sorgente (JPG, PNG, TIFF).
- Scheda AZIONI:
  - `Aggiungi azione > Immagine > Ridimensiona`
    - Modalità: **Lato più lungo** (Longest side)
    - Dimensione: varia per tipo (vedi tabella sotto)
    - Ricalcolo (Resampling): **Lanczos**
    - Disabilita l'ingrandimento / Solo riduci
  - `Aggiungi azione > Metadati > Rimuovi` (consigliato)
- Scheda DESTINAZIONE:
  - Formato: **WEBP**
  - Impostazioni qualità: **85**
  - Cartella output: `PRONTE_SITO` o una cartella chiara
  - Salva profilo: `NEO_ONE_WEB`

### Parametri raccomandati

- OPERE (Artworks): lato lungo **1920 px** — WebP — qualità **85** — rimuovi metadati
- COPERTINE / CLUSTERS: lato lungo **1200 px** — WebP — qualità **85**
- EVENTI (Signals): lato lungo **1200 px** — WebP — qualità **85**
- ICONE UI: lato lungo **256 px** (o **512 px** se dettagliato) — WebP (mantieni alpha)
- SFONDI full page: **1920x1080** — WebP — qualità **75**
- TEXTURE 3D (Eye): **2048x2048** (quadrata) — WebP — qualità **90** — non ridimensionare se già power-of-two

Nota: salva il profilo e riutilizzalo per tutti i batch per evitare incongruenze.

## 4) Operazioni giornaliere consigliate per Neo

- Carica assets ottimizzati (WebP) solo tramite il profilo `NEO_ONE_WEB`.
- Per le texture 3D, mantieni risoluzioni power-of-two (1024/2048) per evitare problemi UV.
- Se qualcosa non appare correttamente sul sito, apri Console del browser e copia l'errore; inviami lo screenshot.

## 5) Note di sicurezza

- Non salvare la password in file del repository.
- Cambia la password al primo accesso e salva nel password manager.

## 6) Dove trovare aiuto

- Contattami direttamente e posso effettuare verifiche remote o correggere asset problematici.
