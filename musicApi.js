const YOUTUBE_API_KEY = "AIzaSyAD0KwTkrv-Zo8cHiF0jwwUd6OWVJeerWk";

window.player = null;
window.playerReady = false;
window.pendingVideoId = null;

// =============================
// YOUTUBE PLAYER INITIALIZATION
// =============================
window.onYouTubeIframeAPIReady = function () {
  window.player = new YT.Player('yt-player', {
    height: '360',
    width: '640',
    videoId: '',
    playerVars: {
      autoplay: 1
    },
    events: {
      onReady: function () {
        console.log("Player is FULLY ready ✅");
        window.playerReady = true;

        // If user already clicked a song before ready
        if (window.pendingVideoId) {
          window.player.loadVideoById(window.pendingVideoId);
          window.pendingVideoId = null;
        }
      }
    }
  });
};

// =============================
// SEARCH INPUT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query !== "") {
        searchYouTube(query);
      }
    }
  });
});

// =============================
// SEARCH YOUTUBE
// =============================
async function searchYouTube(query) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
  );

  const data = await response.json();
  displayResults(data.items);
}

// =============================
// DISPLAY RESULTS
// =============================
function displayResults(videos) {
  const container = document.getElementById("youtube-results");
  const title = document.getElementById("searchTitle");

  title.style.display = "block";
  container.innerHTML = "";

  videos.forEach(video => {
    if (!video.id.videoId) return;

    const videoId = video.id.videoId;
    const titleText = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.medium.url;

    const card = document.createElement("div");
    card.classList.add("song-card");

    card.innerHTML = `
      <img src="${thumbnail}" />
      <h4>${titleText}</h4>
      <div class="controls">
        <button onclick="playVideo('${videoId}')">
          <i class="fas fa-play"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// =============================
// PLAY FUNCTION
// =============================
function playVideo(videoId) {

  if (window.playerReady) {
    window.player.loadVideoById(videoId);
  } else {
    console.log("Player not ready yet, saving video...");
    window.pendingVideoId = videoId;
  }
}