# Neo-One Art Hub — MASTER SPEC (Roadmap & Management)

> **DIRETTIVA PER L'AGENTE:** Questo è l'unico file di riferimento per lo stato del progetto e i prossimi step. Leggi questo prima di iniziare.

---

## 1. Stato del Progetto e Roadmap MVP

| # | Step | Stato | Note |
|---|---|---|---|
| 1-11 | Setup Infra + Home Base | ✅ DONE | Neon, Cloudinary, Hero, Carousel 3D completati. |
| 12 | Home: Expanded Cluster | ✅ DONE | Logica di espansione e mazzi 3D funzionante. |
| 13 | Artwork Detail `/artwork/[nid]` | 🔴 PROSSIMO | Fetch reale + Player Audio. |
| 14 | Calendar Overview `/calendar` | ⬜ | Lista segnali ordinata. |
| 15 | Event Detail `/calendar/[slug]` | ⬜ | Layout 2-slot Punk. |
| 16 | Cart/Form Overlay Globale | ⬜ | Context e UI di acquisto/info. |
| 17-21 | Deploy & Finalize | ⬜ | Vercel e dominio Neo. |

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

### Snippet Salvavita Immagini (Cloudinary Fix)
```typescript
let imageUrl = '/images/drops/placeholder.png';
if (doc.mainImage && typeof doc.mainImage === 'object') {
  const media = doc.mainImage;
  if (media.thumbnailURL) {
    imageUrl = media.thumbnailURL.replace(/\/upload\/[^\/]+\//, '/upload/f_auto,q_auto/');
  }
}
```

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
- **Colori:** Pink `#F45390`, Soft-pink `#B3828B`.
- **Stack:** Next.js 15, Payload v3, Neon Postgres, Cloudinary.

---
*Ultimo aggiornamento: 10 Aprile 2026 - Pulizia Trash Completata*
