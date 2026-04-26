//----------------------------------------------------------
// FETCH & DISPLAY RECENTLY PLAYED SONGS
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("songsContainer");
  if (!container) return;

  try {
    const res = await fetch("/api/songs/collection/general");
    const songs = await res.json();

    container.innerHTML = "";

    songs.forEach(song => {
      container.appendChild(createSongCard(song));
    });

    setupPlayer();
    setupProgressBar();
    setupPlaylistButtons();
    setupLikeButtons();
    setupExtraControls();
    setupQueue();

  } catch (err) {
    console.error("Error loading songs:", err);
  }
});


//----------------------------------------------------------
// CREATE SONG CARD (reusable)
//----------------------------------------------------------
function createSongCard(song) {
  const card = document.createElement("div");
  card.classList.add("song-card");
  card.dataset.title = song.title || "";
  card.dataset.artist = song.artist || "";

  card.innerHTML = `
    <img src="${song.imageUrl}" alt="song" />
    <h4>${song.title}</h4>

    <audio class="audio">
      <source src="${song.audioUrl}" type="audio/mpeg"/>
    </audio>

    <div class="controls">
      <button class="playPauseBtn">
        <i class="fas fa-play"></i>
      </button>
      <input type="range" class="progressBar" value="0">
      <span class="currentTime">0:00</span> /
      <span class="duration">0:00</span>
    </div>

    <div class="extra-controls">
      <button class="repeatBtn" title="Repeat">
        <i class="fas fa-redo"></i>
      </button>
      <button class="shuffleBtn" title="Shuffle">
        <i class="fas fa-random"></i>
      </button>
      <div class="volume-control">
        <i class="fas fa-volume-up volume-icon"></i>
        <input type="range" class="volumeBar" min="0" max="1" step="0.01" value="1">
      </div>
    </div>

    <div class="button-row">
      <button class="like-btn">
        <i class="fa-solid fa-thumbs-up"></i>
      </button>
      <button class="addToPlaylistBtn">+ Add</button>
      <button class="addToQueueBtn" title="Add to Queue">
        <i class="fas fa-list"></i> Queue
      </button>
    </div>
  `;

  return card;
}


//----------------------------------------------------------
// SEARCH SYSTEM — searches ALL songs from backend
//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  const searchResultsContainer = document.getElementById("search-results-container");
  const searchTitle = document.getElementById("searchTitle");
  const recentSection = document.getElementById("recentSection");
  const collectionsSection = document.getElementById("collectionsSection");

  let searchTimeout = null;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    // ✅ Clear previous timeout (debounce)
    clearTimeout(searchTimeout);

    if (!query) {
      // ✅ Reset — show everything
      if (searchResultsContainer) searchResultsContainer.innerHTML = "";
      if (searchTitle) searchTitle.style.display = "none";
      if (recentSection) recentSection.style.display = "block";
      if (collectionsSection) collectionsSection.style.display = "block";
      return;
    }

    // ✅ Hide normal sections, show search
    if (recentSection) recentSection.style.display = "none";
    if (collectionsSection) collectionsSection.style.display = "none";
    if (searchTitle) {
      searchTitle.style.display = "block";
      searchTitle.textContent = `🔍 Results for "${query}"`;
    }

    // ✅ Debounce — wait 300ms before searching
    searchTimeout = setTimeout(async () => {
      try {
        searchResultsContainer.innerHTML = `
          <p style="color:#aaa; text-align:center; width:100%; padding:20px;">
            Searching...
          </p>`;

        const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
        const songs = await res.json();

        searchResultsContainer.innerHTML = "";

        if (!songs.length) {
          searchResultsContainer.innerHTML = `
            <p style="color:#aaa; text-align:center; width:100%; padding:40px;">
              😔 No songs found for "<strong>${query}</strong>"
            </p>`;
          return;
        }

        // ✅ Client-side fuzzy filter on top of backend results
        const filtered = songs.filter(song => {
          const title = (song.title || "").toLowerCase();
          const artist = (song.artist || "").toLowerCase();
          const q = query.toLowerCase();
          return isFuzzyMatch(title, q) || isFuzzyMatch(artist, q);
        });

        if (!filtered.length) {
          searchResultsContainer.innerHTML = `
            <p style="color:#aaa; text-align:center; width:100%; padding:40px;">
              😔 No songs found for "<strong>${query}</strong>"
            </p>`;
          return;
        }

        filtered.forEach(song => {
          const card = createSongCard(song);
          searchResultsContainer.appendChild(card);
        });

        // ✅ Setup player for new cards
        setupPlayer();
        setupProgressBar();
        setupPlaylistButtons();
        setupLikeButtons();
        setupExtraControls();
        setupQueue();

      } catch (err) {
        console.error("Search error:", err);
        searchResultsContainer.innerHTML = `
          <p style="color:red; text-align:center; width:100%;">
            Error searching. Try again.
          </p>`;
      }
    }, 300);
  });
});


