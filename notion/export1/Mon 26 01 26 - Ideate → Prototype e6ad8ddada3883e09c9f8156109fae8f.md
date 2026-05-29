# Mon 26/01/26 - Ideate → Prototype

Owner: leo

# Contesto

**Data**: January 26, 2026

**Partecipanti**: Leo, Neo-one, Tizio Coso (guest)

**Fase progetto**: Week 3 — Finalizzazione wireframe low-fidelity + decisioni macro design

---

## Hero Section: Decisioni Finali

### Concept Approvato

- **Elemento centrale**: Occhio grafico interattivo che segue il movimento del cursore (desktop) o tap (mobile)
- **Posizionamento**: Occhio sopra logo Neo One (NON integrato nella "O")
- **Warning**: Parental advisory per contenuti maturi (nude images, violence)
- **Interazione**: Al click → animazione esplosione → transizione verso gallery/home
- **Navigazione**: Simboli/emoji invece di testo per prioritizzare gerarchia visiva

### Opzioni Esplorate (archiviate)

- Concept TV screen con canali
- Occhio standalone
- Room setup 3D con oggetti (desk, post-it, scheletro animato, posters)
- Spirale concentrica con eye (scartata per possibile fastidio UX)

---

## Gallery & Shop Structure

### Organizzazione Contenuti

**Gerarchia primaria**: Cluster per tipo (cards, comics, illustrations, stickers, merchandise)

**Gerarchia secondaria**: Anno all'interno di ogni cluster (evoluzione cronologica)

**User Flow**:

1. Landing su gallery → preview cluster (floating o grid)
2. Click su cluster → carousel cronologico per anno
3. Click su singola opera → dettaglio completo

### Dettaglio Opera

Ogni artwork detail include:

- **HI** (Hi-Rez): Bottone specifico per accedere a immagini 2000px high-res in istanza separata
- **BS** (Backstory): Lore e storia dell'opera (può essere flip della card o overlay)
- **CA** (Call to Action / Cart): Add to cart + numero items nel carrello
- Specifiche tecniche (materiale, dimensioni, data creazione)
- Status disponibilità (print ristampabile / oggetto unico / disponibile / sold out)

### Design Pattern

- Preview cluster con descrizioni brevi (incitare esplorazione)
- Navigazione con simboli per mantenere focus visivo
- Doppio accesso: casual viewers (per tipo) + dedicated fans (cronologia evolutiva)

---

## Calendar Layout

### Struttura Approvata

- **12 colonne** (una per mese)
- Elementi inseriti **solo nei giorni con eventi**
- Design strutturato con **elementi circolari** (riferimento linktree)
- Evitare ridondanza cerchi/quadrati nel resto del sito

### Features Rimosse

- **Favoriti**: Rimossi per evitare responsabilità hosting e complicazioni con user registration

---

## Design System

### Visual Identity

**Estetica generale**: Giornalino interattivo anni '90

- Texture di carta
- Balloon stile fumetto per testi
- Immagini fisse + elementi in movimento
- Riferimenti al linguaggio comic book di Neo

**Background**:

- **Hero section**: Texture carta stropicciata in movimento (loop GIF 3-4 scansioni)
- **Altre pagine**: Texture fissa
- Materiali B&N ad alto contrasto (wall-like, tessile, sheets)

### Palette Colori

**Base**: Bianco e nero con accenti di colore

**Funzione semantica**:

- **Verde**: Azioni positive (conferme, progressi)
- **Rosso/Bordeaux**: Azioni negative (esci dalla pagina, alert)
- Verde e viola opposti sulla ruota cromatica → contrasto efficace

**Due opzioni in valutazione**:

1. Acid green palette (saturazione alta)
2. Colori desaturati di Nio (contrasto più morbido)

⚠️ **Concern**: Contrasto verde/rosa-bordeaux su sfondo bianco non nitido (colori desaturati)

### Typography

- Font **Gothic-style** in considerazione
- Finalizzazione **entro lunedì prossimo** (02/02/26)

### Layout & Spacing

- **Bordo bianco** necessario per separare elementi da background nero/bianco
- Interface **estremamente pulita** per bilanciare dettaglio dei background
- Mobile-first approach (ricerca utente conferma uso primario da smartphone)

---

## Animazioni & Interazioni

### Micro-interactions

- **Eye tracking**: Segue cursore/tap in hero section
- **Explosion transition**: Hero → Gallery
- **Form submit**: Interazione con occhio o effetto "strappare carta e lanciarla fuori schermo"
- **Cluster navigation**: Slide/float tra tipologie e anni
- **Detail zoom**: Accesso controllato a hi-res (click esplicito su bottone HI)

### Idee Sperimentali

- Importo acquisto come pitch per ritmo applauso
- Messaggio audio semplice all'invio form
- Elementi floating per clusters
- Glitch effect per transizioni

