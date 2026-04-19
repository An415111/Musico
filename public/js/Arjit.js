document.querySelectorAll('.playPauseBtn').forEach(btn => {
  btn.addEventListener('click', function () {
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-play');
    icon.classList.toggle('fa-pause');
  });
});

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
      if (currentBtn) {
        currentBtn.querySelector("i").classList.remove("fa-pause");
        currentBtn.querySelector("i").classList.add("fa-play");
      }
    }

    if (audio.paused) {
      audio.play();
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
      currentAudio = audio;
      currentBtn = button;
    } else {
      audio.pause();
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
      currentAudio = null;
      currentBtn = null;
    }

    // Reset icon on song end
    audio.addEventListener("ended", () => {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
      currentAudio = null;
      currentBtn = null;
    });
  });
});

//This is for time duration and range
document.querySelectorAll(".song-card").forEach(card => {
    const audio = card.querySelector(".audio");
    const progressBar = card.querySelector("input[type='range']");
    const currentTimeEl = card.querySelector("#currentTime");
    const durationEl = card.querySelector("#duration");

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
    audio.addEventListener("ended", () => {
        progressBar.value = 0;
        currentTimeEl.textContent = "0:00";
    });
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}




function initMusicFunctions() {
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
        if (currentBtn) {
          currentBtn.querySelector("i").classList.remove("fa-pause");
          currentBtn.querySelector("i").classList.add("fa-play");
        }
      }
      if (audio.paused) {
        audio.play();
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
        currentAudio = audio;
        currentBtn = button;
      } else {
        audio.pause();
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
        currentAudio = null;
        currentBtn = null;
      }
      audio.addEventListener("ended", () => {
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      });
    });
  });
}



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