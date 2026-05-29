# conversione

Owner: leo

Searched web: "xnconvert webp settings guide long side resize"

Ricevuto. Ecco la guida definitiva "a prova di errore" per Neo. Ho eliminato ogni ambiguità e impostato valori univoci.

### 🧬 Come funziona il "Lato Più Lungo"

È la funzione magica di XnConvert: non importa se la foto è orizzontale o verticale, tu gli dici solo quanto deve essere grande il lato più lungo. Il programma capisce da solo l'orientamento e ridimensiona l'altro lato proporzionalmente. **Nessuna immagine verrà mai schiacciata o deformata.**

---

# 🎨 GUIDA VELOCE: Ottimizzazione Immagini per Neo-One

*Segui questi passaggi nell'ordine esatto per caricare immagini perfette sul sito.*

### 1. Scheda ORIGINE (Carica i file)

- Trascina le foto originali (JPG, PNG, TIFF) dentro la finestra grande.

### 2. Scheda AZIONI (Trasforma)

- Clicca su **Aggiungi azione > Immagine > Ridimensiona**.
- Imposta esattamente così:
    - **Modalità**: Lato più lungo
    - **Dimensione**: 1920 pixel
    - **Rampionamento**: Lanczos (il migliore per la qualità)
    - **Ingrandisci/Riduci**: Solo riduci (non vogliamo mai "ingrandire" foto piccole sgranandole)
- *Opzionale:* Aggiungi azione > Metadati > Rimuovi (per pulire i file).

### 3. Scheda DESTINAZIONE (Salva)

- **Formato**: Seleziona `WEBP - WebP` dal menu a tendina.
- Clicca il tasto **Impostazioni...** subito sotto:
    - Sposta lo slider **Qualità a 85**.
    - Clicca **OK**.
- **Cartella**: Scegli dove vuoi salvare le nuove foto (es. una cartella chiamata "PRONTE_SITO").

### 4. FINE

- Clicca il tasto **CONVERTI** in basso a destra. Fatto.

---

### 📊 Tabella "At a Glance" (Parametri Univoci)

Usa questi valori per ogni tipo di caricamento. **Non cambiare nient'altro.**

| Tipo Elemento | Risoluzione (Lato Lungo) | Formato | Qualità | Azione Extra |
| --- | --- | --- | --- | --- |
| **OPERE (Artworks)** | **1920 px** | WebP | 85 | Rimuovi Metadati |
| **COPERTINE (Clusters)** | **1200 px** | WebP | 85 | Rimuovi Metadati |
| **EVENTI (Signals)** | **1200 px** | WebP | 85 | Rimuovi Metadati |
| **ICONE UI / LINKTREE** | **256 px 512 SE DETTAGLAITTISME** | WebP | 85 | *Mantieni Trasparenza* |

---

### 💡 Il consiglio d'oro per Neo:

Una volta che hai impostato tutto la prima volta, clicca sull'icona **"Salva configurazione"** (il floppy disk in basso a sinistra) e chiamala **"NEO_ONE_WEB"**.

La prossima volta che apri il programma, dovrai solo caricare le foto, scegliere quel profilo e cliccare Converti. **Zero stress.**

### **📝 Tabella Aggiornata (Asset Speciali)**

| **Elemento** | **Dimensione (Lati)** | **Formato** | **Note Tecniche** |
| --- | --- | --- | --- |
| **Sfondi Full Page** | **1920 x 1080** | WebP (Qualità 75) | Rapporto 16:9 |
| **Texture Occhio 3D** | **2048 x 2048** | WebP (Qualità 90) | **Deve essere quadrata** |
| **Decorazioni UI** | **800 - 1200 px** | WebP (Trasparenza ✅) | Esporta a 2x la grandezza reale |

### **⚠️ Consiglio per le Texture 3D (Occhio):**

Quando converti la mappa dell'occhio con XnConvert, **NON** usare l'azione "Ridimensiona" se l'immagine originale è già vicina a 2048 o 1024. Lasciala nella sua risoluzione "Power of Two" originale per non sfalsare le coordinate UV che avvolgono la sfera dell'occhio.

Neo ha disegnato l'occhio su un foglio quadrato o è una texture piatta che abbiamo già? Se la stiamo creando da zero, digli di stare sui `2048x2048`.

@Zoe Van Dyne