//----------------------------------------------------------
// SONG QUEUE SYSTEM
//----------------------------------------------------------
let songQueue = [];
let isPlayingFromQueue = false;

const queuePanel = document.getElementById("queuePanel");
const queueList = document.getElementById("queueList");
const miniQueue = document.getElementById("miniQueue");
const closeQueue = document.getElementById("closeQueue");
const clearQueue = document.getElementById("clearQueue");

// TOGGLE QUEUE PANEL
miniQueue?.addEventListener("click", () => {
  queuePanel.style.display = 
    queuePanel.style.display === "none" ? "flex" : "none";
  renderQueue();
});

closeQueue?.addEventListener("click", () => {
  queuePanel.style.display = "none";
});

// ADD TO QUEUE
function addToQueue(song) {
  songQueue.push(song);
  renderQueue();

  if (miniQueue) {
    miniQueue.innerHTML = `<i class="fas fa-list"></i>
      ${songQueue.length > 0 ? 
        `<span class="queue-count">${songQueue.length}</span>` : ""}`;
  }
}

// RENDER QUEUE LIST
function renderQueue() {
  if (!queueList) return;
  queueList.innerHTML = "";

  if (songQueue.length === 0) {
    queueList.innerHTML = `
      <p style="color:#aaa; text-align:center; padding:20px;">
        Queue is empty. Add songs using the Queue button!
      </p>`;
    return;
  }

  songQueue.forEach((song, index) => {
    const item = document.createElement("div");
    item.classList.add("queue-item");

    item.innerHTML = `
      <img src="${song.imageUrl}" alt="${song.title}"/>
      <span>${song.title}</span>
      <div class="queue-item-btns">
        <button onclick="playFromQueue(${index})" title="Play">
          <i class="fas fa-play"></i>
        </button>
        <button onclick="removeFromQueue(${index})" title="Remove">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    queueList.appendChild(item); // ✅ removed container.appendChild(item)
  });
}

// PLAY FROM QUEUE
function playFromQueue(index) {
  if (index >= songQueue.length) return;

  const song = songQueue[index];
  songQueue.splice(0, index + 1);

  const tempAudio = new Audio(song.audioUrl);
  tempAudio.play();

  if (typeof activateMiniPlayer === "function") {
    activateMiniPlayer(tempAudio, song.title, song.imageUrl);
  }

  tempAudio.addEventListener("ended", () => {
    if (songQueue.length > 0) {
      playFromQueue(0);
    }
  });

  renderQueue();
}

// REMOVE FROM QUEUE
function removeFromQueue(index) {
  songQueue.splice(index, 1);
  renderQueue();

  if (miniQueue) {
    miniQueue.innerHTML = `<i class="fas fa-list"></i>
      ${songQueue.length > 0 ? 
        `<span class="queue-count">${songQueue.length}</span>` : ""}`;
  }
}

// CLEAR QUEUE
clearQueue?.addEventListener("click", () => {
  songQueue = [];
  renderQueue();
  if (miniQueue) {
    miniQueue.innerHTML = `<i class="fas fa-list"></i>`;
  }
});