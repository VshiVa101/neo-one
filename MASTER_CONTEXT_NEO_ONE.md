# Neo-One Art Hub — Master Context / Restore File v3

---

## 0. Identity

**Project name:** Neo-One Art Hub
**Owner / artist:** Neo-One
**Designer / builder / strategic operator:** Leo

**Project nature:**
- Real art website for Neo-One
- Portfolio-grade proof of execution for Leo
- Ticket into web / UI / UX work

---

## 1. Project Goal

Neo-One Art Hub è un sito artistico custom e non censurato per l'artista Neo-One.

Il progetto deve funzionare come:
- sito artistico reale
- esperienza immersiva premium
- progetto portfolio che prova che Leo sa progettare, dirigere e spedire un prodotto digitale custom

Il sito deve sentirsi:
- premium
- underground
- brutale / provocatorio
- cyber / distopico
- custom-made, non template
- visivamente immersivo ma realizzabile con budget zero

---

## 2. Strategic Constraints

- budget near zero
- no enterprise tools
- no heavy backend complexity if avoidable
- avoid overengineering
- low-cost / open-source preferred where sensible
- Leo is not a backend developer
- project must ship fast
- priority is execution, not theoretical purity
- avoid solutions that create long-term maintenance burden

---

## 3. Absolute Strategic Decisions — Already Made

### Do NOT:
- restart project from scratch
- migrate to Webflow or WordPress
- change the current stack
- remove the eye motif
- cut subcluster page from MVP
- cut calendar event detail from MVP
- turn this into standard ecommerce
- add Stripe now
- add user auth now
- build custom order backend now
- revert to SQLite
- save images locally instead of Cloudinary

### Do:
- continue from the local project already running
- use ChatGPT as strategic co-pilot / prompt writer / scope controller
- use local agent (Devstral or equivalent on OpenCode) for code inspection and implementation
- keep scope tight
- work page by page / task by task
- rely on visual verification, not just agent optimism
- use Neon Postgres as database
- use Cloudinary as image storage

---

## 4. Product Truths

- Neo-One often numbers artworks instead of giving them traditional titles
- N.ID is important — it is the artwork identifier
- relationship 1:1 with Neo increases value perception
- acquisition flow is intentionally personal, not anonymous ecommerce
- "checkout" is really an inquiry / request / pre-order flow
- uncensored / provocative content is part of the identity
- visual identity is not decorative fluff: it is core to the product

---

## 5. Real Maturity Level

**Do NOT assume the site is close to finished.**

- Hero → exists, approved visually
- Home → accepted checkpoint state, stable enough, should not be micro-polished further
- Deep pages → scaffolds exist but are NOT production-ready
- Real navigation flow → still needs to be made meaningful
- Project is in backbone-building phase, not final polish

---

## 6. Confirmed MVP Scope

1. Entry / Hero
2. Home cluster hub
3. Subcluster page ← non-negotiable
4. Artwork detail page
5. Calendar overview
6. Calendar event / release detail ← non-negotiable
7. Inquiry flow (simple, not full ecommerce)

**What can wait:**
- cart full state logic
- actual ecommerce logic
- green cart behavior
- merch/product extra flows
- refined filters
- advanced CMS elegance
- polish-heavy microfeatures

---

## 7. Stack

- **Framework:** Next.js 15+ App Router
- **CMS:** Payload CMS v3 (Next.js integrated, NOT v2)
- **Database:** Neon Postgres (cloud, free tier)
- **Image Storage:** Cloudinary (cloud, free tier) via `@jhb.software/payload-cloudinary-plugin`
- **Hosting:** Vercel (Hobby free)
- **Frontend:** Tailwind CSS, Framer Motion, Three.js / React Three Fiber
- **Package Manager:** pnpm
- **Local agent:** Devstral-2-123B-Instruct-2512 via OpenCode

⚠️ SQLite è abbandonato definitivamente. Non ripristinarlo mai.
⚠️ Le immagini vanno SEMPRE su Cloudinary. Mai salvate localmente.

---

## 8. IA / UX Structure

Il sito ha **4 stati principali** gestiti da URL e **2 sovrapposizioni** gestite come overlay:

