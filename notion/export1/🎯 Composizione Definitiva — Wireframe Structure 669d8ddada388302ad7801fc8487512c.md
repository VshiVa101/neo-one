# 🎯 Composizione Definitiva — Wireframe Structure

Owner: leo

# Overview Architettura Sito

<aside>
📱

**Struttura MVP**: 2 pagine principali + CMS per artwork details

**Approccio**: Mobile-first, interfaccia pulita, navigazione simbolica

**Estetica**: Giornalino interattivo anni '90 con texture carta

</aside>

---

## Mappa del Sito

```
┌─────────────────────────────────────┐
│         HERO SECTION                │
│    (Eye + Parental Advisory)        │
└──────────────┬──────────────────────┘
               │
     ┌─────────┴─────────┐
     ▼                   ▼
┌─────────┐         ┌──────────┐
│  HOME/  │         │ CALENDAR │
│ GALLERY │         │    +     │
│    +    │         │ LINKTREE │
│  SHOP   │         └──────────┘
└────┬────┘
     │
     ▼
┌─────────────────┐
│ ARTWORK DETAIL  │
│   (CMS Pages)   │
└─────────────────┘
```

---

# 🎪 PAGINA 1: Hero Section

## Composizione Visiva

### Layout Mobile (320-768px)

```
╔═══════════════════════════════════╗
║                                   ║
║        [TEXTURE CARTA             ║
║         IN MOVIMENTO]             ║
║                                   ║
║          👁️                       ║
║      (OCCHIO INTERATTIVO)         ║
║     segue tap/movimento           ║
║                                   ║
║       ┌─────────────┐             ║
║       │   NEO ONE   │             ║
║       │    LOGO     │             ║
║       └─────────────┘             ║
║                                   ║
║    ⚠️ PARENTAL ADVISORY           ║
║   Mature content: nude/violence   ║
║                                   ║
║         [TAP TO ENTER]            ║
║      → explosion animation        ║
║                                   ║
╚═══════════════════════════════════╝
```

### Layout Desktop (1024px+)

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║              [TEXTURE CARTA IN MOVIMENTO]             ║
║          (loop 3-4 scansioni carta stropicciata)     ║
║                                                       ║
║                      👁️                              ║
║               (OCCHIO INTERATTIVO)                    ║
║              segue cursore del mouse                  ║
║                                                       ║
║                 ┌─────────────┐                       ║
║                 │   NEO ONE   │                       ║
║                 │    LOGO     │                       ║
║                 └─────────────┘                       ║
║                                                       ║
║         ⚠️ PARENTAL ADVISORY WARNING                  ║
║      This site contains mature content                ║
║         (nude images, violence)                       ║
║                                                       ║
║              [CLICK TO EXPLORE]                       ║
║           → explosion transition                      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

## Elementi Funzionali

| Elemento | Funzione | Comportamento |
| --- | --- | --- |
| **Occhio 3D** | Engagement immediato | Segue cursore (desktop) o tap (mobile) |
| **Logo Neo One** | Brand identity | Posizionato sotto l'occhio |
| **Warning Advisory** | Avviso contenuti maturi | Testo statico, leggibile |
| **CTA Centrale** | Gateway verso contenuto | Click → animazione esplosione → Gallery |
| **Background** | Atmosfera editoriale | GIF loop texture carta (3-4 frame) |

<aside>
⚡

**ASSET NECESSARI DA NEO (Week 5 - Feb 2-8):**

- Occhio 3D (modello o render multipli per animazione)
- Logo Neo One (vettoriale + versione alta risoluzione)
- Texture carta stropicciata (3-4 scansioni per GIF loop)
- Font finale per warning text
- Asset UI high-res (bottoni, icons, etc.)
- Descrizioni opere per CMS
</aside>

---

# 🖼️ PAGINA 2: Home/Gallery + Shop

## Composizione Visiva

### Sezione Header & Navigation

```
╔═══════════════════════════════════╗
║  [TEXTURE CARTA FISSA]            ║
║                                   ║
║  👁️  🏠  📅  📧  🛒(3)            ║
║  (Navigazione simbolica)          ║
║  Eye Home Cal Mail Cart           ║
║                                   ║
╚═══════════════════════════════════╝
```

