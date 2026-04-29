# 🧬 NEO-ONE: MASTER RULES & ALIGNMENT

> **DIRETTIVA PRIMARIA:** Questo documento è la singola fonte di verità ("le redini") per lo sviluppo del progetto Neo-One Art Hub. Leggilo sempre prima di operare. 

> [!IMPORTANT]
> **MILESTONE: CONSOLIDAMENTO E PULIZIA (29 APRILE 2026)**
> Questo commit segna il passaggio del progetto da "Prototipo" a "Sistema Stabile". La struttura è stata snellita, le dipendenze allineate, e la documentazione unificata. Da qui in poi, il sistema segue le regole ferree di versionamento descritte in questo file.

---

## 1. Vibe Coding Spec (Il Metodo Leon9)

### Chi Sono & Come Comunico
- Sono un **UX Designer e Creative Technologist**. Il mio focus è trasformare universi creativi in esperienze web interattive, con una mentalità "zero budget" e alta qualità.
- Comunico in **MAIUSCOLO** per enfasi e urgenza creativa, non per rabbia.
- Mando **screenshot** come linguaggio primario: guardali con attenzione chirurgica.
- Parlo italiano come lingua primaria.
- Non voglio premesse diplomatiche o complimenti vuoti. Se qualcosa non va, dimmelo.

### Regole Operative Non Negoziabili
1. **Rischio Zero Progressivo**: Lavoro sequenziale: `Ricerca → Piano → Approvazione → Esecuzione → Verifica → Commit → Prossimo Step`. Mai due cose in parallelo.
2. **Mai toccare il DB senza permesso**: Aggiungere campi è ok, modifiche distruttive richiedono OK scritto.
3. **Versionamento Sacro**: Prima di passare al prossimo step, `git status` deve essere pulito. Un commit per step logico.
4. **Mock first, data dopo**: Costruisci la UI con dati finti, stabilizza, poi collega i dati reali.
5. **Niente lavoro parallelo non richiesto**: Se dico "fermati", ti fermi.

---

## 2. Identità del Progetto & Estetica

Neo-One **non è un template Payload generico**. È un art hub interattivo.
- L'esperienza deve essere: **viva, premium, leggermente pericolosa, tattile, cinematografica**.
- **L'occhio 3D è il cuore**: Non è decorativo. È un'ancora di navigazione emotiva.
- **Micro-animazioni ovunque**: Hover, transizioni, click... tutto deve avere un feedback vitale.
- **Senza E-commerce standard**: Tutto passa per "Inquiry" via form email. Non ci sono carrelli classici.

---

## 3. Contratto dell'Occhio 3D (Core Component)

L'occhio 3D (`EyeScene.tsx`) ha un comportamento rigido da NON alterare:

### Tracking & Animazioni
- **Architettura a due livelli**:
  - *Outer Group*: Tracking (look-at verso il mouse/touch). Dominante.
  - *Inner Group*: Animazioni vitali (capovolgimento lento, vortex rapido sulla pupilla, vibrazione).
- **Mai rimuovere le animazioni vitali** per "fixare" il tracking.
- **Mobile Touch**: Su `touchstart` punta al dito, su `touchmove` lo segue. Su `touchend` fissa il punto per ~1 secondo, poi torna a fluttuare.

### Ottimizzazione GLB
- Usa sempre `.clone(true)` sulla scena caricata da `useGLTF` per evitare contese tra istanze multiple di Canvas.

---

## 4. Regole di Sicurezza Payload CMS

Segui rigorosamente questi pattern per Payload:

1. **Local API Access Control**:
   Quando passi `user` alla Local API, **DEVI** impostare `overrideAccess: false`.
   ```typescript
   await payload.find({ collection: 'posts', user: req.user, overrideAccess: false })
   ```
2. **Transazioni sicure negli Hooks**:
   Passa sempre l'oggetto `req` alle operazioni annidate per mantenere la transazione atomica.
   ```typescript
   await req.payload.update({ collection: 'posts', id: doc.id, data: {...}, req })
   ```
3. **Prevenzione Loop Infiniti negli Hooks**:
   Usa flag nel context per evitare che un hook chiami se stesso:
   ```typescript
   if (context.skipHooks) return;
   ```
4. **Secrets**:
   MAI committare chiavi API, URL del database Neon, o JWT secrets.

---

## 5. Workflow di Versionamento e Deploy

### Validazione Pre-Commit
Prima di committare, verifica sempre che TypeScript non sia rotto:
```bash
pnpm tsc --noEmit
```
Se hai toccato i plugin o l'admin, genera le import map:
```bash
pnpm generate:importmap
```

### Commit e Deploy
- **Deploy Automatico**: Vercel ascolta i push sul branch `main`.
- Formato Commit: Usa conventional commits descrittivi es. `fix(eye): restore mobile tracking` o `feat(gallery): add zoom modal`.

---

## 6. XnConvert & Asset Pipeline (Neo Onboarding)

**Profilo Raccomandato (NEO_ONE_WEB)**:
- Lato lungo Opere: **1920px**
- Lato lungo Clusters/Signali: **1200px**
- Icone UI: **256/512px**
- Formato: **WEBP (Qualità 85)**, rimuovere metadati (Lanczos resampling).
- Nessun asset deve essere caricato su Payload senza passare da questo flusso.

---
*Ultimo Aggiornamento: 2026-04-29 — Consolidamento totale delle linee guida del progetto.*
