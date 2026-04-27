# Neo-One Art Hub — MASTER SPEC (Roadmap & Management)

**Release:** v1.1.2

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
| 13.6 | Eye 3D Tracking & Vital Animations | ✅ DONE | Tracking mouse/touch ripristinato; animazioni vitali mantenute con architettura a gruppi separati. |
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
*Regola per l'Occhio 3D:* L'occhio è un elemento identitario critico e non va semplificato rimuovendo vita/animazioni. L'architettura corretta separa:
- **Tracking / Look-at** sul gruppo esterno: segue sempre il cursore su desktop; su mobile punta al `touchstart` / `touchmove`, resta fissato per circa 1 secondo dopo `touchend`, poi torna all'idle.
- **Animazioni vitali** sul gruppo interno: capovolgimento lento periodico, rotazione veloce sull'asse della pupilla e vibrazione periodica breve. Queste animazioni devono restare, ma non devono sovrascrivere il tracking.
- **Istanze GLB**: ogni `EyeScene` deve usare una clone della scena GLB (`gltfScene.clone(true)` o equivalente) per evitare contese tra più Canvas/istanze durante transizioni e route diverse.
- **Regola anti-regressione**: non usare `rotation.order`, `userData.baseRotX/baseRotY` o accumuli di rotazione se rendono il tracking dipendente dalle animazioni. Il tracking deve essere dominante; le animazioni sono additive su un gruppo separato.

### Autoplay Audio Policy (Interaction Gateway)
Per sbloccare l'audio nei browser moderni senza rovinare l'estetica:
1. Usa un **Interaction Gateway** (Overlay "ON").
2. **Silent Priming**: Al click, esegui un `new Audio("data:audio/wav;base64,...")` muto per attivare il contesto senza suoni udibili.
3. **Pointer Events**: Il layer Hero deve avere `pointer-events: auto` in `page.tsx`.
4. **Logic Lock Hero-only**: Nella landing/Hero, disabilita `onClick` dell'occhio finché `isUnlocked` non è true per evitare navigazioni accidentali prima del gateway. Fuori dalla Hero, l'occhio deve restare navigabile di default quando ha `targetRoute`.

---

## 3. Continuità Operativa tra Modelli e Versionamento

### Documentazione da leggere prima di ogni intervento
1. `AGENTS.md` — regole Payload, sicurezza Local API, hook transaction safety, versionamento.
2. `MASTER_SPEC.md` — roadmap e decisioni architetturali correnti.
3. `docs/NEO_ONBOARDING.md` — operativo per Neo e asset pipeline.
4. `docs/walkthrough.md` — note di UI/interazione più recenti.
5. `CHANGELOG.md` — storico release/fix.

### Regole di sicurezza da non violare
- Non committare mai segreti, password o env vars.
- Quando si passa `user` alla Local API Payload, impostare sempre `overrideAccess: false`.
- Nei hook Payload, passare sempre `req` alle operazioni nested (`req.payload.create/update/delete`) per mantenere transazioni e atomicità.
- Non fare reset o modifiche distruttive al database senza approvazione esplicita.

### Regole di versionamento
- **Versionamento semplice**: commit locale senza push.
- **Versionamento main**: commit su `main` + push su `origin main` per triggerare Vercel.
- Prima di pushare: controllare `git status`, eseguire almeno `pnpm tsc --noEmit`, aggiornare `CHANGELOG.md` e documentazione pertinente.
- Non includere file di cache/build (`tsconfig.tsbuildinfo`, `.next`, output temporanei) nei commit se modificati solo da validazioni locali.

### Handoff tecnico per l'occhio 3D
Se un modello futuro deve intervenire sull'occhio:
1. Non rimuovere le animazioni vitali senza consenso.
2. Non mescolare tracking e animazioni nello stesso gruppo se questo rompe gli assi.
3. Preservare comportamento atteso:
   - Desktop: segue il cursore costantemente.
   - Mobile: punta al touch, resta fissato circa 1 secondo, poi torna a fluttuare.
4. Testare sia la Hero (`/`) sia le istanze piccole in `/home`, `/artwork/[nid]`, `/cluster/[slug]`.

## 4. Manuale Operativo Step Immediati

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

## 5. Identità e Decisioni Strategiche
- **No standard ecommerce:** L'acquisto è una richiesta via form (Inquiry).
- **Eye Motif:** L'occhio è l'ancora di navigazione e il centro emotivo del sito. Deve sembrare vivo: tracking + capovolgimento + roll + vibrazione sono parte dell'identità, non decorazioni opzionali.
- **Colori:** Pink `#F45390`, Soft-pink `#B3828B`, Green `#809829`.
- **Stack:** Next.js 16, Payload v3, Neon Postgres, Cloudinary.

---
*Ultimo aggiornamento: 27 Aprile 2026 - Release v1.1.2 — documentata architettura Eye 3D con tracking/animazioni separati, regole di continuità multi-modello e sicurezza/versionamento. Prossimo passo: completare la responsività mobile globale e Zoom Modal (Step 13.5).*