| Stato | URL | Note |
|---|---|---|
| Hero | `/` | Solo prima visita. Poi redirect auto a `/home` |
| Home + Cluster Expanded | `/home` | Stessa pagina, due stati interni React |
| Artwork Detail | `/artwork/[nid]` | Pagina propria |
| Calendar | `/calendar` | Pagina propria |
| Event Detail | `/calendar/[slug]` | Pagina propria |
| 404 | `/404` | Pagina custom con minigioco (service worker) |

**Overlay globali (non sono pagine, non hanno URL):**
- **Cart/Form** — si apre sopra qualsiasi vista quando si tocca l'icona carrello

Il sito NON è:
- un normale ecommerce
- una normale galleria
- un normale portfolio

È un **immersive editorial art navigation system.**

---

## 9. Eye Motif — Non-Negotiable

L'occhio non è decorazione. È:
- ancora simbolica di navigazione
- punto di interazione ricorrente
- identity marker del sito
- parte dell'ingresso emotivo nel mondo di Neo-One

Non rimuoverlo, sostituirlo o neutralizzarlo mai.

---

## 10. Routing — Definitivo

```
/                    → Hero (solo prima visita via localStorage)
/home                → Home  ← cluster expansion avviene QUI, nessun URL change
/artwork/[nid]       → Artwork Detail
/calendar            → Calendar Overview
/calendar/[slug]     → Event Detail
/404                 → Custom 404 + minigioco
```

**NON esiste `/cluster/[slug]`** — il subcluster view è uno stato interno della Home.

⚠️ Lo slug nei cluster e nelle categories esiste nel CMS come chiave interna, ma NON genera pagine navigabili via URL.

---

## 11. Infrastructure

| Servizio | Ruolo | Piano | Costo |
|---|---|---|---|
| GitHub | Repository codice | Free | €0 |
| Vercel | Hosting Next.js + Payload | Hobby Free | €0 |
| Neon | Database Postgres | Free | €0 |
| Cloudinary | Storage immagini | Free | €0 |

**Neon free tier:** il DB dorme dopo 5 min di inattività. Prima visita dopo sleep = ~2-3 secondi extra. Accettabile per MVP.

**Cloudinary free tier:** ~25GB storage. Per MVP con ~100-200 opere è più che sufficiente.

**Image upload flow:** Neo carica da `/admin` → Payload manda a Cloudinary → il sito legge da Cloudinary. Neo non tocca mai Cloudinary direttamente.

**Domain:** Neo già lo possiede. Verrà collegato a Vercel al deploy.

---

## 12. Cloudinary Storage — Dettagli Implementazione

**Plugin usato:** `@jhb.software/payload-cloudinary-plugin` v0.3.3+

**Motivo della scelta:**
- Non esiste adapter Cloudinary ufficiale per Payload v3
- Questo plugin è il più aggiornato e attivo della community (78 stelle, 2 issues aperte, aggiornato regolarmente)
- Supporta `clientUploads: true` per bypassare il limite 4.5MB di Vercel

**Stato attuale:**
- `clientUploads: false` — funziona in locale, upload verificato su Cloudinary ✅
- `clientUploads: true` — da abilitare prima del deploy su Vercel (richiede fix importMap per `CloudinaryClientUploadHandler`)

**Config attuale in `payload.config.ts`:**
```typescript
cloudinaryStorage({
  collections: { media: true },
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  credentials: {
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  folder: 'uploads',
  clientUploads: false,
  useFilename: true,
})
```

---

## 13. Payload Config — Stato Attuale

**File:** `src/payload.config.ts`

**Collections registrate:** `Media`, `Users`, `Clusters`, `Categories`, `Artworks`, `Signals`

**Globals registrati:** `HeroSettings`, `CalendarSettings`, `CartSettings`

**Rimosso dal template originale:**
- `Pages`, `Posts` collections — non servono
- `Header`, `Footer` globals — non servono
- `BeforeLogin`, `BeforeDashboard` components — template decorativo
- `...plugins` spread del template — referenziava collezioni rimosse
- `livePreview`, `jobs` — non servono per MVP

**Editor:** `lexicalEditor({})` — obbligatorio in Payload v3, presente nel config.

**Database:**
```typescript
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI,
  },
}),
```

---

## 14. Content Model Definitivo

### Globals

#### `hero-settings`
- `warningText` (textarea, required) — testo circolare rotante attorno all'occhio

#### `calendar-settings`
- `calendarCTA` (textarea, required) — CTA pagina calendario
- `defaultEventCTA` (textarea, required) — CTA fallback dettaglio evento
- `socialLinks` (array) — `icon` (upload), `url` (text), `label` (text)

