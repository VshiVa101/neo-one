# ============================================================
# GENERA MAPPA PER ANTIGRAVITY (Ottimizzazione Token)
# ============================================================
# Questo script usa 'repomix' per creare un singolo file di testo
# contenente la struttura e il codice del tuo progetto, formattato
# appositamente per le Intelligenze Artificiali.
#
# USO:
# 1. Esegui questo script nel tuo terminale
# 2. Verrà creato un file 'repomix-output.txt'
# 3. Trascina/copia quel file nella chat di Antigravity
# ============================================================

Write-Host "Generazione della mappa del progetto in corso..." -ForegroundColor Cyan
Write-Host "Verranno ignorati i file elencati in .gitignore e .claudesignore" -ForegroundColor DarkCyan

# Esegue repomix (lo scarica temporaneamente se non è installato)
npx repomix --ignore "**/*.png,**/*.jpg,**/*.svg,**/*.mp4,dist/**,build/**"

Write-Host ""
Write-Host "✅ Mappa generata con successo!" -ForegroundColor Green
Write-Host "Ora puoi passare il file 'repomix-output.txt' ad Antigravity." -ForegroundColor Yellow
