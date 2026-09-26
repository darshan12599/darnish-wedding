/* =========================================================
   DARNISH — WEDDING WEBSITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
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
});