#### `cart-settings`
- `shippingPaymentNotice` (richText, required, `editor: lexicalEditor({})`) — UNICO campo richText del progetto

---

### Collections

#### `clusters`
| Campo | Tipo | Required |
|---|---|---|
| `title` | text | ✅ |
| `slug` | text unique index | sidebar |
| `manifesto` | textarea | ✅ |
| `coverImage` | upload → media | ✅ |
| `cta` | text | ❌ post-MVP |
| `sortOrder` | number default 0 | sidebar |
| `primaryColor` | text HEX — tab Design | ❌ |
| `secondaryColor` | text HEX — tab Design | ❌ |

#### `categories` (Subclusters)
| Campo | Tipo | Required |
|---|---|---|
| `title` | text | ✅ |
| `slug` | text unique index | sidebar |
| `cluster` | relationship → clusters | ✅ |
| `featuredArtwork` | relationship → artworks | ❌ |
| `mood` | textarea | ❌ |
| `sortOrder` | number default 0 | sidebar |

#### `artworks`
| Campo | Tipo | Required |
|---|---|---|
| `nid` | text unique — useAsTitle | ✅ |
| `title` | text | ❌ |
| `slug` | text unique index | sidebar |
| `mainImage` | upload → media | ✅ |
| `detailGallery` | array → upload | ❌ |
| `executionMethod` | text | ❌ |
| `support` | text | ❌ |
| `creationDate` | text | ❌ |
| `originalDimensions` | text | ❌ |
| `availability` | select | ✅ |
| `priceInfo` | textarea | ❌ |
| `subcluster` | relationship → categories | ✅ |
| `sortOrder` | number default 0 | sidebar |

**Availability values:** `comprabile` · `ordinabile` · `non_disponibile` (default)

#### `signals`
| Campo | Tipo | Required |
|---|---|---|
| `title` | text | ✅ |
| `slug` | text unique index | sidebar |
| `eventDate` | date | ✅ |
| `description` | textarea | ✅ |
| `previewImage` | upload → media | ✅ |
| `detailImages` | array → upload (max 2) | ❌ |
| `eventCTA` | text | ❌ |
| `sortOrder` | number default 0 | sidebar |

**Uso nel frontend Event Detail:**
- Desktop: `previewImage` (slot 1) + `detailImages[0]` (slot 2). Se `detailImages` è vuoto → immagine default con badge **"Stupidi gadget iN OmaggiO!"**
- Mobile: solo `previewImage` (slot 1)

---

## 15. Cluster Reali MVP

1. **B/N** — slug: `b-n` — Opere in bianco e nero, per devastare l'ipocrisia cromatica.
2. **NeON** — slug: `neon` — Opere a colori per demolire il grigiume.
3. **fOtO** — slug: `foto` — Congelamento di sguardi in lo-fi.
4. **Cose** — slug: `cose` — Merch, concretizzazioni, ingombraspazi, roba.
5. **Rumore** — slug: `rumore` — Suoni che ho emesso e registrato, da solo o con altri.

**Subclusters noti:**
- B/N → Illustrazioni generali
- B/N → Tarocchi

---

## 16. Frontend vs CMS — Stato Attuale

| Area | Route | File | Stato |
|---|---|---|---|
| Hero | `/` | `src/app/(frontend)/page.tsx` | ✅ Stabile. Manca: localStorage first-visit check |
| Home | `/home` | `src/components/home/ClusterLayout.tsx` | 🔴 Logica navigazione ✅ — Dati HARDCODED |
| Artwork detail | `/artwork/[nid]` | — | 🔴 Da costruire |
| Calendar | `/calendar` | — | 🔴 Da costruire |
| Event detail | `/calendar/[slug]` | — | 🔴 Da costruire |
| Cart/Form overlay | globale | — | 🔴 Da costruire |
| 404 custom | `/404` | — | 🔴 Da costruire (post-MVP) |

**Nota: `/cluster/[slug]` ELIMINATA dalla roadmap.** La subcluster view è uno stato interno di `/home`.

**Prossimo sblocco critico:**
Connettere `ClusterLayout.tsx` alla Local API di Payload (sostituire `CLUSTERS` hardcoded con dati reali da Neon).

---

## 17. Database Safety Rules

