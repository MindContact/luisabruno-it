# luisabruno-it

Il sito di Luisa Bruno, Medico Psicoterapeuta a Montalto Dora, rifatto statico con Hugo al posto
di WordPress. Una landing page e un blog, in italiano.

## Struttura

```
data/landing.yaml      tutti i testi della landing: si modificano qui
content/posts/         gli articoli del blog, uno per file Markdown
content/*.md           privacy e cookie policy
layouts/               il tema, scritto qui (la home è layouts/index.html)
assets/css/site.css    l'unico foglio di stile
assets/illustrazioni/  le illustrazioni a linea dell'identity, pronte per stare nella pagina
static/img, fonts      foto, logo (SVG) e font (Rethink Sans, Inter)
```

## Identità visiva

Il sito segue le linee guida dello studio di identità visiva di Hikimi (i sorgenti dello studio
non sono in questo repo): blu `#6069af`, off white `#fffbf2`, titoli in Rethink Sans Semibold, testo in Rethink Sans Regular, didascalie in Inter.
I font sono file locali (nessuna chiamata a Google Fonts). Il logo è l'SVG dello studio.

Le illustrazioni in `assets/illustrazioni/` derivano dagli SVG dello studio:
tolto lo stile interno, colore ereditato dal testo (`currentColor`), `pathLength="1"` su ogni
tratto, così la pagina le disegna quando entrano nello schermo. L'impaginazione riprende il
pieghevole: fasce blu con le illustrazioni bianche, foto e schede arrotondate. Si inseriscono con
`{{ partial "illu.html" (dict "nome" "coppia" "classe" "draw") }}`.

## Tracciamento e consenso

Come sul sito WordPress: Google Analytics 4, Google Ads (con la conversione sul clic dei bottoni
di prenotazione) e pixel Meta. Gli identificativi stanno in `hugo.toml`, sezione
`[params.tracciamento]`: un valore vuoto spegne quel servizio, tutti vuoti tolgono anche il banner.

Niente parte prima della scelta del visitatore. Il banner (`layouts/partials/consenso.html`,
`assets/js/consenso.js`) chiede il consenso per due categorie, statistiche e marketing; la scelta
resta nel browser per sei mesi e si cambia da "Preferenze cookie" nel piè di pagina.

In anteprima (`hugo server`) il banner si vede ma gli script non vengono caricati: partono solo
nella build di produzione (`hugo`).

## Anteprima

```bash
hugo server -D      # http://localhost:1313/
```

## Scrivere un articolo

```bash
hugo new content posts/titolo-articolo.md
```

Nel front matter: `title`, `date`, `description`, `immagine: img/nome-foto.jpg` (la foto va in
`static/img/`). Togli `draft: true` quando è pronto. L'indirizzo sarà `/titolo-articolo/`.

## Pubblicazione

GitHub Pages: a ogni push su `main` il workflow `.github/workflows/hugo.yml` compila il sito con
Hugo e lo pubblica. Il dominio è in `static/CNAME` (`luisabruno.it`).

DNS: `luisabruno.it` con i record A di GitHub Pages, `www` in CNAME verso `MindContact.github.io`
(GitHub lo reindirizza al dominio senza `www`).

Nessun indirizzo email nelle pagine.
