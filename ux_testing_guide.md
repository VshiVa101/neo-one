# ðŸ§ª Guida al Testing UX â€” Neo-One

Dato che questo Ã¨ il tuo primo caso studio reale come UX Designer, condurre test con utenti (usability testing) nei 4 giorni prima del deploy Ã¨ un'ottima mossa. L'obiettivo non Ã¨ solo trovare bug tecnici, ma capire se l'architettura dell'informazione funziona e se l'impatto emotivo (cruciale per il brand Neo-One) viene percepito correttamente.

---

## 1. Preparazione del Test

> [!IMPORTANT]
> **Non testare con altri designer o sviluppatori.** Cerca 3-5 persone che rientrano nel target del sito (appassionati d'arte, musica elettronica, cultura underground) ma che non hanno mai visto il progetto. 5 utenti sono sufficienti per trovare l'85% dei problemi di usabilitÃ .

- **Ambiente:** Fai test sia da Desktop che da Mobile. Molti problemi di UI (come la dimensione del font o l'usabilitÃ  del calendario) emergono solo su schermi piccoli.
- **Registrazione:** Chiedi il permesso di registrare lo schermo e l'audio. Non prendere appunti ossessivamente durante il test, concentrati sull'utente.
- **Mindset del Moderatore:** Tu non sei lÃ¬ per spiegare il sito, ma per osservare. Se l'utente si blocca e chiede "Cosa devo fare qui?", rispondi con: *"Tu cosa faresti?"* o *"Cosa ti aspetteresti che succeda?"*.

---

## 2. Scenari e Task (Il Cuore del Test)

Non dire mai "Clicca sul pulsante carrello". Usa **scenari contestuali**.

### Scenario A: L'Impatto Iniziale (The Jumpscare & Vibe)
**Contesto:** "Stai navigando online e un amico ti manda questo link dicendo 'Devi vedere questo progetto'."
**Task:** 
1. Apri il sito. Esplora liberamente la prima pagina (NeoUncensored Hero) per 30 secondi.
2. Dimmi, a voce alta, di cosa pensi tratti questo sito e qual Ã¨ la primissima emozione che provi.
**Cosa osservare:** L'animazione dell'occhio 3D Ã¨ chiara da cliccare? Il "jumpscare" e le esplosioni disturbano troppo l'utente o creano l'hype giusto? Capiscono come entrare nel sito vero e proprio?

### Scenario B: Esplorazione e Acquisto (Navigazione Clusters)
**Contesto:** "Hai sentito parlare di un'opera chiamata 'Bunny Killa' o vuoi esplorare le opere d'arte disponibili."
**Task:** 
1. Trova un'opera d'arte che ti colpisce e guarda i dettagli.
2. Immagina di volerla comprare o prenotare. Aggiungila al carrello.
3. Trova il carrello e procedi come se volessi completare l'acquisto.
**Cosa osservare:** Trovano facilmente la navigazione? L'hover sui componenti `TornPaper` o `Cluster` Ã¨ intuitivo? Il pulsante del carrello fisso (verde/rosa) Ã¨ visibile?

### Scenario C: Il Calendario Eventi
**Contesto:** "Vuoi sapere se Neo-One organizzerÃ  eventi dal vivo a cui puoi partecipare."
**Task:** 
1. Trova le date degli eventi in programma per quest'anno.
2. Trova le informazioni sul prossimo evento e cerca di capire dove si terrÃ .
3. Usa la mappa o le frecce per vedere gli eventi degli anni passati.
**Cosa osservare:** Lo scroll orizzontale sul nastro degli eventi (`row-1.webp`) Ã¨ fluido? Capiscono le frecce per cambiare anno? L'UI del calendario Ã¨ leggibile nonostante lo stile "disturbato"?

---

## 3. Metodo "Think Aloud"

Chiedi costantemente all'utente di **pensare ad alta voce**. 
- *Sbagliato:* "Ti piace questo font?"
- *Corretto:* "Cosa ti passa per la mente guardando questa sezione?"
- *Se esitano:* "Cosa stai cercando?"

---

## 4. Metriche da Documentare per il tuo Caso Studio

Per rendere il tuo portfolio da UX Designer professionale, documenta questi dati per ogni partecipante:

1. **Task Success Rate:** L'utente ha completato il task? (SÃ¬ / No / Con Aiuto).
2. **Time on Task:** Quanto tempo ci ha messo a trovare il calendario o aggiungere un prodotto? (Se ci mettono troppo, c'Ã¨ attrito).
3. **Emotional Response:** Raccogli 3 aggettivi usati dall'utente (es. "Caotico", "Figo", "Confuso"). Ãˆ fondamentale per un sito brand-heavy come questo.
4. **Error Rate:** Quante volte hanno cliccato su qualcosa che non era cliccabile? (Es. titoli che sembrano bottoni).

---

## 5. Template Post-Test (System Usability Scale - SUS)

Alla fine di ogni test, fagli compilare un brevissimo questionario di 5 domande (scala da 1 a 5, dove 1 = Fortemente in disaccordo, 5 = Fortemente d'accordo):

1. Penso che mi piacerebbe usare questo sito frequentemente.
2. Ho trovato il sito inutilmente complesso.
3. Ho trovato il sito facile da usare.
4. Penso che la maggior parte delle persone imparerebbe a usare questo sito molto velocemente.
5. Mi sono sentito molto sicuro nell'usare questo sito.

*(Questa Ã¨ una versione ridotta del SUS, ottima per avere un dato quantitativo da inserire nel caso studio).*

> [!TIP]
> **Come presentarlo nel portfolio:** Mostra il "Prima" e il "Dopo". Se durante i test scopri che nessuno trova il carrello, documenta: *"Insight: Gli utenti non vedevano l'icona del carrello verde. Soluzione: Ho aggiunto un'animazione pulsante quando viene aggiunto un item, aumentando la visibilitÃ  del 40%."* Questo Ã¨ ciÃ² che i recruiter vogliono leggere.
