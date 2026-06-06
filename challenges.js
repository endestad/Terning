/**
 * Diskgolf-terningen – utfordringer / aktiviteter
 *
 * Vil du legge til eller endre? Bare rediger lista under.
 *   emoji  – ikonet som vises
 *   title  – kort navn på utfordringen
 *   desc   – forklaring av regelen
 *   drink  – true hvis det er en drikke-utfordring (kan skrus av i appen)
 *   schedule – (valgfritt) { notBefore, by } = kortet kommer tidligst etter
 *              `notBefore` trillinger, og garanteres senest på trilling `by`.
 *              Telles per økt. Utelat notBefore for å tillate fra første trilling.
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
  { emoji: "🔁", title: "Mulligan-marerittet", desc: "Alle MÅ kaste utkastet om igjen og bruke det dårligste av de to.", drink: false },
  { emoji: "🦶", title: "Flamingoen", desc: "Stå på ett bein gjennom hele utkastet – mister du balansen, kast på nytt.", drink: false },
  { emoji: "👟", title: "Rakettfot", desc: "Du må ta full tilløp (run-up) på alle kast, også putt.", drink: false, schedule: { by: 15 } },
  { emoji: "🗣️", title: "Heiagjengen", desc: "Alle MÅ rope «BRUDGOM!» i det disken slippes – ellers en slurk.", drink: true },
  { emoji: "💫", title: "360-kast", desc: "Spinn en hel runde (360°) i det du kaster. Gjelder alle kast unntatt putt.", drink: false },
  { emoji: "⏱️", title: "Speedgolf", desc: "Maks 8 sekunder fra du plukker opp disken til du kaster – ellers omkast.", drink: false },
  { emoji: "🤾", title: "Hopp-kast", desc: "Begge føtter må være i lufta i det disken slippes. Gjelder også putt.", drink: false },
  { emoji: "🤙", title: "Forehand-fest", desc: "Alle kast må være forehand (flick) hele hullet.", drink: false },
  { emoji: "👞", title: "Feil fot frem", desc: "Du må stå med «feil» fot fremst på alle kast.", drink: false },
  { emoji: "📣", title: "Selvskryt", desc: "Erik må annonsere seg selv som verdensmester før hvert utkast – ellers en slurk.", drink: true, schedule: { by: 15 } },
  { emoji: "📞", title: "Erik ringer Ingrid", desc: "Erik må ringe Ingrid og fortelle hvor dyktig han er i dag med kastingen. Må være genuint – ellers straffedrikk.", drink: true, schedule: { notBefore: 5, by: 12 } },
];
