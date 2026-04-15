# 🚀 Neo-One Vercel Deployment Checklist

**Status:** Ready for deployment
**Date:** April 15, 2026
**GitHub Repo:** https://github.com/VshiVa101/neo-one.git

---

## ✅ Pre-Deployment (COMPLETATO)

- [x] Codice pushato su GitHub (1242 commits, 84 MB)
- [x] Database Neon online e configurato
- [x] Cloudinary storage pronto
- [x] Account Neo creato nel database (neo@neo-one.art / NeoPink2026!Key#)
- [x] MASTER_SPEC.md aggiornato
- [x] Script create-neo-user.ts committato

---

## 🎯 Deployment Steps (PER TE)

### Step 1: Vercel Import
1. Vai a https://vercel.com/dashboard
2. Clicca **"Add New"** → **"Project"**
3. Seleziona **"Import Git Repository"**
4. Paste URL: `https://github.com/VshiVa101/neo-one.git`
5. Clicca **"Import"**

### Step 2: Configure Build
**Vercel auto-rileva Next.js. LASCIA TUTTO DI DEFAULT:**
- Framework: `Next.js` ✅
- Root Directory: `./` ✅
- Build Command: `pnpm build` ✅
- Output Directory: `.next` ✅

### Step 3: Environment Variables
Aggiungi queste variabili PRIMA di cliccare Deploy:

```
DATABASE_URI = postgresql://neondb_owner:npg_0ZmC8YkDdnai@ep-lingering-wildflower-agitcscp.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

PAYLOAD_SECRET = ca797a62e1dc6a42b10825a4

CLOUDINARY_CLOUD_NAME = dhk3bdk5q

CLOUDINARY_API_KEY = 721252821681267

CLOUDINARY_API_SECRET = Do3VWp-biCfAH1xTbV-KOq67HIM

NEXT_PUBLIC_SERVER_URL = https://neo-one.vercel.app

CRON_SECRET = your-cron-secret

PREVIEW_SECRET = your-preview-secret
```

### Step 4: Deploy
1. Clicca **"Deploy"** in basso
2. Aspetta 3-5 minuti
3. Quando vedi ✅ **"Deployment successful"** → FATTO

### Step 5: Verifica
- Apri l'URL che Vercel ti dà (tipo: https://neo-one.vercel.app)
- Verifica che il sito carichi
- Prova ad andare a `/admin`
- Login con: `neo@neo-one.art` / `NeoPink2026!Key#`

---

## 📧 Credenziali Neo (Da condividere)

```
🌐 URL Admin:  https://neo-one.vercel.app/admin
📧 Email:      neo@neo-one.art
🔐 Password:   NeoPink2026!Key#
```

---

## 🔄 Post-Deployment

Dopo il deploy:

1. **Continua con Step 13.5** (Responsive mobile)
   - Lavora in locale con `pnpm dev`
   - Ogni commit in main auto-triggera redeploy su Vercel
   - Neo vedrà i cambiamenti live in ~2-3 minuti

2. **Step 14 Planning** (Calendar page)
   - Route: `/calendar`
   - Fetch signals ordinati per sortOrder
   - UI: lista/griglia con miniature

---

## 🛠️ Troubleshooting

**Se il build fallisce su Vercel:**
1. Controlla che tutte le env vars siano settate
2. Verifica che `pnpm install` funzioni in locale
3. Controlla il log del build su Vercel dashboard
4. Se persiste, contattami con lo screenshot dell'errore

**Se Neo non riesce a loggarsi:**
1. Verifica che DATABASE_URI sia corretto
2. Prova a creare un nuovo utente in locale con lo script
3. Controlla la console browser per errori

---

## 📝 Notes

- Vercel auto-redeploya ogni volta che pushiamo su main
- Il dominio custom si collega DOPO (quando Neo lo avrà deciso)
- I build sono free fino a 100/mese
- Database Neon rimane online indipendentemente da Vercel

---

**Quando il deploy è pronto, aggiorna questo file mettendo la data e l'URL finale.**

Ultimo aggiornamento: 15 Aprile 2026 - Pre-deployment checklist completo
