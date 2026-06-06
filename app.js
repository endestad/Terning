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

  // Editor-elementer
  const editBtn = document.getElementById("editBtn");
  const editor = document.getElementById("editor");
  const editorRows = document.getElementById("editorRows");
  const editorClose = document.getElementById("editorClose");
  const editorCancel = document.getElementById("editorCancel");
  const editorSave = document.getElementById("editorSave");
  const editorAdd = document.getElementById("editorAdd");
  const editorReset = document.getElementById("editorReset");

  let rolling = false;
  let lastIndex = -1;
  let rollCount = 0;

  // ---------------------------------------------------------------------------
  // Lagring (localStorage som "backend" for denne statiske siden)
  //   store.edits  – endringer/skjul på standardkortene, nøklet på "d<index>"
  //   store.custom – nye kort lagt til av brukeren
  // Standardlista i challenges.js endres aldri.
  // ---------------------------------------------------------------------------
  const STORE_KEY = "terning_overrides_v1";

  function loadStore() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
      return { edits: s.edits || {}, custom: s.custom || [] };
    } catch (e) {
      return { edits: {}, custom: [] };
    }
  }
  function saveStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (e) {
      /* localStorage utilgjengelig – endringer holder for denne økten */
    }
  }
  let store = loadStore();

  // Effektiv liste = standardkort (med evt. overstyringer) + egne kort.
  let challenges = [];
  function buildChallenges() {
    challenges = [];
    CHALLENGES.forEach((c, i) => {
      const id = "d" + i;
      const ov = store.edits[id] || {};
      challenges.push({
        id: id,
        emoji: ov.emoji !== undefined ? ov.emoji : c.emoji,
        title: ov.title !== undefined ? ov.title : c.title,
        desc: ov.desc !== undefined ? ov.desc : c.desc,
        drink: ov.drink !== undefined ? ov.drink : !!c.drink,
        hidden: !!ov.hidden,
        schedule: c.schedule || null,
      });
    });
    store.custom.forEach((c) => {
      challenges.push({
        id: c.id,
        emoji: c.emoji,
        title: c.title,
        desc: c.desc,
        drink: !!c.drink,
        hidden: !!c.hidden,
        schedule: null,
      });
    });
    challenges.forEach((c, i) => (c.no = i + 1));
  }

  /** Synlige kort (ikke skjult). */
  function visible() {
    return challenges.filter((c) => !c.hidden);
  }

  // ---------------------------------------------------------------------------
  // Planlegging (c.schedule = { notBefore, by })
  // ---------------------------------------------------------------------------
  let schedState = [];
  function buildSchedule() {
    schedState = challenges
      .filter((c) => c.schedule && !c.hidden)
      .map((c) => {
        const notBefore = c.schedule.notBefore || 0;
        const by = c.schedule.by;
        return {
          challenge: c,
          notBefore: notBefore,
          by: by,
          target: notBefore + 1 + Math.floor(Math.random() * (by - notBefore)),
          shown: false,
        };
      });
  }

  /** Aktive kort basert på drikke-bryteren (kun synlige). */
  function activePool() {
    return visible().filter((c) => drinkToggle.checked || !c.drink);
  }

  /**
   * Velger hvilket planlagt kort som evt. må tvinges frem på denne trillingen.
   * Beregner seneste mulige trilling (latestForce) per kort, slik at flere kort
   * med samme frist ikke kolliderer og sklir forbi garantien.
   */
  function forcedScheduled(pool) {
    const pending = schedState
      .filter((s) => !s.shown && pool.includes(s.challenge))
      .sort((a, b) => a.by - b.by || a.target - b.target);
    if (!pending.length) return null;

    let nextLatest = Infinity;
    for (let i = pending.length - 1; i >= 0; i--) {
      pending[i].latestForce = Math.min(pending[i].by, nextLatest - 1);
      nextLatest = pending[i].latestForce;
    }

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

    const forced = forcedScheduled(pool);
    if (forced) {
      forced.shown = true;
      lastIndex = challenges.indexOf(forced.challenge);
      return forced.challenge;
    }

    let candidates = pool.filter((c) => {
      const s = schedState.find((x) => x.challenge === c);
      return !s || rollCount > s.notBefore;
    });
    if (candidates.length === 0) candidates = pool;

    let pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (noRepeatToggle.checked && candidates.length > 1) {
      let guard = 0;
      while (pick === challenges[lastIndex] && guard < 20) {
        pick = candidates[Math.floor(Math.random() * candidates.length)];
        guard++;
      }
    }

    const s = schedState.find((x) => x.challenge === pick);
    if (s) s.shown = true;
    lastIndex = challenges.indexOf(pick);
    return pick;
  }

  function showChallenge(c) {
    cardEmoji.textContent = c.emoji;
    cardNumber.textContent = "#" + c.no;
    cardTitle.textContent = c.title;
    cardDesc.textContent = c.desc;
    card.classList.toggle("card--drink", !!c.drink);
  }

  function setIdleCard() {
    cardEmoji.textContent = "🎲";
    cardNumber.textContent = "";
    cardTitle.textContent = "Klar for utfordring?";
    cardDesc.textContent = "Trykk på knappen for å trille terningen.";
    card.classList.remove("card--drink", "card--reveal");
    card.classList.add("card--idle");
  }

  function roll() {
    if (rolling) return;
    const pool = activePool();
    if (pool.length === 0) return;
    rolling = true;
    rollBtn.disabled = true;
    card.classList.remove("card--idle", "card--reveal");

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
    const vis = visible();
    vis.forEach((c) => {
      const li = document.createElement("li");
      li.className = "challenge-list__item" + (c.drink ? " is-drink" : "");
      const num = document.createElement("span");
      num.className = "cl-num";
      num.textContent = c.no;
      const emoji = document.createElement("span");
      emoji.className = "cl-emoji";
      emoji.textContent = c.emoji;
      const body = document.createElement("span");
      body.className = "cl-body";
      const strong = document.createElement("strong");
      strong.textContent = c.title;
      const span = document.createElement("span");
      span.textContent = c.desc;
      body.appendChild(strong);
      body.appendChild(span);
      li.appendChild(num);
      li.appendChild(emoji);
      li.appendChild(body);
      listEl.appendChild(li);
    });
    countEl.textContent = vis.length;
  }

  /** Bygger alt på nytt etter en endring i datagrunnlaget. */
  function rebuild() {
    buildChallenges();
    buildSchedule();
    renderList();
  }

  /** Nullstiller telleren og planlegger de planlagte kortene på nytt. */
  function resetCounter() {
    if (rollCount === 0) return;
    if (!window.confirm("Resette telleren? Planlagte utfordringer (f.eks. Erik ringer Ingrid) starter på nytt.")) return;
    rollCount = 0;
    lastIndex = -1;
    buildSchedule();
    rollCounterEl.textContent = "0";
    setIdleCard();
  }

  // ---------------------------------------------------------------------------
  // Editor
  // ---------------------------------------------------------------------------
  function makeRow(item) {
    const row = document.createElement("div");
    row.className = "er-row";
    row.dataset.id = item.id;

    const emoji = document.createElement("input");
    emoji.className = "er-emoji";
    emoji.type = "text";
    emoji.value = item.emoji || "";
    emoji.maxLength = 4;
    emoji.setAttribute("aria-label", "Emoji");

    const title = document.createElement("input");
    title.className = "er-title";
    title.type = "text";
    title.value = item.title || "";
    title.placeholder = "Tittel";
    title.setAttribute("aria-label", "Tittel");

    const desc = document.createElement("textarea");
    desc.className = "er-desc";
    desc.rows = 2;
    desc.value = item.desc || "";
    desc.placeholder = "Beskrivelse / regel";
    desc.setAttribute("aria-label", "Beskrivelse");

    const meta = document.createElement("div");
    meta.className = "er-meta";

    const drinkLabel = document.createElement("label");
    drinkLabel.className = "er-check";
    const drink = document.createElement("input");
    drink.className = "er-drink";
    drink.type = "checkbox";
    drink.checked = !!item.drink;
    drinkLabel.appendChild(drink);
    drinkLabel.appendChild(document.createTextNode(" 🍺 Drikke"));

    const showLabel = document.createElement("label");
    showLabel.className = "er-check";
    const show = document.createElement("input");
    show.className = "er-show";
    show.type = "checkbox";
    show.checked = !item.hidden;
    showLabel.appendChild(show);
    showLabel.appendChild(document.createTextNode(" 👁️ Vis"));

    meta.appendChild(drinkLabel);
    meta.appendChild(showLabel);

    if (item.schedule) {
      const badge = document.createElement("span");
      badge.className = "er-badge";
      const nb = item.schedule.notBefore || 0;
      badge.textContent = nb
        ? "🗓️ trilling " + (nb + 1) + "–" + item.schedule.by
        : "🗓️ innen trilling " + item.schedule.by;
      meta.appendChild(badge);
    }

    function syncDim() {
      row.classList.toggle("er-row--hidden", !show.checked);
    }
    show.addEventListener("change", syncDim);
    syncDim();

    row.appendChild(emoji);
    row.appendChild(title);
    row.appendChild(desc);
    row.appendChild(meta);
    return row;
  }

  function renderEditor() {
    editorRows.innerHTML = "";
    challenges.forEach((c) => editorRows.appendChild(makeRow(c)));
  }

  function openEditor() {
    renderEditor();
    editor.hidden = false;
    document.body.classList.add("no-scroll");
  }
  function closeEditor() {
    editor.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function addBlankRow() {
    const id = "c" + Date.now() + Math.floor(Math.random() * 1000);
    const row = makeRow({ id: id, emoji: "🎲", title: "", desc: "", drink: false, hidden: false });
    editorRows.appendChild(row);
    row.querySelector(".er-title").focus();
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function saveEditor() {
    const newEdits = {};
    const newCustom = [];
    editorRows.querySelectorAll(".er-row").forEach((row) => {
      const id = row.dataset.id;
      const emoji = row.querySelector(".er-emoji").value.trim() || "🎲";
      const title = row.querySelector(".er-title").value.trim();
      const desc = row.querySelector(".er-desc").value.trim();
      const drink = row.querySelector(".er-drink").checked;
      const hidden = !row.querySelector(".er-show").checked;

      if (id[0] === "d") {
        const i = parseInt(id.slice(1), 10);
        const def = CHALLENGES[i];
        if (!def) return;
        const t = title || def.title;
        const d = desc || def.desc;
        const changed =
          emoji !== def.emoji || t !== def.title || d !== def.desc || drink !== !!def.drink || hidden;
        if (changed) newEdits[id] = { emoji: emoji, title: t, desc: d, drink: drink, hidden: hidden };
      } else {
        // Egne kort: tom tittel = forkast raden (her er sletting greit).
        if (!title) return;
        newCustom.push({ id: id, emoji: emoji, title: title, desc: desc, drink: drink, hidden: hidden });
      }
    });
    store.edits = newEdits;
    store.custom = newCustom;
    saveStore();
    rebuild();
    closeEditor();
  }

  function resetToDefaults() {
    if (!window.confirm("Tilbakestille alle utfordringer til standard? Dine endringer og egne kort fjernes.")) return;
    store = { edits: {}, custom: [] };
    saveStore();
    rebuild();
    renderEditor();
  }

  // ---------------------------------------------------------------------------
  // Hendelser
  // ---------------------------------------------------------------------------
  resetBtn.addEventListener("click", resetCounter);
  rollBtn.addEventListener("click", roll);
  editBtn.addEventListener("click", openEditor);
  editorClose.addEventListener("click", closeEditor);
  editorCancel.addEventListener("click", closeEditor);
  editorSave.addEventListener("click", saveEditor);
  editorAdd.addEventListener("click", addBlankRow);
  editorReset.addEventListener("click", resetToDefaults);
  editor.addEventListener("click", (e) => {
    if (e.target === editor) closeEditor();
  });

  document.addEventListener("keydown", (e) => {
    if (!editor.hidden) {
      if (e.code === "Escape") closeEditor();
      return;
    }
    if (e.code === "Space" || e.code === "Enter") {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      e.preventDefault();
      roll();
    }
  });

  rebuild();
  setIdleCard();
})();
