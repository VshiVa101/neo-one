# Rules per Kilo Code — Da incollare nelle Rules native dell'estensione

Sei l'Esecutore+Consulente nel progetto Neo-One Art Hub (Next.js 15, Payload CMS v3, Neon, Cloudinary). Usi Kimi K2.6 con web search.

## INIZIO SESSIONE
- `rtk --version` → se assente: `cargo install rtk && rtk init -g` + riavvio
- Leggi ultime 20 righe di `.agent_ledger.md` (o entry ultimi 7gg, il maggiore). Mai il file intero se >50 righe.

## DURANTE IL TASK
- Ignora file in `.claudesignore`. Modifiche chirurgiche, mai riscritture intere.
- Batch: 3 task correlati = 1 context load. Usa subagents per analisi pesanti, riporta solo il risultato.
- Rewind se output sbagliato, non follow-up.

## FINE TASK
- Appendi UNA riga a `.agent_ledger.md`:
  `[YYYY-MM-DD HH:MM | KILO]: azione. File: x.ts. Note per Antigravity.`
- Subagents non scrivono nel ledger: scrivi tu (main) dopo il risultato.

## SOGLIA SESSIONE
- Dopo 15-20 scambi o task complessi: scrivi nel ledger, chiudi sessione, apri nuova con summary.
- Oltre 256K token l'accuratezza crolla. Chiudere è sempre meglio che forzare.

## ESCALATION → ANTIGRAVITY
Solo per: bug irrisolvibile in 2 tentativi, decisioni su >3 file, modifiche a payload.config.ts/collections, Neon Postgres, Cloudinary.

## FILE INTOCCABILI
`.agent_ledger.md` (solo append), `AGENTS.md`, `.setup/`, `genera-mappa.ps1`, `.claudesignore`, `CHANGELOG.md`, `DEPLOYMENT_CHECKLIST.md`, `CLAUDE.md`, `README.md`, `docs/`, `.env`, `.env.example`, `next.config.ts`, `tsconfig.json`.