---

## Site Structure & Navigation

### MVP Scope

**2 pagine principali**:

1. **Home/Gallery** (+ Shop integrato)
2. **Calendar** (+ Linktree)

**Funzioni trasversali**:

- Contact form (email, purchase, commissions)
- Navigation: Eye come browser tra pagine (in alcune versioni) o N/simboli
- Call-to-action floating/sticky

### Entry Points

Multipli punti di accesso possibili:

- Hero section (principale)
- Direct URL a calendar
- Direct URL a artwork detail pages
- External links (linktree)

### Post-MVP

- **Bio section** con manifesto (priority immediata dopo MVP)
- Feature espanse per commissioni
- Eventuali integrazioni esterne

---

## Design Rationale & Research Validation

### User Research Insights

**Da interviste e personas (Marco, Sabrina, Elena)**:

- ✅ Uso primario da **mobile** → Mobile-first approach confermato
- ✅ Utenti vogliono **dettaglio estremo** → Feature HI (Hi-Rez) con 2000px images
- ✅ Fans interessati a **evoluzione cronologica** → Navigazione per anno dentro cluster
- ✅ Differenziazione da **altre piattaforme** → Backstory + dettagli tecnici + zoom
- ✅ Priorità P2: Vedere opere per anno → Implementato come navigazione secondaria

### Decisioni Strategiche

**Rimozione feature Favoriti**:

- Evita responsabilità hosting
- Elimina complessità user registration
- Focus su MVP essenziale

**Cluster-based organization**:

- Risponde a user need: preview veloce di tutto il portfolio
- Mantiene coerenza tematica (tipo di lavoro)
- Permette drill-down cronologico per dedicated fans

**Eye come elemento centrale**:

- Riferimento identità visiva Neo
- Elemento interattivo immediato (engagement)
- Navigator tra sezioni (in alcune versioni)
- Versatile per animazioni e transitions

### Technical Implementation

- Hand-coded HTML/CSS/JS with Antigravity assistance
- JSON-based CMS for artwork details
- Full control over animations and interactions
- Asset optimization crucial (balance hi-res zoom and performance)

---

## Note Operative

### Workflow Stabilito

- Riunioni registrate su Notion (meeting notes con AI summary)
- Condivisione asset via Notion (piano Business per file grandi)
- Wireframe paper → Figma lo-fi / hi-fi → Webflow development

### Materiali Forniti da Neo (già ricevuti)

- Asset B&N con palette acid green/pink
- Background texture (materiali wall-like, tessile, sheets)
- Alto contrasto B&N per supportare interfaccia pulita

---

## Prossimi Step Immediati

**Week 4 (Jan 26 - Feb 1) - COMPLETATO ✅**:

1. ✅ Neo ha validato wireframes presentati
2. ✅ Neo ha confermato palette colori (acid green)
3. ✅ Leo ha completato lo-fi wireframes in Figma

**Week 5 (Feb 2-8) - IN CORSO**:

1. ⏳ Leo: Hi-fi mockups in Figma (tutte schermate/device)
2. ⏳ Leo: Component library finalizzata
3. ⏳ Neo: Font Gothic-style finale
4. ⏳ Neo: Asset 3D occhio per hero
5. ⏳ Neo: Descrizioni opere + immagini high-res

**Week 6 (Feb 9-15) - PROSSIMA**:

1. Build interactive prototype in Figma
2. Usability testing (venerdì)

---

<aside>
⏳

**STATUS ASSET (Week 5 - aggiornato 04/02)**

- **Palette**: ✅ Confermata (acid green)
- **Lo-fi wireframes**: ✅ Completati in Figma
- **Font Gothic-style**: ⏳ In attesa da Neo (needed per hi-fi)
- **Asset occhio 3D**: ⏳ In attesa da Neo (needed per hi-fi)
- **Descrizioni opere**: ⏳ In attesa da Neo (needed per Week 6)

Questi asset sono necessari per completare hi-fi mockups e procedere con interactive prototype Week 6.

</aside>

<aside>
✅

**DECISIONI VALIDATE**

- Hero: Eye interattivo con parental advisory + explosion animation
- Gallery: Cluster-based con drill-down cronologico
- Calendar: 12 colonne, elementi solo su giorni con eventi
- Visual: Giornalino anni '90, texture carta, balloon fumetto
- Approccio: Mobile-first, interfaccia pulita, simboli > testo
</aside>

[recs](recs%20200d8ddada38831d94a5019e93d585cb.md)

[🎯 Composizione Definitiva — Wireframe Structure](%F0%9F%8E%AF%20Composizione%20Definitiva%20%E2%80%94%20Wireframe%20Structure%20669d8ddada388302ad7801fc8487512c.md)