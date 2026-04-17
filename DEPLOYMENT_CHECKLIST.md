# 🚀 Neo-One Vercel Deployment Checklist

**Release:** v1.1.0
**Status:** Deployed
**Date:** April 15, 2026
**GitHub Repo:** https://github.com/VshiVa101/neo-one.git

---

## ✅ Pre-Deployment (COMPLETATO)

- [x] Codice pushato su GitHub
- [x] Database Neon online e configurato
- [x] Cloudinary storage pronto
- [x] Account Neo creato nel database
- [x] MASTER_SPEC.md aggiornato
- [x] Footer/Header Globals creati e Types rigenerati

---

## 🎯 Deployment Steps

### Step 1: Vercel Import
1. Vai a https://vercel.com/dashboard
2. Clicca **"Add New"** → **"Project"**
3. Seleziona **"Import Git Repository"**
4. Importa il repo dal tuo account GitHub
5. Clicca **"Import"**

### Step 2: Configure Build
Vercel auto-rileva Next.js. Lascia i default:
- Framework: `Next.js` ✅
- Root Directory: `./` ✅
- Build Command: `pnpm build` ✅

### Step 3: Environment Variables
Aggiungi le variabili dal tuo file `.env` locale **PRIMA** di cliccare Deploy.

Variabili necessarie:
- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SERVER_URL`
- `CRON_SECRET`
- `PREVIEW_SECRET`

> ⚠️ NON committare mai valori di env vars nel repository. Usa sempre la dashboard di Vercel.

### Step 4: Deploy
1. Clicca **"Deploy"**
2. Aspetta 3-5 minuti
3. Quando vedi ✅ **"Deployment successful"** → FATTO

### Step 5: Verifica
- Apri l'URL che Vercel ti dà
- Verifica che il sito carichi
- Prova ad andare a `/admin`
- Login con le credenziali create via `scripts/create-neo-user.ts`

---

## 🔐 Creare un Account Admin

```bash
# Passa email e password come variabili d'ambiente
$env:NEO_EMAIL="user@example.com"
$env:NEO_PASSWORD="SecurePassword123!"
pnpm exec tsx scripts/create-neo-user.ts
```

---

## 🔄 Post-Deployment

1. Ogni commit in `main` auto-triggera redeploy su Vercel
2. Neo vedrà i cambiamenti live in ~2-3 minuti
3. Il dominio custom si collega dopo (Settings → Domains)

---

## 🛠️ Troubleshooting

**Build fallisce su Vercel:**
1. Controlla che tutte le env vars siano settate
2. Verifica che `pnpm build` funzioni in locale
3. Controlla il log del build su Vercel dashboard

**Neo non riesce a loggarsi:**
1. Verifica che `DATABASE_URI` sia corretto in Vercel
2. Ricrea l'utente con lo script `create-neo-user.ts`

---

Ultimo aggiornamento: 17 Aprile 2026
