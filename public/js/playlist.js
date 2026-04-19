//----------------------------------------------------------
// LOAD PLAYLIST
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const playlistContainer = document.getElementById("playlist-list");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "/";
    return;
  }

  try {
    const res = await fetch("/api/playlist", {
      headers: {
        Authorization: token // ✅ FIXED
      }
    });

    if (!res.ok) {
      playlistContainer.innerHTML =
        "<p style='text-align:center;'>Error loading playlist</p>";
      return;
    }

    const songs = await res.json();

    if (!songs.length) {
      playlistContainer.innerHTML =
        "<p style='text-align:center; opacity:0.7;'>No songs added yet 🎧</p>";
      return;
    }

    songs.forEach(song => {
      const card = document.createElement("li");
      card.className = "song-card";

      card.innerHTML = `
        <div class="song-left">
          <img src="${song.image}" alt="${song.title}">
          <div class="song-info">
            <h4>${song.title}</h4>
          </div>
        </div>

        <div class="song-controls">
          <button class="playPauseBtn">
            <i class="fas fa-play"></i>
          </button>

          <audio class="audio" src="${song.src}"></audio>

          <div class="progress">
            <span class="currentTime">0:00</span>
            <input type="range" class="progressBar" value="0" min="0">
            <span class="duration">0:00</span>
          </div>

          <button class="removeBtn" data-id="${song._id}">
            Remove
          </button>
        </div>
      `;

      playlistContainer.appendChild(card);
    });

    initPlayer();

  } catch (err) {
    console.error(err);
    playlistContainer.innerHTML =
      "<p style='text-align:center;'>Error loading playlist</p>";
  }
});


//----------------------------------------------------------
// PLAYER LOGIC
//----------------------------------------------------------
function initPlayer() {
  const cards = document.querySelectorAll(".song-card");

  let currentAudio = null;
  let currentIcon = null;

  cards.forEach(card => {
    const audio = card.querySelector(".audio");
    const playBtn = card.querySelector(".playPauseBtn");
    const icon = playBtn.querySelector("i");
    const progressBar = card.querySelector(".progressBar");
    const currentTimeEl = card.querySelector(".currentTime");
    const durationEl = card.querySelector(".duration");

    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
      progressBar.max = Math.floor(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      progressBar.value = Math.floor(audio.currentTime);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    progressBar.addEventListener("input", () => {
      audio.currentTime = progressBar.value;
    });

    playBtn.addEventListener("click", () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentIcon.classList.replace("fa-pause", "fa-play");
      }

      if (audio.paused) {
        audio.play();
        icon.classList.replace("fa-play", "fa-pause");
        currentAudio = audio;
        currentIcon = icon;
      } else {
        audio.pause();
        icon.classList.replace("fa-pause", "fa-play");
        currentAudio = null;
        currentIcon = null;
      }
    });

    audio.addEventListener("ended", () => {
      icon.classList.replace("fa-pause", "fa-play");
      progressBar.value = 0;
      currentTimeEl.textContent = "0:00";
      currentAudio = null;
      currentIcon = null;
    });
  });
}


//----------------------------------------------------------
// REMOVE SONG
//----------------------------------------------------------
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".removeBtn");
  if (!btn) return;

  const songId = btn.dataset.id;
  const token = localStorage.getItem("token");

  if (!confirm("Remove this song from playlist?")) return;

  try {
    const res = await fetch(`/api/playlist/${songId}`, {
      method: "DELETE",
      headers: {
        Authorization: token // ✅ FIXED
      }
    });

    if (!res.ok) {
      alert("Error removing song");
      return;
    }

    const data = await res.json();
    alert(data.msg);

    location.reload();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});


//----------------------------------------------------------
// TIME FORMAT
//----------------------------------------------------------
function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}