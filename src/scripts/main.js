"use strict";

(() => {
  const stage = document.querySelector(".stage");
  const opening = document.querySelector("#opening");
  const atmosphere = document.querySelector(".atmosphere");
  const interlude = document.querySelector(".interlude");
  const experience = document.querySelector("#experience");
  const button = document.querySelector(".gift-button");
  const light = document.querySelector(".departure-light");
  const particles = document.querySelector(".particles");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let started = false;

  // Deterministic dust, never confetti. All particles are decorative and local.
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 26; index += 1) {
    const particle = document.createElement("i");
    particle.className = "particle";
    particle.style.cssText = [
      `--x:${4 + ((index * 37) % 92)}%`,
      `--y:${5 + ((index * 23) % 90)}%`,
      `--size:${index % 4 === 0 ? 2 : 1}px`,
      `--duration:${7 + (index % 6)}s`,
      `--delay:-${index % 9}s`,
    ].join(";");
    fragment.append(particle);
  }
  particles.append(fragment);

  const pause = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

  async function animate(element, keyframes, duration) {
    const finalFrame = keyframes[keyframes.length - 1];
    if (reducedMotion.matches || typeof element.animate !== "function") {
      Object.assign(element.style, finalFrame);
      return;
    }
    const animation = element.animate(keyframes, {
      duration,
      easing: "cubic-bezier(.25, .6, .3, 1)",
      fill: "forwards",
    });
    // A change of accessibility preference also stops a transition in progress.
    const finishEarly = () => { if (reducedMotion.matches) animation.finish(); };
    reducedMotion.addEventListener("change", finishEarly);
    try {
      await animation.finished;
    } finally {
      reducedMotion.removeEventListener("change", finishEarly);
      Object.assign(element.style, finalFrame);
      animation.cancel();
    }
  }

  async function openGift() {
    if (started) return;
    started = true;
    button.disabled = true;
    stage.dataset.state = "departing";

    await Promise.all([
      animate(button, [{ transform: "scale(1)" }, { transform: "scale(.975)" }, { transform: "scale(1)" }], 240),
      animate(light, [{ opacity: 0 }, { opacity: 1 }], 650),
    ]);
    await animate(opening, [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-8px)" }], 800);
    opening.hidden = true;
    stage.dataset.state = "interlude";
    interlude.hidden = false;
    await animate(interlude, [{ opacity: 0 }, { opacity: 1 }], 700);
    await pause(2200);
    await Promise.all([
      animate(interlude, [{ opacity: 1 }, { opacity: 0 }], 900),
      animate(atmosphere, [{ opacity: 1 }, { opacity: 0 }], 1100),
    ]);

    interlude.hidden = true;
    atmosphere.hidden = true;
    experience.hidden = false;
    stage.dataset.state = "complete";
    experience.focus({ preventScroll: true });
    // Public handoff contract. This package intentionally adds no next chapter.
    document.dispatchEvent(new CustomEvent("yadira:opening-complete", {
      bubbles: true,
      detail: { package: "YADIRA-001" },
    }));
  }

  button.addEventListener("click", openGift, { once: true });
})();
