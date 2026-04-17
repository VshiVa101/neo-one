# Neo-One Art Hub — MASTER SPEC (Roadmap & Management)

**Release:** v1.1.0

> **DIRETTIVA PER L'AGENTE:** Questo è l'unico file di riferimento per lo stato del progetto e i prossimi step. Leggi questo prima di iniziare.

---

## 1. Stato del Progetto e Roadmap MVP

| # | Step | Stato | Note |
|---|---|---|---|
| 1-11 | Setup Infra + Home Base | ✅ DONE | Neon, Cloudinary, Hero, Carousel 3D completati. |
| 12 | Home: Interactive Gateway | ✅ DONE | Implementato gateway cinematico Matrix ("NEO-ONE" -> "O-N") con silent priming. |
| 12.5 | Home: Expanded Cluster | ✅ DONE | Navigazione cluster, auto-expand sottocluster singolo, smart-exit, eye z-500. |
| 13 | Artwork Detail `/artwork/[nid]` | ✅ DONE | Layout wireframe, nav prev/next, CartContext, asset UI reali. |
| 13.5 | Responsive & Zoom Modal | 🟡 IN CORSO | Adattamento mobile globale e visualizzazione Opera a schermo intero con Zoom. |
| 14 | Calendar Overview `/calendar` | 🔴 PROSSIMO | Lista segnali ordinata. |
| 15 | Event Detail `/calendar/[slug]` | ⬜ | Layout 2-slot Punk. |
| 16 | Cart/Form Overlay Globale | ⬜ | Context e UI di acquisto/info. |
| 17 | Deploy Vercel | ✅ DONE | Repo su GitHub, deploy automatico Vercel, env vars configurate. |
| 18 | Neo Account & Access | ✅ DONE | Account Payload creato per Neo. Credenziali pronte. |
| 19-21 | Domain Custom & Polish | ⬜ | Dominio Neo (quando disponibile), finalize. |

---

## 2. Direttive Tecniche Obbligatorie (Blueprint)

### Fetching dei Dati
Usa SOLO la Local API di Payload nei Server Components:
```typescript
import { getPayload } from 'payload';
import config from '@payload-config';
const payload = await getPayload({ config });
const data = await payload.find({ collection: 'nome', depth: 2 });
```

### Sneppet Salvavita Immagini (Cloudinary Fix)
```typescript
let imageUrl = '/images/drops/placeholder.png';
if (doc.mainImage && typeof doc.mainImage === 'object') {
  const media = doc.mainImage;
  if (media.thumbnailURL) {
    imageUrl = media.thumbnailURL.replace(/\/upload\/[^\/]+\//, '/upload/f_auto,q_auto/');
  }
}
```

### Regole Ottimizzazione Asset (WebP)
Tutte le immagini devono essere preventivamente convertite in WebP (Qualità 85):
- **SFONDI:** `1920x1080`
- **OPERE:** `1920px` lato lungo
- **CLUSTER / SIGNALS:** `1200px` lato lungo
- **ICONE:** `256px` o `512px` (mantenere Alpha/Trasparenza)
*Regola per l'Occhio 3D:* Il `nervo_nervoso` (Retina) è applicato tramite un `Decal` frontale (Scale 1.7) con `THREE.MultiplyBlending` per rendere invisibile il suo sfondo bianco senza stirare la mappa UV ai lati. La pupilla è un livello `Decal` sovrapposto.

### Autoplay Audio Policy (Interaction Gateway)
Per sbloccare l'audio nei browser moderni senza rovinare l'estetica:
1. Usa un **Interaction Gateway** (Overlay "ON").
2. **Silent Priming**: Al click, esegui un `new Audio("data:audio/wav;base64,...")` muto per attivare il contesto senza suoni udibili.
3. **Pointer Events**: Il layer Hero deve avere `pointer-events: auto` in `page.tsx`.
4. **Logic Lock**: Disabilita `onClick` sui componenti 3D finché `isUnlocked` non è true per evitare navigazioni accidentali.

---

## 3. Manuale Operativo Step Immediati

### Step 13: Artwork Detail (`/artwork/[nid]`)
- **Route:** `src/app/(frontend)/artwork/[nid]/page.tsx`.
- **Logic:** Fetch `artworks` dove `nid` (o slug) == params.nid.
- **UI:**
  - Foto principale (Cloudinary snippet).
  - Metadati (supporto, data, dimensioni).
  - **Player Audio:** Se `audioSnippetUrl` è presente, mostra player HTML5 `<audio>`.
  - Link audio completo (Spotify/Bandcamp).

### Step 14: Calendar (`/calendar`)
- **Route:** `src/app/(frontend)/calendar/page.tsx`.
- **Logic:** Fetch `signals` ordinati per `sortOrder`.
- **UI:** Griglia o lista con miniature lo-fi.

---

## 4. Identità e Decisioni Strategiche
- **No standard ecommerce:** L'acquisto è una richiesta via form (Inquiry).
- **Eye Motif:** L'occhio è l'ancora di navigazione, mai rimuoverlo.
- **Colori:** Pink `#F45390`, Soft-pink `#B3828B`, Green `#809829`.
- **Stack:** Next.js 15, Payload v3, Neon Postgres, Cloudinary.

---
*Ultimo aggiornamento: 15 Aprile 2026 - Release v1.1.0 — aggiornati onboarding e documentazione. Prossimo passo: completare la responsività mobile (Step 13.5).*
