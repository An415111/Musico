//----------------------------------------------------------
// MINI PLAYER
//----------------------------------------------------------
const miniPlayer = document.getElementById("miniPlayer");
const miniTitle = document.getElementById("miniTitle");
const miniImg = document.getElementById("miniImg");
const miniPlayPause = document.getElementById("miniPlayPause");
const miniProgress = document.getElementById("miniProgress");
const miniCurrent = document.getElementById("miniCurrent");
const miniDuration = document.getElementById("miniDuration");
const miniPrev = document.getElementById("miniPrev");
const miniNext = document.getElementById("miniNext");
const miniClose = document.getElementById("miniClose");

let currentAudioRef = null;
let allCards = [];
let currentIndex = -1;

function formatMiniTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function activateMiniPlayer(audio, title, imgSrc) {
  currentAudioRef = audio;

  miniPlayer.style.display = "flex";
  miniTitle.textContent = title;
  miniImg.src = imgSrc;
  miniPlayPause.querySelector("i").className = "fas fa-pause";

  // Update all cards list
  allCards = Array.from(document.querySelectorAll(".song-card"));
  currentIndex = allCards.findIndex(card =>
    card.querySelector(".audio") === audio
  );

  // ✅ Set duration immediately if already loaded
  if (audio.duration && !isNaN(audio.duration)) {
    miniProgress.max = Math.floor(audio.duration);
    miniDuration.textContent = formatMiniTime(audio.duration);
  }

  // ✅ Set current time immediately
  miniProgress.value = Math.floor(audio.currentTime);
  miniCurrent.textContent = formatMiniTime(audio.currentTime);

  // Progress
  audio.addEventListener("timeupdate", () => {
    miniProgress.value = Math.floor(audio.currentTime);
    miniCurrent.textContent = formatMiniTime(audio.currentTime);

    // ✅ Keep trying to set duration
    if (audio.duration && !isNaN(audio.duration)) {
      miniProgress.max = Math.floor(audio.duration);
      miniDuration.textContent = formatMiniTime(audio.duration);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    miniProgress.max = Math.floor(audio.duration);
    miniDuration.textContent = formatMiniTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    miniPlayPause.querySelector("i").className = "fas fa-play";
  });

  audio.addEventListener("pause", () => {
    miniPlayPause.querySelector("i").className = "fas fa-play";
  });

  audio.addEventListener("play", () => {
    miniPlayPause.querySelector("i").className = "fas fa-pause";
  });
}

// Mini Play/Pause
miniPlayPause.addEventListener("click", () => {
  if (!currentAudioRef) return;
  if (currentAudioRef.paused) {
    currentAudioRef.play();
  } else {
    currentAudioRef.pause();
  }
});

// Mini Progress
miniProgress.addEventListener("input", () => {
  if (currentAudioRef) {
    currentAudioRef.currentTime = miniProgress.value;
  }
});

// Mini Previous
miniPrev.addEventListener("click", () => {
  if (allCards.length === 0) return;
  currentIndex = (currentIndex - 1 + allCards.length) % allCards.length;
  allCards[currentIndex].querySelector(".playPauseBtn").click();
});

// Mini Next
miniNext.addEventListener("click", () => {
  if (allCards.length === 0) return;
  currentIndex = (currentIndex + 1) % allCards.length;
  allCards[currentIndex].querySelector(".playPauseBtn").click();
});

// Mini Close
miniClose.addEventListener("click", () => {
  if (currentAudioRef) {
    currentAudioRef.pause();
  }
  miniPlayer.style.display = "none";
});

// Hook into existing play buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".playPauseBtn");
  if (!btn) return;

  const card = btn.closest(".song-card");
  if (!card) return;

  const audio = card.querySelector(".audio");
  const title = card.querySelector("h4")?.textContent || "Unknown";
  const imgSrc = card.querySelector("img")?.src || "";

  if (audio && !audio.paused) {
    activateMiniPlayer(audio, title, imgSrc);
  }
});