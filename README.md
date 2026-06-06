# 🥏 Diskgolf-terningen

En lettvekts nettside-app som triller en **tilfeldig diskgolf-utfordring** før hvert hull.
Perfekt for utdrikningslag, vennegjengen eller bare for å krydre en vanlig runde.

Ingen rammeverk, ingen byggesteg – bare ren HTML/CSS/JS. Det betyr at den kan
publiseres helt gratis på GitHub Pages (eller hvilket som helst statisk-hosting-verktøy).

## ✨ Funksjoner

- 🎲 Stor «trill»-knapp med shuffle-animasjon og resultatkort
- 🍺 Skru drikke-utfordringer av/på (familievennlig modus)
- 🔁 Unngå at samme utfordring kommer to ganger på rad
- 📜 Oversikt over alle utfordringer
- 📱 Mobilvennlig, kan «installeres» som app (PWA) på telefonen
- ⌨️ Trykk mellomrom/enter for å trille

## 🚀 Publiser gratis på GitHub Pages

1. Push koden til `main`-branchen på GitHub.
2. Gå til **Settings → Pages** i repoet.
3. Under **Build and deployment → Source**, velg **GitHub Actions**.
4. Workflowen i `.github/workflows/deploy.yml` kjører automatisk og publiserer siden.
5. Etter et minutt ligger appen på `https://<brukernavn>.github.io/<repo>/`.

> Du kan også teste lokalt ved å bare åpne `index.html` i nettleseren,
> eller kjøre `python3 -m http.server` i mappa.

### Andre gratis alternativer

Siden dette er en ren statisk side fungerer den også rett ut av boksen på:

- **Netlify** – dra og slipp mappa på <https://app.netlify.com/drop>
- **Cloudflare Pages** – koble til GitHub-repoet
- **Vercel** – importer repoet (rammeverk: «Other»)

## ✏️ Endre utfordringene

Alle aktivitetene ligger i [`challenges.js`](challenges.js). Hver utfordring ser slik ut:

```js
{ emoji: "🍺", title: "Sip of Shame", desc: "Den som kaster lengst fra kurven drikker.", drink: true },
```

- `emoji` – ikonet som vises
- `title` – kort navn
- `desc` – forklaring av regelen
- `drink` – `true` hvis det er en drikke-utfordring (skjules når drikke er skrudd av)

Legg til, fjern eller endre så mye du vil – endringene vises med en gang siden lastes på nytt.

## 📁 Filer

| Fil | Hva |
| --- | --- |
| `index.html` | Selve siden |
| `style.css` | Utseende (diskgolf-grønt tema) |
| `app.js` | Logikk for trilling og animasjon |
| `challenges.js` | Lista med utfordringer – **rediger her** |
| `manifest.webmanifest` | Gjør den installerbar som app på mobil |
| `.github/workflows/deploy.yml` | Auto-publisering til GitHub Pages |

🥂 **Skål for brudgommen!**
