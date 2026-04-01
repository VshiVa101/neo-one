# PROJECT_CONTEXT_NEO_ONE_MASTER.md

## 🚀 Neo-One Art Hub: Stato Attuale del Progetto

Questo file serve come memoria persistente per Leo e per l'AI (ChatGPT/Antigravity) per mantenere il contesto del lavoro.

---

### 🏛️ Architettura Tecnica
- **Framework**: Next.js 16 (App Router)
- **CMS**: Payload CMS v3 (Next.js Integrated)
- **Database**: SQLite (`neo-one.db`) - **⚠️ Nota: Temporaneo per sviluppo locale.**
- **Frontend**: Tailwind CSS, Framer Motion, Three.js / React Three Fiber.

---

### 📦 Content Model (Payload)
Abbiamo semplificato le collection per un inserimento manuale intuitivo:

1.  **Clusters** (`clusters`):
    *   *Uso*: I macro-gruppi (B/N, NeON, fOtO, Cose, Rumore).
    *   *Campi*: Titolo, Manifesto (Descrizione), Immagine Copertina, Design (Colori HEX in tab separata).
2.  **Subclusters** (`categories`):
    *   *Uso*: I sottogruppi (es. B/N -> Tarocchi). Funzionano come "mazzi di carte".
    *   *Alimentazione*: Titolo, Relazione Cluster Genitore, Mood/Nota.
    *   *Copertina*: Non hanno un'immagine propria; si sceglie un'opera del mazzo tramite il campo **Opera in primo piano** (Featured Artwork).
3.  **Artworks** (`artworks`):
    *   *Uso*: Le singole opere d'arte.
    *   *Campi*: Titolo, N. ID (Codice Neo), Immagine Principale, Galleria Dettagli, Prezzo (Opzionale), Stato Disponibilità, Relazione con Subcluster.

---

### 🖥️ Mappatura Frontend vs CMS

| Area | File Locale | Stato Readiness |
| :--- | :--- | :--- |
| **Hero (Intro)** | `src/app/(frontend)/page.tsx` | ✅ Custom / Stabile |
| **Home (Cluster)** | `src/components/home/ClusterLayout.tsx` | 🔴 **HARDCODED** (Mock data interni) |
| **Pagine Cluster** | `src/app/(frontend)/cluster/[slug]/page.tsx` | ✅ **DINAMICA** (Legge da Payload) |
| **Globali (Nav/Foot)** | `src/Header`, `src/Footer` | ✅ Dinamiche |

---

### 🛠️ Cose da Sapere (Caveats)
- **Migrazione DB**: In fase di sviluppo, se cambi campi obbligatori, il server potrebbe bloccarsi chiedendo conferme nel terminale. In caso di stallo, resettare `neo-one.db` è la via più veloce.
- **Vercel Readiness**: SQLite non è persistente su Vercel. Prima del deploy online, è **obbligatorio** passare a un database Postgres (es. Neon).
- **Boilerplate**: Molte cartelle come `src/blocks` e `src/heros` appartengono al template originale e possono essere rimosse se non utilizzate.

---

### 📋 Checklist Prossimi Step
- [ ] **Dinamizzazione Home**: Collegare `ClusterLayout.tsx` alla collection `clusters`.
- [ ] **Data Entry**: Leo inizia a popolare i cluster reali da `/admin`.
- [ ] **Cleanup**: Rimuovere le collection `Posts` e i blocchi non necessari.
- [ ] **Deploy Plan**: Configurare un DB Postgres per il rilascio online.

---
*Ultimo aggiornamento: 2026-04-01 (Antigravity AI)*
