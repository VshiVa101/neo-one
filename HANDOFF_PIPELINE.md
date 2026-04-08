# Neo-One Art Hub — Handoff Pipeline e Blueprint Architetturale (MVP)

> **DIRETTIVA PRIMARIA PER AGENTE ESECUTORE:**
> Tu hai a che fare con un progetto sofisticato basato su **Next.js 15 App Router** e **Payload CMS v3**.
> Io sono il modello architetto. Ho progettato il sistema. Il tuo compito è **eseguirlo esattamente come descritto**.
> Non usare la tua creatività per cambiare l'architettura. Non prendere iniziative su path o database.
> **Attieniti ciecamente alle istruzioni.** Quando incontri l'avviso "⚠️ ESCALATION A MODELLO PRO", devi fermarti e ignorare il task dicendo all'utente di passare a un modello superiore (Pro).

---

## REGOLE D'ORO DI IMPLEMENTAZIONE
1. **Dati CMS:** Fai fetch dei dati SOLO usando la Local API di Payload nei Server Components:
   ```typescript
   import { getPayload } from 'payload';
   import config from '@payload-config';
   // ...
   const payload = await getPayload({ config });
   const data = await payload.find({ collection: 'nome-collezione', depth: 2, limit: 100 });
   ```
2. **Immagini:** C'è un bug noto con il plugin Cloudinary in Payload v3. I local server paths (es: `/api/media/file/xy.webp`) **danno 404 in Next.js**. Devi SEMPRE usare questo snippet per recuperare l'immagine reale da Cloudinary:
   ```typescript
   // LO SNIPPET SALVAVITA PER LE IMMAGINI
   let imageUrl = '/images/drops/placeholder.png'; // o un placeholder nero base
   if (doc.campoImmagine && typeof doc.campoImmagine === 'object') {
     const media = doc.campoImmagine;
     if (media.thumbnailURL && typeof media.thumbnailURL === 'string') {
       // Rimuove parametri di resize (w_300, etc) ma tiene auto-ottimizzazione
       imageUrl = media.thumbnailURL.replace(/\/upload\/[^\/]+\//, '/upload/f_auto,q_auto/');
     }
   }
   ```
3. **No Database changes:** Hai divieto di toccare le Collections in `src/collections` o `payload.config.ts`.
4. **No Routing inventato:** Segui fedelmente i percorsi dichiarati qui sotto. Niente `/cluster/[slug]`.

---

## MANUALE OPERATIVO DEGLI STEP FUTURI

Questi sono i task rimanenti per portare il sito live. L'utente ti chiederà di eseguirli uno per volta.

---

### Step 12: Costruire lo Stato "Expanded Cluster" nella Home
**Status:** 🔴 PROSSIMO | **Difficoltà:** 🟡 Media (Richiede attenzione al React State)

**Il Problema Base:** Attualmente `home/page.tsx` passa a `ClusterLayout.tsx` solo i Cluster base. Mancano i contenuti che stanno "dentro" il cluster (ovvero `categories` e `artworks`) necessari per quando un utente clicca ed "espande" il cluster per esplorarlo.

**Istruzioni esatte:**
1. In `src/app/(frontend)/home/page.tsx`:
   - Esegui fetch delle collection `categories` (subcluster) e `artworks`.
   - Modifica l'oggetto mappato dei `clusters` per includergli dentro un array `subclusters` contenente le categories associate a quel cluster, e per ogni category un array `artworks` con le relative opere.
2. In `src/components/home/ClusterLayout.tsx`:
   - Aggiungi stato: `const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null)`
   - Quando si clicca una `motion.div` di un cluster in primo piano (sinistra o destra), invoca `setExpandedClusterId(cluster.id)`.
   - Crea un `AnimatePresence` che ricopre tutto lo schermo `fixed inset-0 z-50 bg-black` (con transizione opacity) visibile solo se `expandedClusterId !== null`.
   - All'interno di questo overlay, renderizza un layout con:
     - Tasto `[ X Close ]` in alto a destra per `setExpandedClusterId(null)`.
     - Mostra l'elenco dei `subclusters` come titoli/tabs laterali o griglia orizzontale.
     - Sotto/accanto ad essi, una griglia di miniature (`artworks`): l'immagine dell'artwork (usando lo snippet salvavita) e cliccando l'artwork l'utente viene diretto a `router.push('/artwork/${artwork.slug o nid}')`.