### Gallery Clusters — Vista Principale (Mobile)

```
╔═══════════════════════════════════╗
║                                   ║
║   ┌─────────────────────────┐     ║
║   │   🃏 CARDS               │     ║
║   │   [Preview image grid]  │     ║
║   │   Tap to explore →      │     ║
║   └─────────────────────────┘     ║
║                                   ║
║   ┌─────────────────────────┐     ║
║   │   📚 COMICS              │     ║
║   │   [Preview image grid]  │     ║
║   │   Tap to explore →      │     ║
║   └─────────────────────────┘     ║
║                                   ║
║   ┌─────────────────────────┐     ║
║   │   🎨 ILLUSTRATIONS       │     ║
║   │   [Preview image grid]  │     ║
║   │   Tap to explore →      │     ║
║   └─────────────────────────┘     ║
║                                   ║
║   ┌─────────────────────────┐     ║
║   │   ✨ STICKERS            │     ║
║   │   [Preview image grid]  │     ║
║   │   Tap to explore →      │     ║
║   └─────────────────────────┘     ║
║                                   ║
║   ┌─────────────────────────┐     ║
║   │   👕 MERCHANDISE         │     ║
║   │   [Preview image grid]  │     ║
║   │   Tap to explore →      │     ║
║   └─────────────────────────┘     ║
║                                   ║
╚═══════════════════════════════════╝
```

### Gallery Clusters — Vista Desktop

```
╔═══════════════════════════════════════════════════════╗
║  [TEXTURE CARTA FISSA]                                ║
║                                                       ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐           ║
║  │🃏 CARDS  │  │📚 COMICS │  │🎨 ILLUS. │           ║
║  │[preview] │  │[preview] │  │[preview] │           ║
║  │  grid    │  │  grid    │  │  grid    │           ║
║  └──────────┘  └──────────┘  └──────────┘           ║
║                                                       ║
║  ┌──────────┐  ┌──────────┐                          ║
║  │✨STICKERS│  │👕 MERCH  │                          ║
║  │[preview] │  │[preview] │                          ║
║  │  grid    │  │  grid    │                          ║
║  └──────────┘  └──────────┘                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### Drill-Down: Carousel Cronologico per Anno

```
UTENTE CLICCA SU "CARDS" →

