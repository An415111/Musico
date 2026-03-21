//----------------------------------------------------------
// LOGIN PROTECTION (NEW BACKEND SYSTEM)
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const profileName = document.getElementById("profileName");

  if (!token || !user) {
    window.location.href = "signin.html";
    return;
  }

  if (profileName) {
    profileName.textContent = `Hello, ${user.firstName}`;
  }
});


//----------------------------------------------------------
// SONG SEARCH SETUP
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const songCards = Array.from(document.querySelectorAll('.song-card'));
  const searchInput = document.getElementById('search-input');

  songCards.forEach(card => {
    const title = card.querySelector('h4')?.textContent.trim().toLowerCase() || '';
    const artist = card.querySelector('.artist')?.textContent.trim().toLowerCase() || '';
    const src = card.querySelector('audio source')?.getAttribute('src')?.toLowerCase() || '';
    card.dataset.title = title;
    card.dataset.artist = artist;
    card.dataset.src = src;
  });

  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    songCards.forEach(card => {
      const title = card.dataset.title;
      const artist = card.dataset.artist;
      const src = card.dataset.src;
      if (title.includes(q) || artist.includes(q) || src.includes(q)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


//----------------------------------------------------------
// PLAY / PAUSE SYSTEM
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const playButtons = document.querySelectorAll(".playPauseBtn");
  const audioElements = document.querySelectorAll(".audio");

  let currentAudio = null;
  let currentBtn = null;

  playButtons.forEach((button, index) => {
    const audio = audioElements[index];
    const icon = button.querySelector("i");

    button.addEventListener("click", () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentBtn.querySelector("i").classList.replace("fa-pause", "fa-play");
      }

      if (audio.paused) {
        audio.play();
        icon.classList.replace("fa-play", "fa-pause");
        currentAudio = audio;
        currentBtn = button;
      } else {
        audio.pause();
        icon.classList.replace("fa-pause", "fa-play");
        currentAudio = null;
        currentBtn = null;
      }

      audio.addEventListener("ended", () => {
        icon.classList.replace("fa-pause", "fa-play");
      });
    });
  });
});


//----------------------------------------------------------
// PROGRESS BAR + TIME UPDATE
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const songCards = document.querySelectorAll(".song-card");

  songCards.forEach(card => {
    const audio = card.querySelector('.audio');
    const progressBar = card.querySelector("input[type='range']");
    const currentTimeEl = card.querySelector('#currentTime');
    const durationEl = card.querySelector('#duration');

    if (!audio) return;

    audio.addEventListener('loadedmetadata', () => {
      if (durationEl && audio.duration) {
        durationEl.textContent = formatTime(audio.duration);
      }
      if (progressBar) progressBar.max = Math.floor(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (progressBar) progressBar.value = Math.floor(audio.currentTime);
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    progressBar?.addEventListener('input', () => {
      audio.currentTime = progressBar.value;
    });

    audio.addEventListener('ended', () => {
      if (progressBar) progressBar.value = 0;
      if (currentTimeEl) currentTimeEl.textContent = '0:00';
    });
  });
});

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}


//----------------------------------------------------------
// LIKE BUTTON
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked");
    });
  });
});


//----------------------------------------------------------
// ADD TO PLAYLIST (LocalStorage Version)
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".addToPlaylistBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".song-card");
      const title = card.querySelector("h4").textContent.trim();
      const src = card.querySelector("audio source").getAttribute("src");
      const img = card.querySelector("img").getAttribute("src");

      let playlist = JSON.parse(localStorage.getItem("playlist") || "[]");

      if (!playlist.some(song => song.src === src)) {
        playlist.push({ title, src, img });
        localStorage.setItem("playlist", JSON.stringify(playlist));
        btn.textContent = "Added ✓";
      } else {
        btn.textContent = "Already ✓";
      }

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-plus"></i> Add';
      }, 1200);
    });
  });
});


//----------------------------------------------------------
// THEME SWITCH
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById("themeSwitch");
  if (!themeSwitch) return;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });
});


//----------------------------------------------------------
// MENU (3-DOT) TOGGLE
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const menuContainer = document.querySelector(".menu-container");

  if (!menuBtn || !menuContainer) return;

  menuBtn.addEventListener("click", e => {
    e.stopPropagation();
    menuContainer.classList.toggle("active");
  });

  window.addEventListener("click", () => {
    menuContainer.classList.remove("active");
  });
});


//----------------------------------------------------------
// LOGOUT FUNCTION
//----------------------------------------------------------
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "signin.html";
}
