# Guida Setup RTK (Reduce Token Kit)

RTK intercetta l'output dei comandi terminale (git status, npm install, ls, grep, git diff) e li comprime automaticamente prima che entrino nel contesto dell'LLM. Risparmio stimato: **80% sui comandi shell**.

## Prerequisito: Rust/Cargo
Se `cargo --version` non funziona, installa Rust:
```powershell
# Scarica e installa rustup (gestore Rust per Windows)
winget install Rustlang.Rustup
# Chiudi e riapri il terminale, poi verifica:
cargo --version
```

## Installazione RTK
```powershell
cargo install rtk
```

## Inizializzazione per Kilo Code / Claude Code
```powershell
rtk init -g
```
Questo configura RTK come wrapper globale per tutti gli agenti AI.

## Verifica
```powershell
rtk --version
# Dopo qualche comando in sessione:
rtk gain
```
`rtk gain` mostra quanti token hai risparmiato e la percentuale per comando.

## Post-installazione
- **Riavvia VS Code / Kilo Code** dopo l'installazione.
- RTK gira in background. Non serve fare nulla manualmente dopo il setup.
- Funziona sia nel terminale integrato di VS Code che in PowerShell esterno.

## Nota Windows
Se `cargo install rtk` fallisce, potrebbe servire Visual Studio Build Tools:
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools
```
Poi riprova `cargo install rtk`.
