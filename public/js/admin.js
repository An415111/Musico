function goBack() {
  window.location.href = "/music";
}

async function addSong() {
  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const audioUrl = document.getElementById("audioUrl").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const collection = document.getElementById("collection").value;

  if (!title || !artist || !audioUrl || !imageUrl) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await fetch("/api/admin/add-song", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, artist, audioUrl, imageUrl, collection }) // ✅
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.msg || "Error adding song");
      return;
    }

    const data = await res.json();
    alert(data.msg || "Song added successfully");

    document.getElementById("title").value = "";
    document.getElementById("artist").value = "";
    document.getElementById("audioUrl").value = "";
    document.getElementById("imageUrl").value = "";

  } catch (err) {
    console.error("Add song error:", err);
    alert("Server error");
  }
}

async function loadSongsForDelete() {
  const res = await fetch("/api/songs", { credentials: "include" });
  const songs = await res.json();

  const select = document.getElementById("deleteSongSelect");
  select.innerHTML = '<option value="">-- Select Song to Delete --</option>';

  songs.forEach(song => {
    const option = document.createElement("option");
    option.value = song._id;
    option.textContent = `${song.title} (${song.artist || song.category})`;
    select.appendChild(option);
  });
}

async function deleteSong() {
  const id = document.getElementById("deleteSongSelect").value;

  if (!id) {
    alert("Please select a song to delete");
    return;
  }

  if (!confirm("Are you sure you want to delete this song?")) return;

  try {
    const res = await fetch(`/api/admin/delete-song/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();
    alert(data.msg);
    loadSongsForDelete();

  } catch (err) {
    console.error("Delete error:", err);
    alert("Server error");
  }
}

loadSongsForDelete();