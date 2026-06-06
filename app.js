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

  let rolling = false;
  let lastIndex = -1;
  let rollCount = 0;

  // Planlagte utfordringer (scheduled: true): skal ikke komme på de
  // SCHED_NOT_BEFORE første trillingene, men garanteres senest på SCHED_GUARANTEE_BY.
  const SCHED_NOT_BEFORE = 5;
  const SCHED_GUARANTEE_BY = 12;
  const schedState = CHALLENGES.filter((c) => c.scheduled).map((c) => ({
    challenge: c,
    // Tilfeldig mål-trilling i intervallet [SCHED_NOT_BEFORE + 1, SCHED_GUARANTEE_BY].
    target: SCHED_NOT_BEFORE + 1 + Math.floor(Math.random() * (SCHED_GUARANTEE_BY - SCHED_NOT_BEFORE)),
    shown: false,
  }));

  /** Returnerer aktive utfordringer basert på drikke-bryteren. */
  function activePool() {
    return CHALLENGES.filter((c) => drinkToggle.checked || !c.drink);
  }

  /** Trekker en tilfeldig utfordring, med hensyn til planlagte og gjentakelser. */
  function pickChallenge() {
    rollCount++;
    const pool = activePool();
    if (pool.length === 0) return null;

    // 1) Må en planlagt utfordring tvinges frem nå?
    for (const s of schedState) {
      if (!s.shown && rollCount >= s.target && pool.includes(s.challenge)) {
        s.shown = true;
        lastIndex = CHALLENGES.indexOf(s.challenge);
        return s.challenge;
      }
    }

    // 2) Vanlig trekk. Planlagte utfordringer holdes utenfor de første trillingene.
    let candidates = pool.filter((c) => {
      const s = schedState.find((x) => x.challenge === c);
      return !s || rollCount > SCHED_NOT_BEFORE;
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