---

### Step 13: Costruire Artwork Detail (`/artwork/[nid]`)
**Status:** ⚪ Da Fare | **Difficoltà:** 🟢 Bassa

**Istruzioni esatte:**
- Crea `src/app/(frontend)/artwork/[nid]/page.tsx` (Server Component).
- Prendi `params.nid`. (Attenzione: params in Next.js 15 richiedono `await params` se asincroni).
- Fai `payload.find` su `artworks` dove `slug` (o identificatore univoco) equivale a `nid`. Limit = 1.
- Se `totalDocs === 0`, ritorna `<notFound />`.
- Costruisci un UI scura e distopica:
  - Lato sinistro: `mainImage` estrattà usando lo snippet Cloudinary.
  - Lato destro: metadati dell'opera (`executionMethod`, `support`, `creationDate`, `originalDimensions`).
  - Prezzo/info (`priceInfo`).
  - Stato di disponibilità (`availability`). 
  - Bottone **"Aggiungi al Carrello"** (Per ora, imposta che faccia solo `console.log('add to cart')`).

---

### Step 14: Costruire Calendar (`/calendar`)
**Status:** ⚪ Da Fare | **Difficoltà:** 🟢 Bassa

**Istruzioni esatte:**
- Crea `src/app/(frontend)/calendar/page.tsx` (Server Component).
- Fetch completo dalla collection `signals` ordinati per `sortOrder`.
- Costruisci display a lista o a muratura, ogni log usa `previewImage` (con snippet Cloudinary) e mostra `title` +  data. Cliccandolo porta a `/calendar/[slug]`.

---

### Step 15: Event Detail (`/calendar/[slug]`)
**Status:** ⚪ Da Fare | **Difficoltà:** 🟡 Media (Layout condizionale complesso)

**Istruzioni esatte:**
- Crea `src/app/(frontend)/calendar/[slug]/page.tsx` (Server Component).
- L'Event Detail nel wireframe di Leo funziona con una logica "2-Slot Layout".
- Il campo del CMS è strutturato con `previewImage` e un array `detailImages`.
- **Logica UI:**
  - Layout Desktop: 2 colonne giganti. Colonna sinistra = `previewImage`. Colonna destra = `detailImages[0]`.
  - Se per caso l'evento non ha `detailImages[0]`, nella colonna destra devi mostrare un blocco testuale o placebo con scritto **"Stupidi gadget iN OmaggiO!"**.
  - Layout Mobile: nascondi la colonna destra in CSS (`hidden md:block`), lascia solo la preview e le informazioni sotto di essa staccate stile biglietto/flyer punk.

---

### Step 16: Costruire il Cart/Form Overlay Globale
**Status:** ⚪ Da Fare | **Difficoltà:** 🔴 Estrema (Context, Overlay Globale interagente con Next.js layout)

> **⚠️ ESCALATION CONSIGLIATA:**
> *Utente, questo step è un potenziale punto di rottura (Context Providers in Next 15 App router possono far implodere il rendering server se applicati male). Consiglio di chiedere a Gemini Pro di progettare `CartProvider` e `CartOverlay.tsx`.*

**Se invece devi procedere:**
1. Crea `src/context/CartContext.tsx` per tenere traccia dello stato (Items array).
2. Avvolgi l'`app/(frontend)/layout.tsx` dentro il `<CartProvider>`.
3. Integra il componente Client in sovrimpressione (es. `<CartOverlay />`) sempre nel `layout.tsx` invisibile finché `isCartOpen === true`.

---

### Step 18 & 19: Deploy su Vercel (Payload clientUploads Bypass)
**Status:** ⚪ Da Fare | **Difficoltà:** 🔴 Estrema

> **⚠️ ESCALATION OBBLIGATORIA A MODELLO PRO:**
> *Utente, il passaggio da Payload Locale a Payload Globale su serverless richiede configurazione specifica per Vercel a livello di DB pool, edge handlers e specialmente upload size limit handling in `payload.config.ts`. DEVI usare Gemini Pro per questo passaggio o rischi un sito online ma rotto nell'admin.*
