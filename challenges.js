/**
 * Diskgolf-terningen – utfordringer / aktiviteter
 *
 * Vil du legge til eller endre? Bare rediger lista under.
 *   emoji  – ikonet som vises
 *   title  – kort navn på utfordringen
 *   desc   – forklaring av regelen
 *   drink  – true hvis det er en drikke-utfordring (kan skrus av i appen)
 */
const CHALLENGES = [
  { emoji: "🍺", title: "Sip of Shame", desc: "Den som kaster lengst fra kurven på dette hullet drikker en slurk.", drink: true },
  { emoji: "🙈", title: "Blindkast", desc: "Alle kaster med ikke-dominerende hånd hele hullet.", drink: false },
  { emoji: "🔄", title: "Bytt disc", desc: "Alle bytter disc med naboen til venstre før utkastet.", drink: false },
  { emoji: "🏌️", title: "Driving Range", desc: "Kun driver er tillatt hele hullet – ingen midrange eller putter.", drink: false },
  { emoji: "🍻", title: "Sosialt", desc: "Alle drikker én slurk før de kaster.", drink: true },
  { emoji: "🌀", title: "Karusell-drivet", desc: "Snurr 3 ganger rundt deg selv rett før utkastet.", drink: false },
  { emoji: "🏴‍☠️", title: "Sjørøveren", desc: "Spill hele hullet med ett øye tildekket.", drink: false },
  { emoji: "🦖", title: "T-Rex", desc: "Overarmene klistret inntil brystet – kun underarm og håndledd på alle kast.", drink: false },
  { emoji: "🌀", title: "Roller-påbud", desc: "Utkastet MÅ kastes som en roller.", drink: false },
  { emoji: "🥞", title: "Pannekaken", desc: "Alle kast utføres med disken opp-ned.", drink: false },
  { emoji: "🪃", title: "Overhånds-galskap", desc: "Alle kast over 15 m må kastes over hodet (tomahawk eller thumber).", drink: false },
  { emoji: "🧎", title: "Knestående sersjant", desc: "Minst ett kne i bakken på hvert kast.", drink: false },
  { emoji: "🍕", title: "Pizza-putten", desc: "Turbo-putt påbudt innenfor 15 meter.", drink: false },
  { emoji: "😰", title: "Putter-marerittet", desc: "Kun putter tillatt hele hullet.", drink: false },
  { emoji: "🐸", title: "Froske-kast", desc: "Alle kast utføres fra huk-posisjon.", drink: false },
  { emoji: "👑", title: "Brudgommens diktatur", desc: "Brudgommen bestemmer disc og kastestil for alle på dette hullet.", drink: false },
  { emoji: "🥂", title: "Skål for brudgommen!", desc: "Hev glasset for brudgommen – og spill så et helt normalt hull.", drink: true },

  /* --- Forslag fra Claude (slett det du ikke liker) --- */
  { emoji: "🤐", title: "Stillhet på teen", desc: "Ingen får snakke under hele hullet. Brudd = en slurk.", drink: true },
  { emoji: "🎤", title: "Kommentatoren", desc: "Spiller til høyre må kommentere alle kastene dine som en proff-sending.", drink: false },
  { emoji: "🤝", title: "Siamesisk kast", desc: "Spill i par – dere må holde i hverandre med én hånd når dere kaster.", drink: false },
  { emoji: "🔁", title: "Mulligan-marerittet", desc: "Alle MÅ kaste utkastet om igjen og bruke det dårligste av de to.", drink: false },
  { emoji: "🎯", title: "Nærmest vinner", desc: "Den som er lengst unna kurven etter utkastet drikker en slurk.", drink: true },
  { emoji: "🦶", title: "Flamingoen", desc: "Stå på ett bein gjennom hele utkastet – mister du balansen, kast på nytt.", drink: false },
  { emoji: "👟", title: "Rakettfot", desc: "Du må ta full tilløp (run-up) på alle kast, også putt.", drink: false },
  { emoji: "🗣️", title: "Heiagjengen", desc: "Alle MÅ rope «BRUDGOM!» i det disken slippes – ellers en slurk.", drink: true },
];