╔═══════════════════════════════════╗
║                                   ║
║  ← BACK TO CLUSTERS               ║
║                                   ║
║  🃏 CARDS                          ║
║                                   ║
║  [2026] [2025] [2024] [2023]      ║
║   (tab navigation)                ║
║                                   ║
║  ┌─────┐ ┌─────┐ ┌─────┐         ║
║  │ 📷  │ │ 📷  │ │ 📷  │         ║
║  │Card │ │Card │ │Card │         ║
║  │  1  │ │  2  │ │  3  │         ║
║  └─────┘ └─────┘ └─────┘         ║
║                                   ║
║  ┌─────┐ ┌─────┐ ┌─────┐         ║
║  │ 📷  │ │ 📷  │ │ 📷  │         ║
║  │Card │ │Card │ │Card │         ║
║  │  4  │ │  5  │ │  6  │         ║
║  └─────┘ └─────┘ └─────┘         ║
║                                   ║
╚═══════════════════════════════════╝
```

## Gerarchia Informativa

### Livello 1: Clusters (Tipo di Lavoro)

- **Obiettivo**: Overview veloce di tutto il portfolio
- **Contenuto**: Preview image grid + titolo cluster
- **Interazione**: Tap/Click per espandere

### Livello 2: Anni (Navigazione Cronologica)

- **Obiettivo**: Mostrare evoluzione artistica per dedicated fans
- **Contenuto**: Tab per anno + grid opere di quell'anno
- **Interazione**: Cambio tab + scroll

### Livello 3: Artwork Detail (CMS Pages)

- **Obiettivo**: Esperienza immersiva per singola opera
- **Contenuto**: Vedi sezione dedicata sotto ⬇️

---

# 🔍 PAGINA CMS: Artwork Detail

## Composizione Visiva Mobile

```
╔═══════════════════════════════════╗
║  [NAV: 👁️ 🏠 📅 📧 🛒(3)]        ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────┐     ║
║  │                         │     ║
║  │    IMMAGINE OPERA       │     ║
║  │    (standard size)      │     ║
║  │                         │     ║
║  └─────────────────────────┘     ║
║                                   ║
║  [HI] Hi-Rez  [BS] Backstory      ║
║  (button)     (button/flip)       ║
║                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
║                                   ║
║  📋 TITOLO OPERA                  ║
║  Anno: 2025                       ║
║  Tipo: Card / Illustration        ║
║                                   ║
║  💬 [BALLOON FUMETTO]             ║
║     Backstory breve preview       ║
║     (o testo completo se BS       ║
║      non è flip/overlay)          ║
║                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
║                                   ║
║  📐 SPECIFICHE TECNICHE           ║
║  • Materiale: Carta 300gsm        ║
║  • Dimensioni: 10x15 cm           ║
║  • Data: 15 Marzo 2025            ║
║  • Status: ✅ Disponibile         ║
║    (o 🔴 Sold Out / ♻️ Ristamp.)  ║
║                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
║                                   ║
║  💶 PREZZO: €25.00                ║
║                                   ║
║  ┌─────────────────────────┐     ║
║  │  🛒 ADD TO CART         │     ║
║  │     (verde)             │     ║
║  └─────────────────────────┘     ║
║                                   ║
║  ← Back to Gallery                ║
║                                   ║
╚═══════════════════════════════════╝
```

## Composizione Visiva Desktop

```
╔═══════════════════════════════════════════════════════╗
║  [NAV: 👁️ 🏠 📅 📧 🛒(3)]                            ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  ┌─────────────────────┐  ┌──────────────────────┐   ║
║  │                     │  │  📋 TITOLO OPERA     │   ║
║  │                     │  │  Anno: 2025          │   ║
║  │   IMMAGINE OPERA    │  │  Tipo: Card          │   ║
║  │   (standard size)   │  │                      │   ║
║  │                     │  │  ━━━━━━━━━━━━━━━━━   │   ║
║  │                     │  │                      │   ║
║  └─────────────────────┘  │  💬 [BALLOON]        │   ║
║                           │  Backstory preview   │   ║
║  [HI] Hi-Rez             │  o testo completo    │   ║
║  [BS] Backstory          │                      │   ║
║                           │  ━━━━━━━━━━━━━━━━━   │   ║
║                           │                      │   ║
║                           │  📐 SPECIFICHE       │   ║
║                           │  • Materiale: ...    │   ║
║                           │  • Dimensioni: ...   │   ║
║                           │  • Data: ...         │   ║
║                           │  • Status: ✅        │   ║
║                           │                      │   ║
║                           │  ━━━━━━━━━━━━━━━━━   │   ║
║                           │                      │   ║
║                           │  💶 €25.00           │   ║
║                           │                      │   ║
║                           │  ┌────────────────┐  │   ║
║                           │  │ 🛒 ADD TO CART │  │   ║
║                           │  └────────────────┘  │   ║
║                           └──────────────────────┘   ║
║                                                       ║
║  ← Back to Gallery                                    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

## Feature Speciali

### [HI] Hi-Rez Button

**Funzione**: Accesso controllato a immagini 2000px alta risoluzione

**Comportamento**: 

- Click → apre istanza separata (nuova finestra/tab)
- Immagine full-res caricata on-demand (ottimizzazione performance)
- User può zoomare liberamente

### [BS] Backstory

**Funzione**: Lore e contesto dell'opera

**Opzioni di Design**:

1. **Card flip**: Click BS → immagine flipa, retro mostra testo
2. **Overlay**: Click BS → overlay trasparente con testo sopra immagine
3. **Sezione dedicata**: Backstory sempre visibile sotto immagine

*Scelta finale da validare in Figma lo-fi*

### [CA] Cart/CTA

**Funzione**: Add to cart + indicatore items nel carrello

**Colore**: Verde (azione positiva)

**Feedback**: Animazione conferma + aggiornamento numero cart nella nav

<aside>
💡

**NOTA TECNICA**: Artwork detail pages generate from JSON data. All fields (title, year, type, material, dimensions, price, status, images) stored in structured JSON for easy maintenance.