1. **No reset automatico** — mai senza approvazione esplicita di Leo
2. **Priorità alla conservazione** — mai proporre reset come soluzione default
3. **Analisi impatto** — prima di modifiche schema: assunzioni, rischi, opzione meno invasiva
4. **Stop & Confirm** — cambio schema potenzialmente distruttivo → fermarsi e chiedere
5. **Additive-first** — aggiungere campi prima di rimuovere
6. **Mai SQLite** — il progetto non usa più SQLite, non ripristinarlo mai

---

## 18. Convenzioni Progetto

- **sortOrder:** numero basso = appare prima. Default 0.
- **richText:** usato SOLO in `shippingPaymentNotice`. Tutto il resto è text/textarea.
- **Slug:** manuale per MVP.
- **Colori:** pink `#F45390`, soft-pink `#B3828B`
- **Eye motif:** non negoziabile.
- **Preview carrello:** stesse immagini da artworks/signals, CSS resize. Zero upload separati.
- **Hydration warning da estensioni browser:** ignorare, non è un bug del progetto.

---

## 19. Working Method

**Tre livelli:**
1. **Git** — source of truth assoluta. Checkpoint fisici con hash.
2. **Agente locale (Devstral su OpenCode)** — esegue modifiche, ispeziona file, riporta.
3. **ChatGPT** — cervello strategico. Decide priorità, scrive prompt, critica output.

**ChatGPT deve:**
- decidere le priorità
- controllare lo scope
- scrivere prompt precisi per l'agente
- criticare gli output onestamente
- non fidarsi ciecamente dei messaggi "done"

**L'agente deve:**
- ispezionare il codice reale
- fare edit specifici
- riportare i file realmente modificati
- verificare il comportamento reale quando possibile

**Leo deve:**
- testare visivamente
- mandare screenshot
- sfidare i falsi positivi
- mantenere le decisioni di gusto finale

---

## 20. Communication Style

- linguaggio naturale conciso
- orientato all'esecuzione
- poca teoria
- no spiegazioni lunghe se non necessarie
- iterazione veloce

Struttura risposta quando si propone una soluzione:
1. Assunzioni
2. Rischi
3. Opzione più economica

Separare sempre:
- MVP essenziale
- miglioramenti futuri
- cose da evitare

---

## 21. Git Anchors

| # | Hash | Branch | Significato |
|---|---|---|---|
| 1 | `dfc9a539...` | `feature/home-clusters` | Hero eye fix + Home tracking fix |
| 2 | `33bec5b1...` | `feature/home-clusters` | Home footer/cart interactions |
| 3 | `684e33cd...` | `feature/home-clusters` | Payload collections scaffold + subcluster route |
| 4 | `92d48892...` | `feature/home-clusters` | Neon Postgres + Cloudinary storage adapter |

---

## 22. Resume Procedure

Se il contesto si perde, chiedere a Leo:

1. L'admin `/admin` è raggiungibile localmente?
2. L'upload immagini verso Cloudinary funziona?
3. Il DB è su Neon Postgres?
4. I 5 cluster reali sono stati inseriti in admin?
5. La Home legge già da Payload o è ancora hardcoded?
6. Qual è l'ultimo commit Git?
7. Ci sono errori aperti irrisolti?

---

## 23. Execution Order — Aggiornato

| # | Step | Stato |
|---|---|---|
| 1 | Creare account Neon + Cloudinary | ✅ DONE |
| 2 | Switch da SQLite a Neon Postgres | ✅ DONE |
| 3 | Configurare Cloudinary storage adapter | ✅ DONE |
| 4 | Aggiornare schema Payload al definitivo | ✅ DONE |
| 5 | Pulire payload.config.ts dai residui template | ✅ DONE |
| 6 | DB Reset → schema pulito, admin funzionante | ✅ DONE |
| 7 | Fix richText fields + verifica upload Cloudinary | ✅ DONE |
| 8 | Conferma architettura definitiva da wireframe | ✅ DONE |
| 9 | Popolare i 5 cluster reali via `/admin` | ✅ DONE |
| 10 | Collegare Home a Payload (ClusterLayout dinamico) | ✅ DONE |
| 11 | Aggiungere Hero first-visit logic (localStorage) | ✅ DONE |
| 12 | Home: Costruire stato "Expanded Cluster" (Mostrare Subclusters e Artworks) | 🔴 PROSSIMO |
| 13 | Costruire Artwork Detail `/artwork/[nid]` | ⬜ |
| 14 | Costruire Calendar `/calendar` | ⬜ |
| 15 | Costruire Event Detail `/calendar/[slug]` | ⬜ |
| 16 | Costruire Cart/Form overlay globale (Zustand/Context) | ⬜ |
| 17 | Costruire 404 custom + minigioco | ⬜ post-MVP |
| 18 | Fix `clientUploads: true` per Vercel | ⬜ pre-deploy |
| 19 | Deploy su Vercel | ⬜ |
| 20 | Collegare dominio di Neo | ⬜ |
| 21 | Test finale online | ⬜ |

