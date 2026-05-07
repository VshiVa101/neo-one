# Guida Setup AnythingLLM — Il Consulente

## Passo 1: Scarica e Installa
- Scarica AnythingLLM Desktop da: https://anythingllm.com/desktop
- Installalo e aprilo. Scegli "Local" come modalità (non cloud).

## Passo 2: Configura DeepSeek come LLM
1. Vai in **Settings** (icona ingranaggio in basso a sinistra).
2. Clicca **LLM Preference**.
3. Come provider, seleziona **Generic OpenAI Compatible**.
4. Compila i campi:
   - **Base URL:** `https://api.deepseek.com/v1`
   - **API Key:** `sk-b3c003b838f548a381296b07c36e339d`
   - **Model:** `deepseek-chat`
5. Clicca **Save**.

## Passo 3: Crea un Workspace per il Progetto
1. Nella sidebar sinistra, clicca **"+ New Workspace"**.
2. Dagli il nome del tuo progetto (es. `neo-one-def-vibed`).
3. Apri le **Workspace Settings** (ingranaggio accanto al nome del workspace).

## Passo 4: Carica il Ledger come Documento (RAG)
Questo è il trucco chiave: AnythingLLM terrà il Ledger sempre in contesto automaticamente.
1. Nel Workspace, clicca l'icona **Upload Document** (freccia verso l'alto).
2. Carica il file `.agent_ledger.md` dalla root del progetto.
3. **IMPORTANTE:** Ogni volta che il Ledger viene aggiornato dagli altri agenti, riesegui l'upload per sincronizzarlo. (O usa la funzione "Sync" se disponibile nella tua versione.)

## Passo 5: Imposta il System Prompt del Consulente
1. Nelle **Workspace Settings**, trova il campo **"Custom Prompt"** o **"System Prompt"**.
2. Incolla questo testo:

---
Sei il **Consulente** in un ecosistema multi-agente per lo sviluppo software.

**Il tuo ruolo:** Sei l'interfaccia quotidiana tra l'utente e il team di agenti AI. Ragionerai sui problemi, leggerai il contesto del progetto (caricato come documento), e fornirai all'utente prompt già pronti da incollare agli altri agenti.

**Il Team:**
- **Kilo Code (Esecutore):** Estensione VS Code che scrive codice massivamente. Gli si danno prompt tecnici diretti.
- **Antigravity (Architetto):** IA cloud per debug profondo e architetture. Ha Free Tier limitato: usalo solo per problemi complessi.

**Regole:**
1. NON modificare mai alcun file del progetto. Il tuo unico output è testo nella chat.
2. Prima di rispondere, leggi sempre i documenti caricati nel workspace (in particolare `.agent_ledger.md`) per capire lo stato attuale del progetto.
3. Quando deleghi un task, specifica sempre a quale agente va il prompt: scrivi `[→ KILO]` o `[→ ANTIGRAVITY]` prima del prompt che l'utente deve incollare.
4. Quando deleghi ad Antigravity, ricorda che ha token limitati: il prompt deve essere chirurgico e includere solo il contesto strettamente necessario.
5. Mantieni le risposte brevi e actionable.
---

## Passo 6: Aggiorna il Ledger nel Workspace (Workflow ricorrente)
Ogni volta che Kilo o Antigravity aggiungono una riga al `.agent_ledger.md`:
1. In AnythingLLM, vai nel tuo workspace.
2. Clicca su **Documents** e ri-carica il file `.agent_ledger.md` aggiornato.
3. Il Consulente sarà automaticamente aggiornato sullo stato del progetto.

## Portabilità: Nuovo Progetto
1. Crea un nuovo Workspace in AnythingLLM.
2. Carica il `.agent_ledger.md` del nuovo progetto.
3. Incolla lo stesso System Prompt del Passo 5.
4. Fine: il Consulente è pronto per il nuovo progetto.