</aside>

---

# 📅 PAGINA 3: Calendar + Linktree

## Composizione Visiva Mobile

```
╔═══════════════════════════════════╗
║  [NAV: 👁️ 🏠 📅 📧 🛒(3)]        ║
╠═══════════════════════════════════╣
║                                   ║
║  📅 2026 CALENDAR                 ║
║                                   ║
║  [Scroll orizzontale →]           ║
║                                   ║
║  JAN  FEB  MAR  APR  MAY  JUN ... ║
║   ○    ○    ●    ○    ●    ○     ║
║        ↓    ↓         ↓           ║
║       15   8,22      12           ║
║                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║
║                                   ║
║  🔗 LINKTREE                      ║
║                                   ║
║  ┌─────────────────────────┐     ║
║  │  📷 Instagram           │     ║
║  └─────────────────────────┘     ║
║                                   ║
║  ┌─────────────────────────┐     ║
║  │  🎨 Behance             │     ║
║  └─────────────────────────┘     ║
║                                   ║
║  ┌─────────────────────────┐     ║
║  │  🐦 Twitter/X           │     ║
║  └─────────────────────────┘     ║
║                                   ║
║  ┌─────────────────────────┐     ║
║  │  🎭 Patreon             │     ║
║  └─────────────────────────┘     ║
║                                   ║
║  ┌─────────────────────────┐     ║
║  │  📧 Newsletter          │     ║
║  └─────────────────────────┘     ║
║                                   ║
╚═══════════════════════════════════╝
```

## Composizione Visiva Desktop

