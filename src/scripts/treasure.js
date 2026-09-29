"use strict";

(() => {
  let mounted = false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string" || typeof text === "number") el.textContent = String(text);
    return el;
  };
  const button = (className, text) => { const el = make("button", className, text); el.type = "button"; return el; };
  async function animate(el, frames, duration) {
    const final = frames[frames.length - 1];
    if (reduced.matches || !el.animate) { Object.assign(el.style, final); return; }
    const animation = el.animate(frames, { duration, easing: "ease-in-out", fill: "forwards" });
    const finish = () => { if (reduced.matches) animation.finish(); };
    reduced.addEventListener("change", finish);
    try { await animation.finished; }
    finally { reduced.removeEventListener("change", finish); Object.assign(el.style, final); animation.cancel(); }
  }
  const show = (el, ms = 700) => animate(el, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], ms);
  const hide = (el, ms = 700) => animate(el, [{ opacity: 1 }, { opacity: 0 }], ms);
  const anchor = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="4" r="2" stroke="currentColor"/><path d="M12 6v15M7 9h10M4 13c0 10 16 10 16 0M4 13l-2 3m2-3 3 2m13-2 2 3m-2-3-3 2" stroke="currentColor"/></svg>`;
  function route(complete = false) {
    const el = make("div", "treasure-route");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", complete ? "Ruta del viaje completada" : "Ruta del viaje: último tramo");
    if (complete) el.dataset.complete = "";
    el.innerHTML = `${anchor}<b></b><i></i><b></b><i></i><b></b><i></i><b></b><em></em>`;
    return el;
  }
  function photo(container, config, className, fallback) {
    if (typeof config.image !== "string" || !config.image.trim()) return;
    const image = make("img", className);
    image.alt = config.alt || "";
    image.hidden = true;
    image.decoding = "async";
    // Only two optional images, requested when their chapter is revealed.
    image.addEventListener("load", () => { image.hidden = false; if (fallback) fallback.hidden = true; }, { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
    container.append(image);
    image.src = config.image;
  }

  async function start() {
    const host = document.querySelector("#treasure");
    if (mounted || !host) return;
    mounted = true;
    const content = window.YADIRA_CONTENT.treasure;
    const scene = make("article", "treasure-story");
    scene.tabIndex = -1;
    scene.setAttribute("aria-label", "The Treasure");
    scene.dataset.phase = "arriving";
    const prelude = make("div", "treasure-prelude");
    const zoro = make("section", "treasure-section treasure-zoro");
    zoro.setAttribute("aria-labelledby", "treasure-zoro-title");
    zoro.append(route());
    const swords = make("div", "treasure-swords");
    swords.setAttribute("aria-hidden", "true");
    swords.innerHTML = `<svg viewBox="0 0 150 150" fill="none"><circle cx="75" cy="75" r="60" stroke="currentColor" opacity=".12"/><g stroke="currentColor" stroke-width="1.4"><g transform="rotate(-26 75 75)"><path d="M72 104V27L75 15L78 27V104Z" fill="#99ad8030"/><path d="M66 103H84M72 111H78M72 117H78M72 123H78M72 129H78M72 103V135H78V103"/></g><g transform="rotate(26 75 75)"><path d="M72 104V27L75 15L78 27V104Z" fill="#99ad8030"/><path d="M66 103H84M72 111H78M72 117H78M72 123H78M72 129H78M72 103V135H78V103"/></g><path d="M72 102V22L75 8L78 22V102Z" fill="#bbcaa045"/><path d="M65 102H85M72 108H78M72 114H78M72 120H78M72 126H78M72 102V138H78V102"/></g></svg>`;
    const zoroTitle = make("h2", "", content.zoro.title);
    const emblem = make("div", "treasure-zoro-emblem");
    emblem.setAttribute("aria-hidden", "true");
    photo(emblem, content.zoro, "treasure-zoro-image", swords);
    zoroTitle.id = "treasure-zoro-title";
    const find = button("treasure-button treasure-find", content.zoro.find);
    const searchStatus = make("p", "treasure-search-status");
    searchStatus.setAttribute("role", "status");
    const spinner = make("div", "treasure-search-ring");
    spinner.hidden = true;
    spinner.setAttribute("aria-hidden", "true");
    const gag = make("div", "treasure-zoro-result");
    gag.hidden = true;
    gag.setAttribute("role", "status");
    gag.append(make("h3", "", content.zoro.error), make("p", "", content.zoro.lost));
    const clue = make("p", "", content.zoro.clue);
    clue.hidden = true;
    gag.append(clue);
    zoro.append(swords, emblem, zoroTitle, make("p", "treasure-zoro-intro", content.zoro.message), find, spinner, searchStatus, gag);

    const wanted = make("section", "treasure-section treasure-wanted");
    wanted.hidden = true;
    wanted.tabIndex = -1;
    wanted.setAttribute("aria-label", `${content.wanted.title} ${content.wanted.name}`);
    const paper = make("div", "wanted-paper");
    if (content.wanted.template) {
      const template = make("img", "wanted-template");
      template.alt = "";
      template.setAttribute("aria-hidden", "true");
      template.addEventListener("load", () => {
        paper.dataset.template = "";
        if (content.wanted.title === "WANTED") paper.dataset.printedTitle = "";
      }, { once: true });
      template.addEventListener("error", () => template.remove(), { once: true });
      template.src = content.wanted.template;
      paper.append(template);
    }
    const portrait = make("div", "wanted-portrait");
    const monogram = make("div", "wanted-monogram", content.wanted.monogram);
    monogram.setAttribute("aria-hidden", "true");
    portrait.append(monogram);
    const reward = make("p", "wanted-reward", content.wanted.reward);
    reward.append(make("small", "", content.wanted.currency));
    paper.append(make("h2", "wanted-title", content.wanted.title), make("p", "wanted-notice", content.wanted.notice), portrait,
      make("h3", "wanted-name", content.wanted.name), make("p", "wanted-subtitle", content.wanted.subtitle), reward);
    if (content.wanted.crime) paper.append(make("p", "wanted-crime", content.wanted.crime));
    wanted.append(paper);

    const mail = make("section", "treasure-section treasure-mail");
    mail.hidden = true;
    mail.setAttribute("aria-labelledby", "treasure-mail-title");
    const mailTitle = make("h2", "treasure-mail-label", content.letter.introduction);
    mailTitle.id = "treasure-mail-title";
    const envelope = make("div", "treasure-envelope");
    envelope.setAttribute("aria-hidden", "true");
    envelope.innerHTML = `<div class="treasure-envelope-sheet"></div><div class="treasure-envelope-flap"></div><div class="treasure-seal"></div>`;
    envelope.querySelector(".treasure-seal").textContent = content.wanted.monogram;
    const open = button("treasure-button treasure-open-letter", content.letter.open);
    open.setAttribute("aria-expanded", "false");
    open.setAttribute("aria-controls", "treasure-letter");
    const letter = make("div", "treasure-letter");
    letter.id = "treasure-letter";
    letter.tabIndex = -1;
    letter.hidden = true;
    letter.setAttribute("role", "region");
    letter.setAttribute("aria-labelledby", "treasure-letter-title");
    const letterTitle = make("h3", "", content.letter.title);
    letterTitle.id = "treasure-letter-title";
    letter.append(letterTitle);
    content.letter.body.forEach(text => { if (typeof text === "string" && text.trim()) letter.append(make("p", "", text)); });
    const letterActions = make("div", "treasure-letter-actions");
    const toBirthday = button("treasure-button treasure-letter-continue", content.letter.continue);
    const closeLetter = button("treasure-quiet treasure-close-letter", content.letter.close);
    letterActions.append(toBirthday, closeLetter);
    letter.append(letterActions);
    mail.append(mailTitle, envelope, open, letter);
    prelude.append(zoro, wanted, mail);

    const birthday = make("section", "treasure-section treasure-birthday");
    birthday.hidden = true;
    birthday.tabIndex = -1;
    birthday.setAttribute("aria-labelledby", "treasure-birthday-title");
    const age = make("p", "treasure-age", content.birthday.age);
    const birthdayName = make("p", "treasure-birthday-name", content.birthday.name);
    const birthdayTitle = make("h2", "treasure-birthday-title", content.birthday.title);
    birthdayTitle.id = "treasure-birthday-title";
    const cake = button("treasure-cake");
    cake.disabled = true;
    cake.setAttribute("aria-label", content.birthday.instruction);
    cake.innerHTML = `<span class="cake-aura" aria-hidden="true"></span><span class="cake-plate" aria-hidden="true"></span><span class="cake-body" aria-hidden="true"></span><span class="cake-top-tier" aria-hidden="true"></span><span class="cake-pearls" aria-hidden="true"></span><span class="cake-candles" aria-hidden="true"></span><span class="cake-sparks" aria-hidden="true"><i>✧</i><i>✧</i><i>✧</i><i>✧</i></span>`;
    for (const digit of String(content.birthday.age)) {
      const candle = make("span", "cake-candle", digit);
      candle.append(make("i", "cake-flame"), make("i", "cake-smoke"));
      cake.querySelector(".cake-candles").append(candle);
    }
    const instruction = make("p", "treasure-instruction", content.birthday.instruction);
    const wish = make("p", "treasure-wish");
    wish.setAttribute("role", "status");
    const fireworks = make("div", "treasure-fireworks");
    fireworks.setAttribute("aria-hidden", "true");
    // Three short bursts, 36 rays total. No canvas loop or recurring timers.
    for (let burst = 0; burst < 3; burst++) {
      const bloom = make("span", "treasure-firework");
      for (let ray = 0; ray < 12; ray++) {
        const spark = make("i");
        spark.style.setProperty("--angle", `${ray * 30}deg`);
        bloom.append(spark);
      }
      fireworks.append(bloom);
    }
    birthday.append(fireworks, age, birthdayName, birthdayTitle, cake, instruction, wish);

    const ending = make("section", "treasure-section treasure-ending");
    ending.tabIndex = -1;
    ending.hidden = true;
    ending.setAttribute("aria-label", content.ending.name);
    const endingPhoto = make("div", "treasure-ending-portrait");
    const lines = make("div", "treasure-ending-lines");
    content.ending.lines.forEach(text => lines.append(make("p", "", text)));
    const signature = make("footer", "treasure-signature", content.ending.signature);
    signature.append(make("strong", "", content.ending.author), make("small", "", content.ending.year));
    const restart = button("treasure-quiet treasure-restart", content.ending.restart);
    restart.addEventListener("click", () => { restart.disabled = true; window.location.reload(); }, { once: true });
    ending.append(route(true), endingPhoto, lines, make("p", "treasure-ending-birthday", content.ending.birthday),
      make("h2", "treasure-ending-name", content.ending.name), make("p", "treasure-ending-date", content.ending.date), signature,
      make("p", "treasure-continued", content.ending.continued), restart);
    scene.append(prelude, birthday, ending);
    host.append(scene);

    let searching = false;
    find.addEventListener("click", async () => {
      if (searching) return;
      searching = true;
      find.disabled = true;
      scene.dataset.phase = "searching";
      spinner.hidden = false;
      searchStatus.textContent = content.zoro.searching;
      await wait(1100);
      spinner.hidden = true;
      searchStatus.textContent = "";
      find.hidden = true;
      gag.hidden = false;
      await show(gag, 600);
      scene.dataset.phase = "lost";
      await wait(800);
      clue.hidden = false;
      await show(clue, 550);
      await wait(500);
      wanted.hidden = false;
      mail.hidden = false;
      photo(portrait, content.wanted, "wanted-photo", monogram);
      // Reveal during the scroll, then mark the poster ready once both have settled.
      wanted.focus({ preventScroll: true });
      wanted.scrollIntoView({ block: "start", behavior: reduced.matches ? "instant" : "smooth" });
      await show(wanted, 1000);
      scene.dataset.phase = "wanted";
    }, { once: true });

    let letterBusy = false;
    let letterOpened = false;
    open.addEventListener("click", async () => {
      if (letterBusy || letterOpened) return;
      letterBusy = true;
      letterOpened = true;
      open.disabled = true;
      toBirthday.disabled = true;
      closeLetter.disabled = true;
      open.setAttribute("aria-expanded", "true");
      scene.dataset.phase = "opening-letter";
      await hide(envelope.querySelector(".treasure-seal"), 250);
      await animate(envelope.querySelector(".treasure-envelope-flap"), [{ transform: "rotateX(0deg)" }, { transform: "rotateX(175deg)" }], 600);
      await animate(envelope.querySelector(".treasure-envelope-sheet"), [{ transform: "translateY(0)" }, { transform: "translateY(-35px)" }], 400);
      envelope.hidden = true;
      open.hidden = true;
      letter.hidden = false;
      await show(letter, 700);
      letter.focus({ preventScroll: true });
      letter.scrollIntoView({ block: "start", behavior: reduced.matches ? "instant" : "smooth" });
      // With instant transitions, ignore the tail of a double tap on the old control.
      if (reduced.matches) await wait(300);
      toBirthday.disabled = false;
      closeLetter.disabled = false;
      letterBusy = false;
      scene.dataset.phase = "letter";
    });
    function close() {
      if (letterBusy || !letterOpened || scene.dataset.phase !== "letter") return;
      letterOpened = false;
      letter.hidden = true;
      envelope.hidden = false;
      envelope.querySelectorAll("[style]").forEach(el => el.removeAttribute("style"));
      open.hidden = false;
      open.disabled = false;
      open.setAttribute("aria-expanded", "false");
      open.focus();
      scene.dataset.phase = "wanted";
    }
    closeLetter.addEventListener("click", close);
    const onEscape = event => { if (event.key === "Escape" && scene.dataset.phase === "letter") close(); };
    document.addEventListener("keydown", onEscape);
    let birthdayStarted = false;
    toBirthday.addEventListener("click", async () => {
      if (birthdayStarted || letterBusy) return;
      birthdayStarted = true;
      toBirthday.disabled = true;
      closeLetter.disabled = true;
      document.removeEventListener("keydown", onEscape);
      scene.dataset.phase = "birthday-entering";
      await hide(prelude, 850);
      prelude.hidden = true;
      for (const el of [age, birthdayName, birthdayTitle, cake, instruction]) el.style.opacity = 0;
      birthday.hidden = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      birthday.focus({ preventScroll: true });
      await show(age, 850);
      await show(birthdayName, 550);
      await show(birthdayTitle, 650);
      await Promise.all([show(cake, 650), show(instruction, 650)]);
      if (reduced.matches) await wait(300);
      cake.disabled = false;
      scene.dataset.phase = "birthday";
    }, { once: true });
    let wished = false;
    cake.addEventListener("click", async () => {
      if (wished) return;
      wished = true;
      cake.disabled = true;
      scene.dataset.phase = "wishing";
      await Promise.all([...cake.querySelectorAll(".cake-flame")].map(flame => {
        flame.style.animation = "none";
        return animate(flame, [{ opacity: 1, transform: "scale(1)" }, { opacity: .6, transform: "scale(.8) rotate(15deg)" }, { opacity: 0, transform: "scale(.1)" }], 600);
      }));
      cake.dataset.out = "";
      fireworks.dataset.active = "";
      instruction.hidden = true;
      wish.textContent = content.birthday.wish;
      await show(wish, 450);
      scene.dataset.phase = "wish-saved";
      await wait(2300);
      scene.dataset.phase = "ending-entering";
      await hide(birthday, 1100);
      birthday.hidden = true;
      ending.hidden = false;
      photo(endingPhoto, content.ending, "treasure-ending-photo");
      window.scrollTo({ top: 0, behavior: "instant" });
      ending.focus({ preventScroll: true });
      await show(ending, 1200);
      scene.dataset.phase = "complete";
    }, { once: true });

    window.scrollTo({ top: 0, behavior: "instant" });
    scene.focus({ preventScroll: true });
    await show(scene, 1100);
    scene.dataset.phase = "zoro";
  }
  document.addEventListener("yadira:grand-line-complete", () => queueMicrotask(start), { once: true });
})();
