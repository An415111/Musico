//----------------------------------------------------------
// ELEMENTS
//----------------------------------------------------------
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const profilePic = document.getElementById('profilePic');
const uploadPic = document.getElementById('uploadPic');

//----------------------------------------------------------
// LOAD SAVED PROFILE PICTURE
//----------------------------------------------------------
window.onload = () => {
  const savedPic = localStorage.getItem('profilePic');
  if (savedPic) {
    profilePic.src = savedPic;
  }
};

//----------------------------------------------------------
// EDIT PROFILE - click profile pic to upload
//----------------------------------------------------------
editBtn.addEventListener('click', () => {
  // Make name editable
  const nameEl = document.getElementById('userName');
  const nameInput = document.createElement('input');
  nameInput.value = nameEl.textContent.trim();
  nameInput.id = 'nameInput';
  nameInput.classList.add('edit-input');
  nameEl.replaceWith(nameInput);

  // Show save, hide edit
  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-block';

  // Click profile pic to change photo
  profilePic.style.cursor = 'pointer';
  profilePic.title = 'Click to change photo';
  profilePic.addEventListener('click', () => uploadPic.click());
});

//----------------------------------------------------------
// SAVE PROFILE
//----------------------------------------------------------
saveBtn.addEventListener('click', async () => {
  const nameInput = document.getElementById('nameInput');
  const newName = nameInput.value.trim();

  if (!newName) {
    alert("Name cannot be empty");
    return;
  }

  const parts = newName.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || "";

  try {
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ firstName, lastName })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Error saving profile");
      return;
    }

    // Update UI
    const newNameEl = document.createElement('h2');
    newNameEl.id = 'userName';
    newNameEl.textContent = newName;
    nameInput.replaceWith(newNameEl);

    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    profilePic.style.cursor = 'default';

    alert("Profile updated successfully!");

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});

//----------------------------------------------------------
// PROFILE PICTURE UPLOAD (saved in localStorage)
//----------------------------------------------------------
uploadPic.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePic.src = reader.result;
    localStorage.setItem('profilePic', reader.result); // saved locally
  };
  reader.readAsDataURL(file);
});