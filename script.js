const target = new Date("2026-11-29T19:00:00+05:30").getTime();

function tick() {
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;

  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;

  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;

  const seconds = Math.floor(diff / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

tick();
setInterval(tick, 1000);

document.getElementById("enterBtn").addEventListener("click", () => {
  document.getElementById("content").scrollIntoView({
    behavior: "smooth"
  });
});


/* MUSIC */
const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");
const musicLabel = document.getElementById("musicLabel");

let playing = false;

audio.volume = 0.65;

musicBtn.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      await audio.play();
      playing = true;
      musicLabel.textContent = "Pause";
      musicBtn.classList.add("playing");
    } else {
      audio.pause();
      playing = false;
      musicLabel.textContent = "Music";
      musicBtn.classList.remove("playing");
    }
  } catch (error) {
    console.error("Audio playback failed:", error);
    musicLabel.textContent = "Try again";
  }
});

audio.addEventListener("ended", () => {
  playing = false;
  musicLabel.textContent = "Music";
  musicBtn.classList.remove("playing");
});

audio.addEventListener("error", () => {
  musicLabel.textContent = "Audio error";
});


/* SCROLL REVEALS */
const reveal = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        reveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".section, .visual-break, .final-image").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 1s ease, transform 1s ease";
  reveal.observe(el);
});

document.addEventListener(
  "scroll",
  () => {
    document.querySelectorAll(".visible").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  },
  { passive: true }
);