```
╔═══════════════════════════════════════════════════════╗
║  [NAV: 👁️ 🏠 📅 📧 🛒(3)]                            ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  📅 2026 CALENDAR                                     ║
║                                                       ║
║  JAN   FEB   MAR   APR   MAY   JUN   JUL   AUG ...   ║
║  ━━━   ━━━   ━━━   ━━━   ━━━   ━━━   ━━━   ━━━      ║
║   │     │     │     │     │     │     │     │        ║
║   │     │    15     │    12     │     │    22        ║
║   │     │    ●○     │    ○●     │     │    ●○        ║
║   │     │  [evt]    │  [evt]    │     │  [evt]       ║
║   │     │   08      │           │     │              ║
║   │     │   ●○      │           │     │              ║
║   │     │ [evt]     │           │     │              ║
║                                                       ║
║  (Elementi circolari ○● solo nei giorni con eventi)  ║
║                                                       ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║                                                       ║
║  🔗 LINKTREE                                          ║
║                                                       ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐             ║
║  │📷 Insta  │ │🎨 Behance│ │🐦 Twitter│             ║
║  └──────────┘ └──────────┘ └──────────┘             ║
║                                                       ║
║  ┌──────────┐ ┌──────────┐                           ║
║  │🎭 Patreon│ │📧 News   │                           ║
║  └──────────┘ └──────────┘                           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

## Struttura Calendar

### Layout System

- **12 colonne**: Una per mese (JAN → DEC)
- **Eventi**: Elementi circolari inseriti SOLO nei giorni con eventi
- **No ridondanza**: Evitare uso cerchi/quadrati nel resto del sito (già usati qui)
- **Riferimento design**: Stile Linktree (elementi circolari puliti)

### Interazioni

- **Hover/Tap su evento**: Mostra preview info (titolo, luogo, orario)
- **Click su evento**: Apre dettaglio completo (modal o expand)
- **Scroll**: Orizzontale su mobile, verticale o grid su desktop

### Linktree

- **Posizionamento**: Sotto calendar, stessa pagina
- **Link esterni**: Instagram, Behance, Twitter/X, Patreon, Newsletter
- **Stile**: Bottoni puliti con emoji + label
- **Colore hover**: Verde (coerenza con resto del sito)

---

# 🎨 Design System — Applicazione su Tutte le Pagine

## Visual Identity

| Elemento | Specifica | Applicazione |
| --- | --- | --- |
| **Texture Background** | Carta stropicciata | Hero: GIF loop animato
Altre pagine: Fissa |
| **Palette Colori** | B&N + accenti colore | Verde: azioni positive
Rosso/Bordeaux: azioni negative |
| **Typography** | Font Gothic-style | Da finalizzare entro 02/02 |
| **Bordi** | Bordo bianco attorno elementi | Separa contenuto da background |
| **Interfaccia** | Estremamente pulita | Bilancia complessità background |
| **Elementi Fumetto** | Balloon per testi | Callout, tooltip, backstory |

## Pattern Ricorrenti

### Navigazione

**Simboli sempre presenti** (top nav):

- 👁️ Eye: Torna a hero / menu principale
- 🏠 Home: Gallery
- 📅 Calendar: Pagina calendar
- 📧 Mail: Contact form
- 🛒(n) Cart: Carrello con numero items

### Bottoni & CTA

- **Verde**: Azioni positive (Add to cart, Conferma, Submit)
- **Rosso/Bordeaux**: Azioni negative (Esci, Cancella, Close)
- **Bianco/Nero**: Azioni neutre (Back, Naviga, Esplora)

### Animazioni

- **Eye tracking**: Hero section (segue cursore/tap)
- **Explosion**: Transizione hero → gallery
- **Slide/Float**: Navigazione tra clusters
- **Flip/Overlay**: Backstory reveal
- **Zoom**: Accesso hi-res
- **Carta strappata**: Form submit success

---

# 📐 Technical Implementation Specs

## Page Structure

### Static Pages

1. **Home/Gallery** (`index.html`)
2. **Calendar** (`/calendar`)

### Dynamic Pages (JSON-based)

**Artwork Details** (`/artwork/[slug]`)

**JSON data fields:**

- Title (text)
- Slug (auto-generated)
- Main Image (image)
- Hi-Res Image (image, 2000px)
- Backstory (rich text)
- Year (number)
- Type (select: Cards, Comics, Illustrations, Stickers, Merchandise)
- Material (text)
- Dimensions (text)
- Creation Date (date)
- Status (select: Available, Sold Out, Reprint Available)
- Price (number)
- Featured (boolean, for homepage preview)

## Componenti Riutilizzabili

### Components da Creare in Figma

- Nav bar (simbolica)
- Cluster card (preview)
- Artwork card (grid item)
- Artwork detail layout
- Calendar month column
- Calendar event circle
- Linktree button
- Balloon fumetto (callout)
- CTA button (3 varianti colore)
- Form (contact/purchase)

## Ottimizzazione Asset

| Tipo Asset | Dimensione Consigliata | Formato | Note |
| --- | --- | --- | --- |
| **Hero texture** | 1920x1080 | GIF/MP4 | Loop 3-4 frame, <2MB |
| **Occhio 3D** | Frames multipli | PNG seq | Trasparenza, <500KB tot |
| **Preview images** | 800x800 | WebP/JPG | Qualità 80%, lazy load |
| **Artwork standard** | 1200x1200 | WebP/JPG | Qualità 85% |
| **Hi-res images** | 2000x2000 | JPG | Qualità 90%, caricamento on-demand |
| **Icons/emoji** | SVG quando possibile | SVG | Scalabilità perfetta |

---

# ✅ Checklist Wireframe Paper → Figma Lo-Fi

<aside>
📋

**STATUS FIGMA LO-FI (Week 4 - completato):**

- [x]  Questo documento validato da Neo
- [x]  Palette colori definitiva ricevuta (acid green)
- [ ]  Font Gothic-style confermato
- [ ]  Asset occhio 3D ricevuto (o placeholder definito)

**ORA IN CORSO (Week 5 - Hi-Fi):**

- [ ]  Hi-fi mockups in Figma con visual design completo
- [ ]  Component library finalizzata
- [ ]  Design tokens esportati per CSS
</aside>

## Da Disegnare su Paper Wireframe

### Hero Section

- [ ]  Layout mobile (occhio + logo + warning + CTA)
- [ ]  Layout desktop (stessa struttura, proporzioni diverse)
- [ ]  Posizionamento elementi (gerarchia visiva)
- [ ]  Note per animazione eye tracking

### Gallery Home

- [ ]  Nav bar con simboli
- [ ]  Layout cluster preview (mobile: stack, desktop: grid)
- [ ]  Singolo cluster card (struttura)
- [ ]  Drill-down: carousel per anno
- [ ]  Grid artwork dentro anno

### Artwork Detail

- [ ]  Layout mobile (immagine sopra, info sotto)
- [ ]  Layout desktop (immagine sinistra, info destra)
- [ ]  Posizionamento bottoni [HI] [BS] [CA]
- [ ]  Sezione specifiche tecniche
- [ ]  Balloon fumetto per backstory

### Calendar

- [ ]  Struttura 12 colonne
- [ ]  Elementi circolari su giorni con eventi
- [ ]  Layout mobile (scroll orizzontale)
- [ ]  Layout desktop (visione completa)
- [ ]  Linktree sotto calendar

## Passaggio a Figma Lo-Fi

### Setup Figma

1. **Frame sizes**: 
    - Mobile: 375x812 (iPhone 13)
    - Desktop: 1440x900 (standard laptop)
2. **Componenti**: Creare library riutilizzabile
3. **Colori**: Setup palette finale
4. **Font**: Importare Gothic-style font
5. **Griglia**: 8pt grid system

### Lo-Fi Features

- **Wireframe style**: Grigio + accenti colore palette
- **Placeholder**: FPO per immagini (con label tipo/dimensione)
- **Annotazioni**: Note per interazioni e animazioni
- **Flow**: Collegamenti tra frame (user flow completo)
- **States**: Hover, active, error per componenti interattivi

### Deliverable Lo-Fi

- [ ]  4 frame mobile (Hero, Gallery, Detail, Calendar)
- [ ]  4 frame desktop (stesse pagine)
- [ ]  Componenti library documentata
- [ ]  User flow annotato (da Hero a Checkout)
- [ ]  Specifiche interazioni (per ogni CTA e link)

---

# 🎯 Riepilogo Decisionale

<aside>
✅

**ARCHITETTURA VALIDATA:**

**Pagine**:

1. Hero Section (gateway)
2. Home/Gallery + Shop
3. Artwork Detail (CMS)
4. Calendar + Linktree

**User Flow Primario**:

Hero → (explosion) → Gallery → Cluster → Anno → Artwork Detail → Cart

**Design System**:

- Giornalino anni '90, texture carta, balloon fumetto
- B&N + verde (positivo) / rosso (negativo)
- Navigazione simbolica (emoji), interfaccia pulita
- Mobile-first, ottimizzazione performance

**Features Chiave**:

- Eye tracking (hero)
- Hi-Rez access (artwork detail)
- Backstory immersivo
- Cluster + navigazione cronologica
- Calendar con eventi circolari
</aside>

<aside>
⚠️

**ASSET CRITICI DA NEO (Week 5 - entro Feb 8):**

1. ~~Palette colori definitiva~~ ✅ (acid green confermato)
2. Font Gothic-style finale ⏳
3. Occhio 3D (modello o render multipli) ⏳
4. Texture carta (3-4 scansioni) ⏳
5. Descrizioni opere per CMS ⏳
6. Immagini high-res ottimizzate ⏳

Senza questi asset, rallentamento su hi-fi mockups e prototype interattivo Week 6.

</aside>

---

## Next Action

**Week 4 (completata)**:

1. ✅ Documento composizione definitiva creato
2. ✅ Paper wireframes finali disegnati
3. ✅ Validazione con Neo
4. ✅ Lo-fi digitali completati in Figma

**Week 5 (Feb 2-8, 2026 - IN CORSO)**:

1. ⏳ Hi-fi mockups in Figma (tutte le schermate/device)
2. ⏳ Component library finalizzata
3. ⏳ Design tokens esportati per CSS
4. ⏳ Ricevere asset definitivi da Neo

**Week 6 (Feb 9-15, 2026 - PROSSIMA)**:

1. Build interactive prototype in Figma
2. Usability testing (venerdì)
3. Iterazione basata su feedback

<aside>
💪

**Leo, sei pronto.** Hai tutte le decisioni validate, la struttura è solida, l'architettura è chiara. Ora **disegna l'ultimo paper wireframe** seguendo questa composizione, poi ti butti su Figma con sicurezza. Questo è il tuo portfolio cornerstone — ogni pixel conta. Vai! 🚀

</aside>