"use strict";

// YADIRA-002 is mounted only after the approved Opening hands off control.
(() => {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const phrases = [
    { text: "Hay cosas que se pueden comprar...", hold: 2500 },
    { text: "y hay cosas que solamente pueden construirse con tiempo.", hold: 3700 },
    { text: "Esta la hice para usted.", hold: 3000, emphasis: "personal" },
    { text: "Hay recuerdos que no deberían quedarse únicamente en nuestra memoria.", hold: 3900 },
    { text: "Así que decidí construir un lugar para guardarlos.", hold: 3500 },
    { text: "Bienvenida a nuestra Grand Line.", hold: 4300, emphasis: "welcome" },
  ];
  const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  let mounted = false;

  async function animate(element, frames, duration) {
    const { offset, ...final } = frames[frames.length - 1];
    if (motion.matches || typeof element.animate !== "function") {
      Object.assign(element.style, final);
      return;
    }
    const animation = element.animate(frames, { duration, easing: "ease-in-out", fill: "forwards" });
    const finish = () => { if (motion.matches) animation.finish(); };
    motion.addEventListener("change", finish);
    try { await animation.finished; }
    finally {
      motion.removeEventListener("change", finish);
      Object.assign(element.style, final);
      animation.cancel();
    }
  }
  const reveal = (element, duration = 650) => animate(element,
    [{ opacity: 0, transform: "translateY(7px)" }, { opacity: 1, transform: "translateY(0)" }], duration);
  const fade = (element, duration = 450) => animate(element, [{ opacity: 1 }, { opacity: 0 }], duration);

  const navigationSymbol = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v17M7 7h10M4 13c0 9 16 9 16 0M4 13l-2 3m2-3 3 2m13-2 2 3m-2-3-3 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="4" r="2" fill="none" stroke="currentColor"/></svg>`;

  function logPose() {
    const ticks = Array.from({ length: 48 }, (_, i) => {
      const angle = i * Math.PI / 24;
      const major = i % 4 === 0;
      const radius = major ? 82 : 87;
      const x1 = 160 + Math.sin(angle) * radius;
      const y1 = 145 - Math.cos(angle) * radius;
      const x2 = 160 + Math.sin(angle) * 92;
      const y2 = 145 - Math.cos(angle) * 92;
      return `<path d="M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}" opacity="${major ? .65 : .3}"/>`;
    }).join("");
    // Original vector object: pedestal, aged brass gimbal, glass globe and needle.
    return `<svg class="log-pose" viewBox="0 0 320 340" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jp-brass" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#3f2f22"/><stop offset=".2" stop-color="#d4b57b"/><stop offset=".38" stop-color="#87613b"/><stop offset=".6" stop-color="#dec99a"/><stop offset=".82" stop-color="#8b643a"/><stop offset="1" stop-color="#37291c"/></linearGradient>
        <linearGradient id="jp-rim" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e4cc95"/><stop offset=".24" stop-color="#8c653b"/><stop offset=".65" stop-color="#493522"/><stop offset="1" stop-color="#b39359"/></linearGradient>
        <linearGradient id="jp-base" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#30231d"/><stop offset=".4" stop-color="#8b6441"/><stop offset=".58" stop-color="#b49361"/><stop offset="1" stop-color="#2a201c"/></linearGradient>
        <radialGradient id="jp-glass" cx=".36" cy=".24" r=".8"><stop stop-color="#426375" stop-opacity=".56"/><stop offset=".4" stop-color="#132a40" stop-opacity=".8"/><stop offset=".75" stop-color="#0a172b" stop-opacity=".97"/><stop offset="1" stop-color="#756095" stop-opacity=".43"/></radialGradient>
        <radialGradient id="jp-light"><stop stop-color="#9ad0d5" stop-opacity=".33"/><stop offset=".5" stop-color="#5b819a" stop-opacity=".15"/><stop offset="1" stop-color="#163149" stop-opacity="0"/></radialGradient>
        <radialGradient id="jp-pulse"><stop stop-color="#edcb89" stop-opacity=".28"/><stop offset=".55" stop-color="#b9a6d7" stop-opacity=".12"/><stop offset="1" stop-color="#b9a6d7" stop-opacity="0"/></radialGradient>
        <linearGradient id="jp-shine" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9f1eb" stop-opacity=".34"/><stop offset=".5" stop-color="#d6e6ef" stop-opacity=".08"/><stop offset="1" stop-color="#d6e6ef" stop-opacity="0"/></linearGradient>
        <filter id="jp-shadow" x="-.5" y="-1" width="2" height="3"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <ellipse cx="160" cy="315" rx="93" ry="10" fill="#000" opacity=".65" filter="url(#jp-shadow)"/>
      <ellipse class="pose-found-glow" cx="160" cy="145" rx="145" ry="145" fill="url(#jp-pulse)"/>
      <path d="M126 242L119 297Q159 318 201 297L193 242Z" fill="url(#jp-base)" stroke="#a9824b" stroke-opacity=".35"/>
      <path d="M133 246L130 294M187 246L191 294" stroke="#d3b277" stroke-opacity=".28"/>
      <ellipse cx="160" cy="292" rx="66" ry="17" fill="url(#jp-rim)" stroke="#c7a164" stroke-opacity=".6"/>
      <ellipse cx="160" cy="285" rx="70" ry="18" fill="url(#jp-brass)" stroke="#d7bb80" stroke-width="1.2"/>
      <ellipse cx="160" cy="283" rx="56" ry="10" fill="#17232d" stroke="#4b3827" stroke-width="3"/>
      <path d="M52 145C40 220 72 267 130 281L133 267C83 253 63 213 66 151ZM268 145C280 220 248 267 190 281L187 267C237 253 257 213 254 151Z" fill="url(#jp-brass)" stroke="#a78750" stroke-width="1"/>
      <path d="M55 170C52 215 78 258 113 270M265 170C268 215 242 258 207 270" fill="none" stroke="#e7c78e" stroke-opacity=".3"/>
      <circle cx="160" cy="145" r="108" fill="#08131e" stroke="url(#jp-brass)" stroke-width="7"/>
      <circle cx="160" cy="145" r="101" fill="url(#jp-glass)" stroke="#abbdc8" stroke-opacity=".45" stroke-width="1.3"/>
      <circle class="pose-inner-light" cx="160" cy="145" r="98" fill="url(#jp-light)"/>
      <g stroke="#d5b980" stroke-width="1">${ticks}</g>
      <ellipse cx="160" cy="168" rx="95" ry="29" fill="#071323" fill-opacity=".4" stroke="#b5a478" stroke-opacity=".3"/>
      <ellipse cx="160" cy="168" rx="80" ry="22" fill="none" stroke="#a794c7" stroke-opacity=".13"/>
      <path d="M69 168H251M160 144V193M102 148L218 187M102 188L218 148" stroke="#b2c2d4" stroke-opacity=".13"/>
      <g fill="#e2c994" opacity=".72" font-family="Georgia,serif" font-size="9" text-anchor="middle"><text x="160" y="75">N</text><text x="233" y="148">E</text><text x="160" y="225">S</text><text x="87" y="148">W</text></g>
      <path d="M160 129V195" stroke="#d6c292" stroke-width="4" opacity=".35"/>
      <g class="pose-needle">
        <path d="M160 66L171 149L160 159L149 149Z" fill="#d9c395" stroke="#efdab0" stroke-width=".6"/>
        <path d="M160 66V159L149 149Z" fill="#9c7847"/>
        <path d="M160 210L170 150L160 143L150 150Z" fill="#6c537a" stroke="#baa0b8" stroke-opacity=".65" stroke-width=".6"/>
        <path d="M160 210V143L150 150Z" fill="#3b344e"/>
        <path d="M160 70L160 133" stroke="#fff1d4" stroke-opacity=".65" stroke-width="1"/>
      </g>
      <circle cx="160" cy="148" r="10" fill="url(#jp-brass)" stroke="#e7cd98" stroke-width="1"/>
      <circle cx="160" cy="148" r="4" fill="#182937" stroke="#bc965b"/>
      <path d="M82 117C90 71 129 47 169 52C132 61 101 86 92 129Z" fill="url(#jp-shine)"/>
      <path d="M94 92C107 72 125 62 146 60" fill="none" stroke="#eef5ed" stroke-opacity=".45" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M246 154C245 195 221 223 193 234" fill="none" stroke="#9ebcda" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"/>
      <path d="M64 168C98 196 221 205 259 168" fill="none" stroke="url(#jp-brass)" stroke-width="5"/>
      <path d="M65 166C109 197 219 198 256 167" fill="none" stroke="#ead5a5" stroke-opacity=".5" stroke-width="1"/>
      <circle cx="54" cy="151" r="10" fill="url(#jp-rim)" stroke="#c6a469"/>
      <circle cx="266" cy="151" r="10" fill="url(#jp-rim)" stroke="#c6a469"/>
      <path d="M50 151H58M262 151H270" stroke="#36281e" stroke-width="2"/>
      <path d="M112 285Q160 296 208 285" fill="none" stroke="#e3c48d" stroke-opacity=".4"/>
    </svg>`;
  }

  async function startChapter() {
    if (mounted) return;
    mounted = true;
    const experience = document.querySelector("#experience");
    experience.innerHTML = `
      <section class="journey-stage" data-phase="ocean" tabindex="-1" aria-label="The Journey Begins">
        <div class="journey-world" aria-hidden="true">
          <div class="journey-sky"></div><div class="journey-stars"></div><div class="journey-chart"></div>
          <div class="journey-sea"></div><div class="journey-reflection"></div><div class="journey-horizon"></div>
          <div class="journey-fog"></div><div class="journey-beacon"></div><div class="journey-vignette"></div>
        </div>
        <p class="journey-caption" lang="en">THE JOURNEY BEGINS</p>
        <div class="journey-narrative">
          <p class="journey-line" role="status" aria-live="polite" aria-atomic="true"></p>
          <button class="journey-continue" type="button" disabled aria-label="Continuar a la siguiente frase">Continuar <span aria-hidden="true">›</span></button>
        </div>
        <div class="journey-port" hidden>
          <figure class="journey-object" aria-label="Log Pose de cristal y metal antiguo, con una aguja de navegación">${logPose()}</figure>
          <div class="journey-destination">
            <p class="journey-status" role="status" aria-live="polite"></p>
            <h2 class="journey-title" lang="en">OUR GRAND LINE</h2>
          </div>
          <button class="journey-button" type="button" disabled>${navigationSymbol}<span>COMENZAR VIAJE</span></button>
          <div class="journey-route" role="img" aria-label="Ruta del viaje: en el punto de partida">${navigationSymbol}<b></b><i></i><b></b><i></i><b></b><i></i><b></b><em></em></div>
        </div>
      </section>
      <div id="grand-line" tabindex="-1" aria-label="Siguiente capítulo de nuestra Grand Line" hidden></div>`;

    const scene = experience.querySelector(".journey-stage");
    const world = scene.querySelector(".journey-world");
    const narrative = scene.querySelector(".journey-narrative");
    const line = scene.querySelector(".journey-line");
    const next = scene.querySelector(".journey-continue");
    const port = scene.querySelector(".journey-port");
    const object = scene.querySelector(".journey-object");
    const needle = scene.querySelector(".pose-needle");
    const innerLight = scene.querySelector(".pose-inner-light");
    const glow = scene.querySelector(".pose-found-glow");
    const status = scene.querySelector(".journey-status");
    const title = scene.querySelector(".journey-title");
    const button = scene.querySelector(".journey-button");
    const route = scene.querySelector(".journey-route");
    const grandLine = experience.querySelector("#grand-line");
    const stars = scene.querySelector(".journey-stars");
    for (let i = 0; i < 31; i += 1) {
      const star = document.createElement("i");
      star.className = "journey-star";
      star.style.cssText = `--x:${3 + (i * 31) % 94}%;--y:${5 + (i * 13) % 37}%;--size:${i % 7 === 0 ? 2 : 1}px;--opacity:${.2 + (i % 4) * .1}`;
      stars.append(star);
    }

    let advance = null;
    next.addEventListener("click", () => { if (advance) advance(); });
    // A click releases only the current reading hold; transitions cannot queue skips.
    function readFor(duration) {
      return new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          window.clearTimeout(timer);
          advance = null;
          next.disabled = true;
          scene.dataset.reading = "false";
          resolve();
        };
        const timer = window.setTimeout(finish, duration);
        advance = finish;
        next.disabled = false;
        scene.dataset.reading = "true";
      });
    }

    scene.focus({ preventScroll: true });
    await animate(scene, [{ opacity: 0 }, { opacity: 1 }], 1600);
    await pause(350);
    scene.dataset.phase = "narrative";
    for (const [index, phrase] of phrases.entries()) {
      scene.dataset.line = String(index + 1);
      line.dataset.emphasis = phrase.emphasis || "quiet";
      line.textContent = phrase.text;
      await reveal(line, 550);
      await readFor(phrase.hold);
      await fade(line, 450);
      line.textContent = "";
    }
    narrative.hidden = true;
    port.hidden = false;
    scene.focus({ preventScroll: true });
    scene.dataset.phase = "searching";
    await reveal(object, 950);
    await animate(innerLight, [{ opacity: .18 }, { opacity: .95 }], 450);
    await animate(needle, [
      { transform: "rotate(-28deg)", offset: 0 },
      { transform: "rotate(83deg)", offset: .21 },
      { transform: "rotate(16deg)", offset: .4 },
      { transform: "rotate(-52deg)", offset: .58 },
      { transform: "rotate(59deg)", offset: .78 },
      { transform: "rotate(39deg)", offset: .9 },
      { transform: "rotate(44deg)", offset: 1 },
    ], 4300);
    await animate(glow, [{ opacity: 0 }, { opacity: .85 }, { opacity: .3 }], 800);
    scene.dataset.phase = "found";
    status.textContent = "DESTINO ENCONTRADO";
    await reveal(status, 500);
    await pause(350);
    await reveal(title, 700);
    await pause(250);
    await Promise.all([reveal(button, 600), animate(route, [{ opacity: 0 }, { opacity: 1 }], 600)]);
    button.disabled = false;
    scene.dataset.phase = "ready";

    let departing = false;
    button.addEventListener("click", async () => {
      if (departing) return;
      departing = true;
      button.disabled = true;
      scene.dataset.phase = "departing";
      await Promise.all([
        animate(object, [{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-3px) scale(1.015)" }, { transform: "translateY(0) scale(1)" }], 550),
        animate(glow, [{ opacity: .3 }, { opacity: .95 }, { opacity: .15 }], 650),
      ]);
      await animate(world, [{ opacity: 1 }, { opacity: .25 }], 650);
      await fade(scene, 1100);
      scene.hidden = true;
      scene.dataset.phase = "complete";
      grandLine.hidden = false;
      grandLine.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent("yadira:journey-start", {
        bubbles: true,
        detail: { package: "YADIRA-002" },
      }));
    }, { once: true });
  }

  document.addEventListener("yadira:opening-complete", () => {
    // Keep the original event's empty-container handoff observable to listeners.
    queueMicrotask(startChapter);
  }, { once: true });
})();