---

## 24. Cose da Evitare

- ripartire da zero
- cambiare stack
- overengineering backend
- ecommerce completo
- ignorare gli hydration warning da estensioni (già documentati)
- lasciare che l'agente definisca il roadmap
- assumere che un cambio codice = UX corretta
- riaprire decisioni strategiche già chiuse
- confondere Payload admin disponibile con frontend già dinamico
- ripristinare SQLite
- salvare immagini localmente

---

## 25. Chiarimenti Tecnici Permanenti

### Users Collection
È la collezione di autenticazione di Payload — serve **solo** per accedere a `/admin`. I visitatori del sito pubblico non la vedono mai. Utenti attuali: Leo (NFO-WEB). Eventuale accesso futuro per Neo verrebbe aggiunto qui.

### Slug nei Cluster/Categories
Lo slug **esiste nel CMS** come chiave interna unica. **Non genera pagine navigabili via URL.** Viene usato in React come `key` per componenti e come identificatore nelle query.

### Scalabilità del Database
Il progetto è scalabile per design:
- **Aggiungere campos**: safe, i dati esistenti non vengono toccati
- **Aggiungere collections**: safe, nuova tabella, vecchie intatte
- **Rimuovere campi**: distruttivo solo per quel campo, tutto il resto rimane
- In locale: Payload sincronizza automaticamente lo schema all'avvio
- In produzione: sistema di migration files (versionate in Git, eseguite al deploy)

### Cluster Navigation System (già implementato)
File: `src/components/home/ClusterLayout.tsx`
- `navState`: `{ left, right, next, pool }` — traccia i due cluster in focus e il prossimo da mostrare
- Wheel mouse **fuori** footer → swappa cluster (giù = rimpiazza sx, su = rimpiazza dx)
- Wheel mouse **sopra** footer → non trigga swap, lascia scroll il footer
- Drag footer → scorri la strip orizzontalmente
- Click cluster nel footer → `replaceCluster(i)` → rimpiazza il lato "next" (alterna L/R)
- Cluster attivi in footer: dimmed (0.4 opacity) per distinzione visiva

---

## 26. Stato Attuale — Sessione Aprile 2026

**Ultimo commit stabile:** `db469cb`
`feat: db reset and schema cleanup, fix 500 error on payload boot`

**Cosa funziona:**
- ✅ Neon Postgres connesso, schema pulito, admin avviabile senza errori
- ✅ Cloudinary storage operativo (`clientUploads: false`), upload verificato
- ✅ Payload admin a `localhost:3001/admin` — collezioni corrette visibili
- ✅ `Users`: 1 utente (NFO-WEB / Leo)
- ✅ Architettura definitiva del sito confermata da wireframe e codice esistente
- ✅ `ClusterLayout.tsx`: logica navigazione cluster DINAMICA (Payload Local API)
- ✅ `home/page.tsx`: fetch dei dati da database con fallback robusto per immagini Cloudinary
- ✅ `HeroClient.tsx`: logica di "First Visit" completata tramite localStorage

**Prossimo step immediato (Step 12):**
Costruire l'**Espansione del Cluster** all'interno della riscrittura di `ClusterLayout.tsx` o `home/page.tsx`. Quando l'utente clicca su un cluster in primo piano, la sua view si espande coprendo la pagina per rivelare i relativi Subcluster (Categorie) e Artworks, con possibilità di chiuderla (back to home grid) o cliccare su un artwork.

**Branch attivo:** `feature/home-clusters`

**Resume check:**
1. Admin raggiungibile localmente? → `localhost:3001/admin`
2. Upload immagini → Cloudinary funziona?
3. I 5 cluster reali sono stati inseriti in admin?
4. `ClusterLayout.tsx` legge da Payload o ancora hardcoded?
5. Qual è l'ultimo commit Git?
