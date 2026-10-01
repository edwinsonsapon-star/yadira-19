"use strict";

(() => {
  const music = document.querySelector(".background-music");
  const control = document.querySelector(".music-control");
  const gift = document.querySelector(".gift-button");
  if (!music || !control || !gift) return;

  const targetVolume = .25;
  const fadeDuration = 2500;
  const restartKey = "yadira:music-restart:audio.mp3";
  let started = false;
  let requestedPlaying = false;
  let playRequest = 0;
  let fadeFrame = 0;
  let resumeTime = 0;
  music.volume = 0;

  // The existing restart reloads the page. Preserve position, never autoplay
  // after that reload: the next ABRIR REGALO gesture resumes the saved track.
  try {
    const saved = Number(window.sessionStorage.getItem(restartKey));
    if (Number.isFinite(saved) && saved > 0) resumeTime = saved;
    window.sessionStorage.removeItem(restartKey);
  } catch { /* Storage is optional (for example, in private browsing). */ }

  music.addEventListener("loadedmetadata", () => {
    if (!resumeTime) return;
    try {
      music.currentTime = Number.isFinite(music.duration) && music.duration > 0
        ? resumeTime % music.duration : resumeTime;
      resumeTime = 0;
    } catch { /* A failed seek must not block the experience. */ }
  });

  function updateControl() {
    const playing = !music.paused && !music.error;
    const label = playing ? "Pausar música" : "Reproducir música";
    control.dataset.playing = String(playing);
    control.setAttribute("aria-label", label);
    control.title = label;
    control.firstElementChild.textContent = playing ? "♫" : "♪̸";
  }

  function stopFade() {
    window.cancelAnimationFrame(fadeFrame);
    fadeFrame = 0;
  }

  function fadeIn() {
    stopFade();
    const from = music.volume;
    const began = performance.now();
    function step(now) {
      if (music.paused || !requestedPlaying) return;
      const progress = Math.min(1, (now - began) / fadeDuration);
      music.volume = from + (targetVolume - from) * progress;
      fadeFrame = progress < 1 ? window.requestAnimationFrame(step) : 0;
    }
    fadeFrame = window.requestAnimationFrame(step);
  }

  function playMusic() {
    const request = ++playRequest;
    requestedPlaying = true;
    // play() is invoked synchronously inside a real click, not after a timer
    // or the Opening transition, preserving mobile user activation.
    try {
      if (music.error) music.load();
      const playback = music.play();
      Promise.resolve(playback).then(() => {
        if (request !== playRequest || !requestedPlaying) return;
        updateControl();
        if (music.volume < targetVolume) fadeIn();
      }).catch(() => {
        if (request !== playRequest) return;
        requestedPlaying = false;
        stopFade();
        updateControl();
      });
    } catch {
      requestedPlaying = false;
      stopFade();
      updateControl();
    }
  }

  gift.addEventListener("click", () => {
    if (started) return;
    started = true;
    control.disabled = false;
    playMusic();
  }, { once: true });

  control.addEventListener("click", () => {
    if (!started) return;
    if (requestedPlaying || !music.paused) {
      requestedPlaying = false;
      playRequest += 1;
      stopFade();
      music.pause();
      updateControl();
    } else {
      playMusic();
    }
  });
  music.addEventListener("play", updateControl);
  music.addEventListener("pause", () => {
    // Also synchronize interruptions initiated by the browser or device.
    if (music.paused) {
      requestedPlaying = false;
      stopFade();
    }
    updateControl();
  });
  music.addEventListener("error", () => {
    requestedPlaying = false;
    playRequest += 1;
    stopFade();
    updateControl();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest?.(".treasure-restart")) return;
    try { window.sessionStorage.setItem(restartKey, String(music.currentTime)); }
    catch { /* The original restart remains functional without storage. */ }
  }, { capture: true });

  // A modal is in the browser's top layer. Keep the same small control usable
  // there too, without changing the viewer or its focus/close handlers.
  const experience = document.querySelector("#experience");
  if (experience) {
    new MutationObserver(() => {
      const host = experience.querySelector("dialog[open]") || document.body;
      if (control.parentElement !== host) host.append(control);
    }).observe(experience, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
  }
})();