//----------------------------------------------------------
// FUZZY MATCH HELPER
//----------------------------------------------------------
function isFuzzyMatch(text, search) {
  if (!text || !search) return false;
  if (text.includes(search)) return true;

  const searchWords = search.split(" ").filter(w => w.length > 0);
  const titleWords = text.split(" ");

  return searchWords.every(word => {
    return titleWords.some(tWord => {
      if (tWord === word) return true;
      if (tWord.startsWith(word) || word.startsWith(tWord)) return true;
      if (word.length < 4) return tWord.includes(word);
      if (Math.abs(tWord.length - word.length) > 1) return false;
      let mismatches = 0;
      const minLen = Math.min(tWord.length, word.length);
      for (let i = 0; i < minLen; i++) {
        if (tWord[i] !== word[i]) mismatches++;
        if (mismatches > 1) return false;
      }
      return mismatches <= 1;
    });
  });
}


//----------------------------------------------------------
// PLAY / PAUSE SYSTEM
//----------------------------------------------------------
function setupPlayer() {
  const buttons = document.querySelectorAll(".playPauseBtn");
  const audios = document.querySelectorAll(".audio");

  let currentAudio = null;
  let currentBtn = null;

  buttons.forEach((btn, i) => {
    const audio = audios[i];
    const icon = btn.querySelector("i");

    btn.addEventListener("click", () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentBtn.querySelector("i").classList.replace("fa-pause", "fa-play");
      }

      if (audio.paused) {
        audio.play();
        icon.classList.replace("fa-play", "fa-pause");
        currentAudio = audio;
        currentBtn = btn;
      } else {
        audio.pause();
        icon.classList.replace("fa-pause", "fa-play");
      }

      audio.addEventListener("ended", () => {
        icon.classList.replace("fa-pause", "fa-play");
      });
    });
  });
}


//----------------------------------------------------------
// PROGRESS BAR + TIME
//----------------------------------------------------------
function setupProgressBar() {
  const cards = document.querySelectorAll(".song-card");

  cards.forEach(card => {
    const audio = card.querySelector(".audio");
    const progress = card.querySelector(".progressBar");
    const current = card.querySelector(".currentTime");
    const duration = card.querySelector(".duration");

    if (!audio) return;

    audio.addEventListener("loadedmetadata", () => {
      duration.textContent = formatTime(audio.duration);
      progress.max = Math.floor(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      progress.value = Math.floor(audio.currentTime);
      current.textContent = formatTime(audio.currentTime);
    });

    progress.addEventListener("input", () => {
      audio.currentTime = progress.value;
    });
  });
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}


//----------------------------------------------------------
// LIKE BUTTON SYSTEM
//----------------------------------------------------------
function setupLikeButtons() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked");
    });
  });
}


//----------------------------------------------------------
// ADD TO PLAYLIST
//----------------------------------------------------------
function setupPlaylistButtons() {
  document.querySelectorAll(".addToPlaylistBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const card = btn.closest(".song-card");
      const title = card.querySelector("h4").textContent;
      const src = card.querySelector("audio source").src;
      const image = card.querySelector("img").src;

      try {
        const res = await fetch("/api/playlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, src, image })
        });

        const data = await res.json();
        alert(data.msg);

      } catch (err) {
        console.error("Playlist error:", err);
      }
    });
  });
}


//----------------------------------------------------------
// REPEAT, SHUFFLE & VOLUME
//----------------------------------------------------------
function setupExtraControls() {
  document.querySelectorAll(".song-card").forEach(card => {
    const audio = card.querySelector(".audio");
    const repeatBtn = card.querySelector(".repeatBtn");
    const shuffleBtn = card.querySelector(".shuffleBtn");
    const volumeBar = card.querySelector(".volumeBar");
    const volumeIcon = card.querySelector(".volume-icon");

    if (!repeatBtn || !shuffleBtn || !volumeBar) return;

    let isRepeat = false;
    let isShuffle = false;

    repeatBtn.addEventListener("click", () => {
      isRepeat = !isRepeat;
      audio.loop = isRepeat;
      repeatBtn.classList.toggle("active-control", isRepeat);
    });

    shuffleBtn.addEventListener("click", () => {
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle("active-control", isShuffle);
      if (isShuffle) {
        audio.addEventListener("ended", playRandom);
      } else {
        audio.removeEventListener("ended", playRandom);
      }
    });

    function playRandom() {
      const allCards = document.querySelectorAll(".song-card");
      const randomIndex = Math.floor(Math.random() * allCards.length);
      allCards[randomIndex].querySelector(".playPauseBtn").click();
    }

    volumeBar.addEventListener("input", () => {
      audio.volume = volumeBar.value;
      if (volumeBar.value == 0) {
        volumeIcon.className = "fas fa-volume-mute volume-icon";
      } else if (volumeBar.value < 0.5) {
        volumeIcon.className = "fas fa-volume-down volume-icon";
      } else {
        volumeIcon.className = "fas fa-volume-up volume-icon";
      }
    });
  });
}


//----------------------------------------------------------
// QUEUE
//----------------------------------------------------------
function setupQueue() {
  document.querySelectorAll(".addToQueueBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".song-card");
      const title = card.querySelector("h4").textContent;
      const audioUrl = card.querySelector("audio source").src;
      const imageUrl = card.querySelector("img").src;

      if (typeof addToQueue === "function") {
        addToQueue({ title, audioUrl, imageUrl });
      }

      btn.innerHTML = '<i class="fas fa-check"></i> Added';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-list"></i> Queue';
      }, 1500);
    });
  });
}


//----------------------------------------------------------
// MENU DROPDOWN
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
// LOGOUT
//----------------------------------------------------------
function logout() {
  fetch("/logout", { credentials: "include" })
    .then(() => window.location.href = "/");
}