# PROJECT_CONTEXT_NEO_ONE_MASTER.md

## 🚀 Neo-One Art Hub: Stato Attuale del Progetto

Questo file serve come memoria persistente per Leo e per l'AI (ChatGPT/Antigravity) per mantenere il contesto del lavoro.

---

### 🏛️ Architettura Tecnica
- **Framework**: Next.js 15+ (App Router)
- **CMS**: Payload CMS v3 (Next.js Integrated)
- **Database**: Neon Postgres (cloud, piano free)
- **Image Storage**: Cloudinary (cloud, piano free)
- **Hosting (produzione)**: Vercel (piano Hobby free)
- **Frontend**: Tailwind CSS, Framer Motion, Three.js / React Three Fiber
- **Package Manager**: pnpm

⚠️ SQLite (`neo-one.db`) è stato abbandonato.
Il progetto usa Neon Postgres da subito per evitare doppio lavoro locale/produzione.

Le immagini caricate da `/admin` vanno su Cloudinary tramite il Payload storage adapter.
Neo non interagisce mai direttamente con Cloudinary.

---

### 🌐 Infrastruttura Servizi

| Servizio | Ruolo | Piano | Costo |
|---|---|---|---|
| GitHub | Repository codice | Free | €0 |
| Vercel | Hosting sito + admin | Hobby Free | €0 |
| Neon | Database Postgres | Free | €0 |
| Cloudinary | Storage immagini | Free | €0 |

L'agente NON deve mai:
- Ripristinare SQLite come database
- Salvare immagini localmente nel progetto (devono andare su Cloudinary)
- Modificare le credenziali Neon/Cloudinary senza approvazione di Leo

---

### 📦 Content Model Definitivo (Payload)

#### Globals

| Slug | Label Admin | Gruppo | Scopo |
|---|---|---|---|
| `hero-settings` | Hero | IMPOSTAZIONI SITO | Testo warning circolare nella Hero |
| `calendar-settings` | Calendario | IMPOSTAZIONI SITO | CTA calendario, CTA default evento, link social |
| `cart-settings` | Carrello / Comunicazione | IMPOSTAZIONI SITO | Avviso shipping & pagamenti (richText) |

##### `hero-settings` — campi:
- `warningText` (textarea, required) — testo provocatorio rotante attorno all'occhio

##### `calendar-settings` — campi:
- `calendarCTA` (textarea, required) — CTA pagina calendario
- `defaultEventCTA` (textarea, required) — CTA fallback per dettaglio evento
- `socialLinks` (array) — icone social rotonde: `icon` (upload, required), `url` (text, required), `label` (text, required)

##### `cart-settings` — campi:
- `shippingPaymentNotice` (richText, required) — unico campo richText del progetto

---

#### Collections

##### 1. Clusters (`clusters`)
Macro-gruppi: B/N, NeON, fOtO, Cose, Rumore.

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `title` | text | ✅ | |
| `slug` | text (unique, index) | — | Sidebar, URL-friendly |
| `manifesto` | textarea | ✅ | Descrizione visibile in Home |
| `coverImage` | upload → media | ✅ | Preview in Home |
| `cta` | text | ❌ | Post-MVP, nel DB da subito |
| `sortOrder` | number (default 0) | ❌ | Sidebar. Basso = prima |
| **Tab Design:** | | | |
| `primaryColor` | text (HEX) | ❌ | Colore primario cluster |
| `secondaryColor` | text (HEX) | ❌ | Colore secondario cluster |

##### 2. Subclusters (`categories`)
Sottogruppi / mazzi di carte. Es: B/N → Tarocchi.

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `title` | text | ✅ | Titolo mazzo |
| `slug` | text (unique, index) | — | Sidebar |
| `cluster` | relationship → clusters | ✅ | Cluster genitore |
| `featuredArtwork` | relationship → artworks | ❌ | Copertina mazzo. Se vuoto → prima opera |
| `mood` | textarea | ❌ | Nota/mood del mazzo |
| `sortOrder` | number (default 0) | ❌ | Sidebar |

##### 3. Artworks (`artworks`)
Singole opere d'arte. Admin usa N.ID come titolo.

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `nid` | text (unique) | ✅ | Codice Neo. `useAsTitle` |
| `title` | text | ❌ | Neo spesso usa solo N.ID |
| `slug` | text (unique, index) | — | Sidebar |
| `mainImage` | upload → media | ✅ | Immagine principale |
| `detailGallery` | array → upload | ❌ | Close-up, dettagli |
| `executionMethod` | text | ❌ | Es. "Acrilico su tela" |
| `support` | text | ❌ | Es. "Tela", "Carta 300g" |
| `creationDate` | text | ❌ | Testo libero: "2023" |
| `originalDimensions` | text | ❌ | Es. "70×100 cm" |
| `availability` | select | ✅ | `comprabile` · `ordinabile` · `non_disponibile` (default) |
| `priceInfo` | textarea | ❌ | Testo libero prezzo |
| `subcluster` | relationship → categories | ✅ | In quale mazzo |
| `sortOrder` | number (default 0) | ❌ | Sidebar. Posizione nel mazzo |

##### 4. Signals (`signals`)
Eventi calendario.

| Campo | Tipo | Required | Note |
|---|---|---|---|
| `title` | text | ✅ | Titolo evento |
| `slug` | text (unique, index) | — | Sidebar |
| `eventDate` | date | ✅ | Picker solo giorno. Frontend estrae giorno/mese |
| `description` | textarea | ✅ | Descrizione evento |
| `previewImage` | upload → media | ✅ | Preview quadrata piccola per lista |
| `detailImages` | array → upload (max 2) | — | 1-2 immagini per dettaglio evento |
| `eventCTA` | text | ❌ | CTA specifico. Fallback: `defaultEventCTA` da global |
| `sortOrder` | number (default 0) | ❌ | Sidebar. Override cronologico |

