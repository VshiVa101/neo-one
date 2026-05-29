# Linee Guida Generali

Owner: leo

# Neo-One Art Hub — Linee Guida Generali

**Riferimento per Leo e Neo | UX Testing | Maggio 2026**

---

## Obiettivo di questi test

Validare l'MVP del sito su utenti reali prima di qualsiasi iterazione post-lancio. Non cerchiamo conferme — cerchiamo friction points reali. Un utente che si perde è un dato prezioso quanto uno che completa tutto senza problemi.

---

## Cosa stiamo misurando

Ogni test punta a verificare questi target (dalla Feature Matrix originale):

| Task | Obiettivo | Soglia minima |
| --- | --- | --- |
| Galleria / esplorazione | Trova e apre un'opera senza aiuto | 85% completamento |
| Calendario / evento | Trova la prossima data | 90% in <30 secondi |
| Contatto / acquisto | Trova e tenta il form | 80% completamento |

Sotto soglia = priority fix prima del prossimo rilascio.

---

## Regole del moderatore (per Leo)

**Durante il test guidato:**

- Non aiutare mai, anche se l'utente è chiaramente bloccato — la frustrazione è un dato
- Non fare domande chiuse tipo "hai visto il pulsante lì?" — solo domande aperte
- Annota ogni esitazione, ogni silenzio lungo, ogni commento spontaneo
- Se l'utente chiede "è giusto così?" rispondi sempre: *"Non c'è risposta giusta — fai quello che faresti normalmente"*

**Sul numero di partecipanti:**
Secondo la ricerca di Nielsen Norman Group, **5 utenti moderati** sono sufficienti per identificare l'85% dei problemi di usabilità maggiori. Con più partecipanti si identificano problemi sovrapposti. Priorità alla qualità delle sessioni, non alla quantità.

**Sul bias:**

- Non testare con persone che sanno già come funziona il sito
- Se un partecipante ti conosce bene (es. amici stretti), tienine conto nell'analisi — il risultato sarà influenzato dalla familiarità
- Registra sempre il dispositivo usato: mobile e desktop possono dare risultati molto diversi

---

## Come gestire situazioni difficili

**L'utente si blocca completamente:**
Aspetta 90 secondi. Se non sblocca, chiedi: *"Cosa ti aspettavi di trovare qui?"* — poi lascia che continui o passa al task successivo. Non mostrare la soluzione.

**L'utente trova un bug:**
Annotalo con screenshot/timestamp nella registrazione. Non interrompere il test. Alla fine chiedi: *"Quel problema che hai incontrato — quanto ha influenzato la tua esperienza complessiva?"*

**L'utente commenta i contenuti espliciti:**
È normale. Annota la reazione (positiva/negativa/neutra) e prosegui. Non giustificare e non commentare tu.

**L'utente finisce molto in fretta:**
Chiedi sempre: *"C'è qualcosa che avresti voluto esplorare di più?"* e *"C'è qualcosa che hai evitato deliberatamente?"*

---

## Cosa fare con i dati

**Dopo ogni sessione guidata:**

1. Completa il template note a caldo (entro 10 minuti dalla fine)
2. Salva la registrazione con il nick del partecipante
3. Annota 1-2 quote significative

**Dopo aver raccolto tutti i test:**

1. Calcola il task completion rate per ogni task: `(completamenti / totale partecipanti) × 100`
2. Calcola la media dei rating 1-5 per task
3. Raccogli tutte le risposte aperte e raggruppa per tema (affinity mapping — già lo sai fare)
4. Identifica i 3 pain point più frequenti → diventano le prime iterazioni

**Schema del caso studio finale:**

```
1. Contesto del progetto
2. Research phase (già in Notion)
3. Sintesi: personas, user flows, feature priorities
4. Metodologia di testing
5. Risultati quantitativi (completion rate, rating medi)
6. Risultati qualitativi (pattern, quote dirette)
7. Insight e raccomandazioni
8. Iterazioni previste
```

---

## Calendario operativo

| Giorno | Attività |
| --- | --- |
| Mer 20 Maggio | Primi test guidati + diffusione invito autonomo |
| Gio 21 Maggio | Test guidati (9-12:30 / 15:30-19) |
| Ven 22 Maggio | Ultimi test guidati + deadline autonomi ore 19:00 |
| Sab-Dom | Analisi dati, affinity mapping risultati |
| Settimana successiva | Stesura caso studio |

---

## Contatti e link di riferimento

| Risorsa | Link |
| --- | --- |
| Discord | discord.gg/Ww3xjr77m |
| WhatsApp Leo | +39 338 844 8833 |
| Survey autonomo | forms.gle/SMSjPUKZbf97mggM8 |
| YouTube Neo | youtube.com/@neooneart |
| Instagram Neo | instagram.com/neooneart |
| Sito (non condividere pubblicamente) | neo-one-azure.vercel.app |