(function () {
  "use strict";

  const card = document.getElementById("card");
  const cardEmoji = document.getElementById("cardEmoji");
  const cardNumber = document.getElementById("cardNumber");
  const cardTitle = document.getElementById("cardTitle");
  const cardDesc = document.getElementById("cardDesc");
  const rollBtn = document.getElementById("rollBtn");
  const drinkToggle = document.getElementById("drinkToggle");
  const noRepeatToggle = document.getElementById("noRepeatToggle");
  const listEl = document.getElementById("challengeList");
  const countEl = document.getElementById("count");
  const rollCounterEl = document.getElementById("rollCounter");
  const resetBtn = document.getElementById("resetBtn");

  let rolling = false;
  let lastIndex = -1;
  let rollCount = 0;

  // Planlagte utfordringer (c.schedule = { notBefore, by }): kommer tidligst etter
  // `notBefore` trillinger og garanteres senest på trilling `by`.
  let schedState = [];
  function buildSchedule() {
    schedState = CHALLENGES.filter((c) => c.schedule).map((c) => {
      const notBefore = c.schedule.notBefore || 0;
      const by = c.schedule.by;
      return {
        challenge: c,
        notBefore: notBefore,
        by: by,
        // Tilfeldig mål-trilling i intervallet [notBefore + 1, by].
        target: notBefore + 1 + Math.floor(Math.random() * (by - notBefore)),
        shown: false,
      };
    });
  }
  buildSchedule();

  /** Returnerer aktive utfordringer basert på drikke-bryteren. */
  function activePool() {
    return CHALLENGES.filter((c) => drinkToggle.checked || !c.drink);
  }

  /**
   * Velger hvilket planlagt kort som evt. må tvinges frem på denne trillingen.
   * Beregner seneste mulige trilling (latestForce) per kort ut fra fristene, slik
   * at flere kort med samme frist ikke kolliderer og sklir forbi garantien.
   */
  function forcedScheduled(pool) {
    const pending = schedState
      .filter((s) => !s.shown && pool.includes(s.challenge))
      .sort((a, b) => a.by - b.by || a.target - b.target);
    if (!pending.length) return null;

    // Seneste trilling hvert kort kan tvinges på, regnet bakfra (distinkte trillinger).
    let nextLatest = Infinity;
    for (let i = pending.length - 1; i >= 0; i--) {
      pending[i].latestForce = Math.min(pending[i].by, nextLatest - 1);
      nextLatest = pending[i].latestForce;
    }

    // Tvinges hvis vi har nådd kortets tilfeldige mål ELLER dets seneste frist.
    const due = pending.filter(
      (s) => rollCount > s.notBefore && rollCount >= Math.min(s.target, s.latestForce)
    );
    if (!due.length) return null;
    due.sort((a, b) => a.latestForce - b.latestForce || a.by - b.by || a.target - b.target);
    return due[0];
  }

  /** Trekker en tilfeldig utfordring, med hensyn til planlagte og gjentakelser. */
  function pickChallenge() {
    rollCount++;
    const pool = activePool();
    if (pool.length === 0) return null;

    // 1) Må et planlagt kort tvinges frem nå?
    const forced = forcedScheduled(pool);
    if (forced) {
      forced.shown = true;
      lastIndex = CHALLENGES.indexOf(forced.challenge);
      return forced.challenge;
    }

    // 2) Vanlig trekk. Planlagte kort holdes utenfor sitt eget notBefore-vindu.
    let candidates = pool.filter((c) => {
      const s = schedState.find((x) => x.challenge === c);
      return !s || rollCount > s.notBefore;
    });
    if (candidates.length === 0) candidates = pool;

    let pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (noRepeatToggle.checked && candidates.length > 1) {
      let guard = 0;
      while (pick === CHALLENGES[lastIndex] && guard < 20) {
        pick = candidates[Math.floor(Math.random() * candidates.length)];
        guard++;
      }
    }

    const s = schedState.find((x) => x.challenge === pick);
    if (s) s.shown = true;
    lastIndex = CHALLENGES.indexOf(pick);
    return pick;
  }

  function showChallenge(c) {
    const num = CHALLENGES.indexOf(c) + 1;
    cardEmoji.textContent = c.emoji;
    cardNumber.textContent = "#" + num;
    cardTitle.textContent = c.title;
    cardDesc.textContent = c.desc;
    card.classList.toggle("card--drink", !!c.drink);
  }

  function roll() {
    if (rolling) return;
    const pool = activePool();
    if (pool.length === 0) return;
    rolling = true;
    rollBtn.disabled = true;
    card.classList.remove("card--idle", "card--reveal");

    // Rask "shuffle" gjennom tilfeldige utfordringer før resultatet låses.
    const shuffleMs = 90;
    const totalMs = 850;
    const start = performance.now();

    const shuffle = setInterval(() => {
      const peek = pool[Math.floor(Math.random() * pool.length)];
      cardEmoji.textContent = peek.emoji;
      cardTitle.textContent = peek.title;
      cardDesc.textContent = "";
      cardNumber.textContent = "";
      card.classList.add("card--shuffle");
      if (performance.now() - start >= totalMs) {
        clearInterval(shuffle);
        card.classList.remove("card--shuffle");
        const result = pickChallenge();
        showChallenge(result);
        rollCounterEl.textContent = rollCount;
        card.classList.add("card--reveal");
        rolling = false;
        rollBtn.disabled = false;
        if (navigator.vibrate) navigator.vibrate(60);
      }
    }, shuffleMs);
  }

  function renderList() {
    listEl.innerHTML = "";
    CHALLENGES.forEach((c, i) => {
      const li = document.createElement("li");
      li.className = "challenge-list__item" + (c.drink ? " is-drink" : "");
      li.innerHTML =
        '<span class="cl-num">' + (i + 1) + "</span>" +
        '<span class="cl-emoji">' + c.emoji + "</span>" +
        '<span class="cl-body"><strong>' + c.title + "</strong>" +
        "<span>" + c.desc + "</span></span>";
      listEl.appendChild(li);
    });
    countEl.textContent = CHALLENGES.length;
  }

  /** Nullstiller telleren og planlegger de planlagte kortene på nytt. */
  function resetCounter() {
    if (rollCount === 0) return;
    if (!window.confirm("Resette telleren? Planlagte utfordringer (f.eks. Erik ringer Ingrid) starter på nytt.")) return;
    rollCount = 0;
    lastIndex = -1;
    buildSchedule();
    rollCounterEl.textContent = "0";
    cardEmoji.textContent = "🎲";
    cardNumber.textContent = "";
    cardTitle.textContent = "Klar for utfordring?";
    cardDesc.textContent = "Trykk på knappen for å trille terningen.";
    card.classList.remove("card--drink", "card--reveal");
    card.classList.add("card--idle");
  }

  resetBtn.addEventListener("click", resetCounter);
  rollBtn.addEventListener("click", roll);
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      if (document.activeElement === drinkToggle || document.activeElement === noRepeatToggle) return;
      e.preventDefault();
      roll();
    }
  });

  renderList();
})();