---

### 🖥️ Mappatura Frontend vs CMS

| Area | Route | File Locale | Stato |
|---|---|---|---|
| Hero (Intro) | `/` | `src/app/(frontend)/page.tsx` | ✅ Custom / Stabile. Warning text → sarà da `hero-settings` |
| Home (Cluster hub) | `/home` | `src/components/home/ClusterLayout.tsx` | 🔴 **HARDCODED** — deve leggere da `clusters` |
| Cluster espanso | `/cluster/[slug]` | `src/app/(frontend)/cluster/[slug]/page.tsx` | ✅ Scaffold dinamico presente |
| Dettaglio opera | `/artwork/[slug]` | `src/app/(frontend)/artwork/[slug]/page.tsx` | 🟡 Da costruire |
| Calendario | `/calendar` | `src/app/(frontend)/calendar/page.tsx` | 🟡 Da costruire |
| Dettaglio evento | `/calendar/[slug]` | `src/app/(frontend)/calendar/[slug]/page.tsx` | 🟡 Da costruire |
| Form/Carrello | — | — | 🟡 Da costruire |

---

### 📝 Config Payload — File da toccare

Tutti i globals e collections vanno registrati in `src/payload.config.ts`:

**Globals da creare:**
- `src/globals/HeroSettings.ts`
- `src/globals/CalendarSettings.ts`
- `src/globals/CartSettings.ts`

**Collections da aggiornare/creare:**
- `src/collections/Clusters.ts` — aggiornare con spec definitiva
- `src/collections/Categories.ts` — aggiornare con spec definitiva
- `src/collections/Artworks.ts` — aggiornare con spec definitiva
- `src/collections/Signals.ts` — **NUOVO**, da creare

**In `payload.config.ts`:**
- importare e registrare i 3 globals
- importare e registrare Signals
- verificare che Clusters, Categories, Artworks siano aggiornati
- configurare Neon Postgres come database adapter
- configurare Cloudinary come storage adapter

---

### 🛡️ Database / Schema Safety Rules
1. **Nessun Reset Automatico**: NON cancellare il database senza approvazione esplicita di Leo.
2. **Priorità alla Conservazione**: Mai proporre reset come soluzione di default.
3. **Analisi dell'Impatto**: Prima di modifiche a collezioni/campi, documentare: Assunzioni, Rischi, Opzione meno invasiva, Impatto sui dati.
4. **Stop & Confirm**: Cambio schema potenzialmente distruttivo → fermarsi e chiedere conferma.
5. **Strategia Additive-First**: Aggiungere nuovi campi prima di rimuovere vecchi.
6. **Reset Eccezionale**: Solo se: dati sono sacrificabili, impatto spiegato, Leo approva esplicitamente.
7. **Mai toccare SQLite**: Il progetto non usa più SQLite. Non ripristinarlo mai.

---

### 🎨 Convenzioni Progetto
- **Availability values**: `comprabile` · `ordinabile` · `non_disponibile`
- **sortOrder**: numero basso = appare prima. Default 0.
- **richText**: usato SOLO in `shippingPaymentNotice`. Tutto il resto è text/textarea.
- **Slug**: manuale per MVP. Auto-generation possibile in futuro.
- **Colori progetto**: pink `#F45390`, soft-pink `#B3828B`
- **Eye motif**: non negoziabile, non rimuovere/neutralizzare mai.
- **Preview carrello**: stesse immagini da artworks/signals, ridimensionate via CSS. Zero upload separati.
- **Immagini**: tutte su Cloudinary via Payload storage adapter. Mai salvate localmente.

---

### 📋 Checklist Prossimi Step
- [ ] Configurare Neon Postgres come database del progetto
- [ ] Configurare Cloudinary come storage adapter per Payload
- [ ] Creare `src/globals/HeroSettings.ts`
- [ ] Creare `src/globals/CalendarSettings.ts`
- [ ] Creare `src/globals/CartSettings.ts`
- [ ] Creare `src/collections/Signals.ts`
- [ ] Aggiornare `src/collections/Clusters.ts` con spec definitiva
- [ ] Aggiornare `src/collections/Categories.ts` con spec definitiva
- [ ] Aggiornare `src/collections/Artworks.ts` con spec definitiva
- [ ] Registrare tutto in `src/payload.config.ts`
- [ ] Verificare che `/admin` funzioni con Neon
- [ ] Popolare i 5 cluster reali
- [ ] Dinamizzare Home (ClusterLayout.tsx → legge da Payload)
- [ ] Costruire pagina cluster espanso
- [ ] Costruire pagina dettaglio opera
- [ ] Costruire pagina calendario
- [ ] Costruire pagina dettaglio evento
- [ ] Costruire form inquiry/carrello
- [ ] Cleanup: rimuovere collection Posts e blocchi inutilizzati
- [ ] Deploy su Vercel + collegamento dominio

---

### 🔖 Git Anchors Noti
| # | Commit | Branch | Significato |
|---|---|---|---|
| 1 | `dfc9a539...` | `feature/home-clusters` | Hero eye fix + Home tracking fix |
| 2 | `33bec5b1...` | `feature/home-clusters` | Home footer/cart interactions |
| 3 | `684e33cd...` | `feature/home-clusters` | Payload collections scaffold + subcluster route |

---

*Ultimo aggiornamento: Post-sessione spec definitiva — infrastruttura Neon + Cloudinary + content model completo*
