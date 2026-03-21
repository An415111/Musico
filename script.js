//  LOGIN CHECK
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    console.log("[script.js] No token/user → redirecting to signin");
    window.location.href = "signin.html";
    return;
  }

  // Update profile name
  const profileName = document.getElementById("profileName");
  if (profileName) profileName.textContent = `Hello, ${user.firstName}`;

  // Hide signin/signup buttons
  const signInBtn = document.getElementById("signin-btn");
  const signUpBtn = document.getElementById("SignUp-btn");
  if (signInBtn) signInBtn.style.display = "none";
  if (signUpBtn) signUpBtn.style.display = "none";
});


// SEARCH SYSTEM
document.addEventListener('DOMContentLoaded', () => {
  const songCards = Array.from(document.querySelectorAll('.song-card'));
  const searchInput = document.getElementById('search-input');

  songCards.forEach(card => {
    const title = (card.querySelector('h4')?.textContent || "").trim().toLowerCase();
    const artist = (card.querySelector('.artist')?.textContent || "").trim().toLowerCase();
    const source = card.querySelector('audio source')?.getAttribute('src')?.toLowerCase() || "";

    card.dataset.title = title;
    card.dataset.artist = artist;
    card.dataset.src = source;
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      songCards.forEach(card => {
        const t = card.dataset.title;
        const a = card.dataset.artist;
        const s = card.dataset.src;
        card.style.display = (t.includes(q) || a.includes(q) || s.includes(q)) ? "" : "none";
      });
    });
  }
});


// SONG PLAY/PAUSE SYSTEM
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


// PROGRESS BAR + SONG TIME 
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".song-card").forEach(card => {
    const audio = card.querySelector('.audio');
    const progressBar = card.querySelector("input[type='range']");
    const currentTimeEl = card.querySelector('#currentTime');
    const durationEl = card.querySelector('#duration');

    if (!audio) return;

    audio.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
      if (progressBar) progressBar.max = Math.floor(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (progressBar) progressBar.value = Math.floor(audio.currentTime);
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    progressBar?.addEventListener('input', () => {
      audio.currentTime = progressBar.value;
    });
  });
});

function formatTime(sec) {
  if (!sec || sec === Infinity) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}


// LIKE BUTTON
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked");
    });
  });
});


// ADD TO PLAYLIST (MongoDB)
document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".addToPlaylistBtn");

  addButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const card = btn.closest(".song-card");

      const title = card.querySelector("h4").innerText;
      const src = card.querySelector("audio source").src;
      const image = card.querySelector("img").src;

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/playlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ title, src, image })
        });

        const data = await res.json();
        alert(data.msg);
      } catch (err) {
        alert("Error adding song");
        console.error(err);
      }
    });
  });
});



// THEME SWITCH
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


// MENU 3-DOT
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector('.menu-btn');
  const menuContainer = document.querySelector('.menu-container');

  if (!menuBtn || !menuContainer) return;

  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    menuContainer.classList.toggle('active');
  });

  window.addEventListener('click', () => {
    menuContainer.classList.remove('active');
  });
});


// LOGOUT 
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "signin.html";
}

