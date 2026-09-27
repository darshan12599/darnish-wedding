/* =========================================================
   DARNISH — WEDDING WEBSITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* Royal opening overlay — existing invitation remains unchanged underneath. */
  const royalOpening = document.getElementById("royalOpening");
  const royalEnvelope = document.getElementById("royalEnvelope");
  const royalOpenButton = document.getElementById("royalOpenButton");
  const royalAudio = document.getElementById("audio");

  document.body.classList.add("royal-locked");

  let royalOpened = false;

  function openRoyalInvitation() {
    if (royalOpened || !royalOpening) return;
    royalOpened = true;

    if (royalAudio) royalAudio.play().catch(() => {});

    if (royalEnvelope) royalEnvelope.classList.add("is-open");

    setTimeout(() => {
      royalOpening.classList.add("is-closing");
      document.body.classList.remove("royal-locked");
    }, 1450);

    setTimeout(() => {
      royalOpening.remove();
    }, 2850);
  }

  if (royalEnvelope) royalEnvelope.addEventListener("click", openRoyalInvitation);
  if (royalOpenButton) royalOpenButton.addEventListener("click", openRoyalInvitation);

  const content = document.getElementById("content");
  const enterBtn = document.getElementById("enterBtn");

  const audio = document.getElementById("audio");
  const musicBtn = document.getElementById("musicBtn");
  const musicLabel = document.getElementById("musicLabel");

  const guestGreeting = document.getElementById("guestGreeting");
  const guestMessage = document.getElementById("guestMessage");

  const weddingDate = new Date("2026-11-29T19:00:00+05:30");

  /* =======================================================
     ENTER BUTTON
     ======================================================= */

  if (enterBtn && content) {
    enterBtn.addEventListener("click", () => {
      content.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  /* =======================================================
     PERSONALIZED INVITATION

     Use:
     https://darshan12599.github.io/darnish-wedding/?guest=Rahul

     Spaces can be used normally:
     ?guest=Rahul%20Shah
     ======================================================= */

  const params = new URLSearchParams(window.location.search);
  const guest = (params.get("guest") || "").trim();

  if (guest) {
    const safeGuest = guest.replace(/[<>]/g, "");

    if (safeGuest) {
      guestGreeting.textContent = `Dear ${safeGuest},`;
      guestMessage.textContent =
        "Your presence would make our wedding celebration even more meaningful " +
        "as we begin this new chapter surrounded by the people who matter to us.";

      document.title = `Darshan & Nishtha | For ${safeGuest}`;
    }
  }

  /* =======================================================
     COUNTDOWN
     ======================================================= */

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* =======================================================
     MUSIC

     Music starts only after a user interaction because
     mobile browsers normally block autoplay with sound.
     ======================================================= */

  let isPlaying = false;

  function updateMusicUI() {
    if (isPlaying) {
      musicBtn.classList.add("is-playing");
      musicBtn.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Pause";
    } else {
      musicBtn.classList.remove("is-playing");
      musicBtn.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Music";
    }
  }

  async function playMusic() {
    try {
      await audio.play();
      isPlaying = true;
      updateMusicUI();
    } catch (error) {
      isPlaying = false;
      updateMusicUI();
    }
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    updateMusicUI();
  }

  if (musicBtn && audio) {
    musicBtn.addEventListener("click", async () => {
      if (audio.paused) {
        await playMusic();
      } else {
        pauseMusic();
      }
    });

    audio.addEventListener("play", () => {
      isPlaying = true;
      updateMusicUI();
    });

    audio.addEventListener("pause", () => {
      isPlaying = false;
      updateMusicUI();
    });

    audio.addEventListener("ended", () => {
      isPlaying = false;
      updateMusicUI();
    });
  }

  /*
     First tap on "Enter our story" also counts as a user
     gesture, so we try to start music without breaking
     mobile autoplay restrictions.
  */
  if (enterBtn && audio) {
    enterBtn.addEventListener("click", () => {
      if (audio.paused) {
        playMusic();
      }
    }, { once: true });
  }

  updateMusicUI();

  /* =======================================================
     SCROLL PROGRESS
     ======================================================= */
  const progressBar = document.getElementById("scrollProgress");
  let progressTicking = false;

  function updateScrollProgress() {
    const doc = document.documentElement;
    const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    if (progressBar) progressBar.style.setProperty("--progress", progress);
    progressTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!progressTicking) {
      progressTicking = true;
      requestAnimationFrame(updateScrollProgress);
    }
  }, { passive: true });
  updateScrollProgress();

  /* =======================================================
     CINEMATIC SCROLL MOTION SETUP
     ======================================================= */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =======================================================
     SUBTLE PHOTOGRAPHIC PARALLAX
     ======================================================= */
  const parallaxImages = [
    ...document.querySelectorAll(".visual-break img"),
    ...document.querySelectorAll(".final-image > img")
  ];
  let parallaxTicking = false;

  function updateParallax() {
    if (prefersReducedMotion) return;
    const viewport = window.innerHeight;
    parallaxImages.forEach((img) => {
      const rect = img.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = (center - viewport / 2) / viewport;
      const offset = Math.max(-18, Math.min(18, -distance * 10));
      img.style.setProperty("--parallax-y", `${offset}px`);
    });
    parallaxTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!parallaxTicking) {
      parallaxTicking = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
  updateParallax();

  /* =======================================================
     CINEMATIC SCROLL TRANSITIONS
     ======================================================= */
  const revealTargets = [
    ...document.querySelectorAll("main > .section"),
    ...document.querySelectorAll(".moments-gallery .moment-frame"),
    ...document.querySelectorAll(".story-image"),
    ...document.querySelectorAll(".visual-break"),
    ...document.querySelectorAll(".wedding-card"),
    ...document.querySelectorAll(".final-image"),
    document.querySelector("footer")
  ].filter(Boolean);

  revealTargets.forEach((el) => {
    el.classList.add(el.classList.contains("moment-frame") || el.classList.contains("story-image") ? "reveal-image" : "reveal-on-scroll");
  });

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

});
