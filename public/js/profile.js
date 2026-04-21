//----------------------------------------------------------
// ELEMENTS
//----------------------------------------------------------
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const profilePic = document.getElementById('profilePic');
const uploadPic = document.getElementById('uploadPic');

//----------------------------------------------------------
// GET CURRENT USER EMAIL AS UNIQUE KEY
// ✅ strips the email icon text, gets only email part
//----------------------------------------------------------
const userEmail = document.getElementById('userEmail')
  ?.textContent?.trim()
  .split(/\s+/).pop(); // gets last word = actual email

const defaultAvatar = profilePic.src; // save the avatar URL as fallback

//----------------------------------------------------------
// LOAD SAVED PROFILE PICTURE (per user)
//----------------------------------------------------------
window.onload = () => {
  if (!userEmail) return;
  const savedPic = localStorage.getItem(`profilePic_${userEmail}`);
  if (savedPic) {
    profilePic.src = savedPic; // ✅ load this user's photo
  } else {
    profilePic.src = defaultAvatar; // ✅ fallback to generated avatar
  }
};

//----------------------------------------------------------
// EDIT PROFILE
//----------------------------------------------------------
editBtn.addEventListener('click', () => {
  const nameEl = document.getElementById('userName');
  const nameInput = document.createElement('input');
  nameInput.value = nameEl.textContent.trim();
  nameInput.id = 'nameInput';
  nameInput.classList.add('edit-input');
  nameEl.replaceWith(nameInput);

  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-block';

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
// PROFILE PICTURE UPLOAD (saved per user email)
//----------------------------------------------------------
uploadPic.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePic.src = reader.result;
    localStorage.setItem(`profilePic_${userEmail}`, reader.result); // ✅ per user
  };
  reader.readAsDataURL(file);
});