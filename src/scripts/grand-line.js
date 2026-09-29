"use strict";

(() => {
  let mounted = false;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compass = `<svg class="grand-compass" viewBox="0 0 60 60" fill="none" aria-hidden="true"><circle cx="30" cy="30" r="20" stroke="currentColor" opacity=".3"/><path d="M30 3L35 25L57 30L35 35L30 57L25 35L3 30L25 25Z" stroke="currentColor"/><path d="M30 3V30H57M30 57V30H3" stroke="currentColor" opacity=".4"/><circle cx="30" cy="30" r="3" fill="currentColor"/></svg>`;
  const anchor = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="4" r="2" stroke="currentColor"/><path d="M12 6v15M7 9h10M4 13c0 10 16 10 16 0M4 13l-2 3m2-3 3 2m13-2 2 3m-2-3-3 2" stroke="currentColor" stroke-linecap="round"/></svg>`;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  };
  const hasText = (value) => typeof value === "string" && value.trim().length > 0;
  async function fade(element, from, to, duration) {
    if (motion.matches || !element.animate) { element.style.opacity = to; return; }
    const animation = element.animate([{ opacity: from }, { opacity: to }], { duration, easing: "ease-in-out", fill: "forwards" });
    const finish = () => { if (motion.matches) animation.finish(); };
    motion.addEventListener("change", finish);
    try { await animation.finished; }
    finally { motion.removeEventListener("change", finish); element.style.opacity = to; animation.cancel(); }
  }

  async function start() {
    if (mounted) return;
    const host = document.querySelector("#grand-line");
    if (!host) return;
    mounted = true;
    const content = window.YADIRA_CONTENT;
    const scene = node("article", "grand-story");
    scene.tabIndex = -1;
    scene.setAttribute("aria-label", content.history.title);
    scene.dataset.phase = "arriving";
    const progress = node("div", "grand-route");
    progress.setAttribute("role", "img");
    progress.setAttribute("aria-label", "Ruta del viaje: segundo punto, nuestra historia");
    progress.innerHTML = `${anchor}<b></b><i></i><b></b><i></i><b></b><i></i><b></b><em></em>`;
    scene.append(progress);
    const heading = node("header", "grand-heading");
    heading.innerHTML = compass;
    heading.append(node("h2", "", content.history.title), node("p", "", content.history.subtitle));
    scene.append(heading);

    const dialog = node("dialog", "grand-dialog");
    dialog.setAttribute("aria-label", "Recuerdo");
    const closeButton = node("button", "grand-close", "×");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", content.navigation.close);
    closeButton.autofocus = true;
    const dialogBody = node("div", "grand-dialog-body");
    dialog.append(closeButton, dialogBody);
    let returnFocus = null;
    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog && event.target !== dialogBody) return;
      // Outside the memory card, or the viewer's unused background/padding.
      const box = dialog.getBoundingClientRect();
      const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
      if (outside || dialog.dataset.mode === "viewer") dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("grand-modal-open");
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });

    function openMemory(item, viewer, trigger) {
      returnFocus = trigger;
      dialogBody.replaceChildren();
      dialog.dataset.mode = viewer ? "viewer" : "memory";
      dialog.setAttribute("aria-label", item.title || item.caption || content.navigation.viewPhoto);
      const source = viewer ? item.src : item.image;
      if (hasText(source)) {
        const image = node("img", "grand-dialog-photo");
        image.alt = item.alt || item.caption || item.title || content.navigation.viewPhoto;
        image.decoding = "async";
        image.addEventListener("error", () => image.remove(), { once: true });
        image.src = source;
        dialogBody.append(image);
      } else {
        const ornament = node("div", "grand-divider", "✧");
        ornament.setAttribute("aria-hidden", "true");
        dialogBody.append(ornament);
      }
      const title = viewer ? item.caption : item.title;
      if (hasText(title)) dialogBody.append(node("h3", "", title));
      if (!viewer && hasText(item.date)) dialogBody.append(node("p", "grand-dialog-date", item.date));
      const text = viewer ? item.story : item.text;
      if (hasText(text)) dialogBody.append(node("p", "grand-dialog-text", text));
      document.body.classList.add("grand-modal-open");
      dialog.showModal();
    }

    const map = node("div", "grand-map");
    const moments = Array.isArray(content.timeline) ? content.timeline : [];
    const list = node("ol", "grand-moments");
    list.setAttribute("aria-label", content.history.subtitle);
    // The curve follows each navigation point, including when entries are added.
    if (moments.length > 1) {
      let path = "M52 77.5";
      for (let i = 1; i < moments.length; i++) {
        const previousX = i % 2 ? 52 : 308;
        const x = i % 2 ? 308 : 52;
        const y = i * 155 + 77.5;
        path += ` C${previousX} ${y - 70},${x} ${y - 85},${x} ${y}`;
      }
      map.innerHTML = `<svg class="grand-map-path" viewBox="0 0 360 ${moments.length * 155}" preserveAspectRatio="none" aria-hidden="true"><path d="${path}" fill="none" stroke="#c49a55" stroke-opacity=".38" stroke-width="1" stroke-dasharray="3 7" vector-effect="non-scaling-stroke"/></svg>`;
    }
    for (const [index, item] of moments.entries()) {
      const entry = node("li", "grand-moment grand-reveal");
      const button = node("button", "grand-moment-button");
      button.type = "button";
      button.setAttribute("aria-haspopup", "dialog");
      const point = node("span", "grand-point");
      point.setAttribute("aria-hidden", "true");
      const copy = node("span", "grand-moment-copy");
      const number = node("small", "", String(index + 1).padStart(2, "0"));
      number.setAttribute("aria-hidden", "true");
      copy.append(number, node("strong", "", item.title));
      button.append(point, copy);
      button.addEventListener("click", () => openMemory(item, false, button));
      entry.append(button);
      list.append(entry);
    }
    map.append(list);
    scene.append(map);

    const yadira = node("section", "grand-yadira");
    yadira.id = "la-yadira";
    const divider = node("div", "grand-divider", "✧");
    divider.setAttribute("aria-hidden", "true");
    const yadiraTitle = node("h2", "grand-section-title grand-reveal", content.yadira.title);
    yadiraTitle.id = "grand-yadira-title";
    yadira.setAttribute("aria-labelledby", yadiraTitle.id);
    const intro = node("div", "grand-intro");
    content.yadira.intro.forEach((text) => intro.append(node("p", "grand-reveal", text)));
    const phrases = node("ul", "grand-phrases");
    content.yadira.phrases.forEach((text) => phrases.append(node("li", "grand-phrase grand-reveal", text)));
    const closing = node("div", "grand-closing");
    content.yadira.closing.forEach((text) => closing.append(node("p", "grand-reveal", text)));
    yadira.append(divider, yadiraTitle, intro, phrases, closing);
    scene.append(yadira);

    const memories = node("section", "grand-memories");
    memories.id = "mar-de-recuerdos";
    const seaTitle = node("h2", "grand-section-title grand-reveal", content.memories.title);
    seaTitle.id = "grand-sea-title";
    memories.setAttribute("aria-labelledby", seaTitle.id);
    const emptySea = node("div", "grand-empty-sea");
    emptySea.setAttribute("aria-hidden", "true");
    emptySea.append(node("span", "", "✧"));
    const album = node("div", "grand-album");
    const gallery = (Array.isArray(content.gallery) ? content.gallery : []).filter((item) => item && hasText(item.src));
    let loadedPhotos = 0;
    for (const item of gallery) {
      const photo = node("figure", "grand-photo");
      const button = node("button");
      button.type = "button";
      button.setAttribute("aria-label", item.caption || item.alt || content.navigation.viewPhoto);
      button.setAttribute("aria-haspopup", "dialog");
      const image = node("img");
      image.alt = item.alt || item.caption || content.navigation.viewPhoto;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("load", () => {
        photo.dataset.loaded = "true";
        loadedPhotos += 1;
        if (loadedPhotos) emptySea.hidden = true;
      }, { once: true });
      image.addEventListener("error", () => photo.remove(), { once: true });
      image.src = item.src;
      button.append(image);
      button.addEventListener("click", () => openMemory(item, true, button));
      photo.append(button);
      if (hasText(item.caption)) photo.append(node("figcaption", "", item.caption));
      album.append(photo);
    }
    const next = node("button", "grand-next", content.navigation.continue);
    next.type = "button";
    memories.append(seaTitle, node("p", "grand-memories-subtitle grand-reveal", content.memories.subtitle), album, emptySea, next);
    scene.append(memories);
    const treasure = node("div");
    treasure.id = "treasure";
    treasure.hidden = true;
    treasure.tabIndex = -1;
    treasure.setAttribute("aria-label", "Siguiente capítulo");
    host.append(scene, dialog, treasure);

    let observer = null;
    if ("IntersectionObserver" in window && !motion.matches) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) { entry.target.removeAttribute("data-pending"); observer.unobserve(entry.target); }
        }
      }, { threshold: .12 });
      for (const element of scene.querySelectorAll(".grand-reveal")) {
        element.dataset.pending = "";
        observer.observe(element);
      }
      // Keyboard navigation must never land on visually hidden content.
      scene.addEventListener("focusin", (event) => event.target.closest(".grand-reveal")?.removeAttribute("data-pending"));
    }
    let leaving = false;
    next.addEventListener("click", async () => {
      if (leaving) return;
      leaving = true;
      next.disabled = true;
      scene.dataset.phase = "departing";
      await fade(scene, 1, 0, 950);
      observer?.disconnect();
      scene.hidden = true;
      treasure.hidden = false;
      treasure.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
      scene.dataset.phase = "complete";
      document.dispatchEvent(new CustomEvent("yadira:grand-line-complete", { bubbles: true, detail: { package: "YADIRA-003" } }));
    }, { once: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    scene.focus({ preventScroll: true });
    await fade(scene, 0, 1, 1100);
    scene.dataset.phase = "ready";
  }
  document.addEventListener("yadira:journey-start", () => queueMicrotask(start), { once: true });
})();
