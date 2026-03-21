// Get Elements
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const profilePic = document.getElementById('profilePic');
const uploadPic = document.getElementById('uploadPic');

// Load saved data from localStorage
window.onload = () => {
  const savedName = localStorage.getItem('userName');
  const savedEmail = localStorage.getItem('userEmail');
  const savedPic = localStorage.getItem('profilePic');

  if (savedName) userName.textContent = savedName;
  if (savedEmail) userEmail.textContent = savedEmail;
  if (savedPic) profilePic.src = savedPic;
};

// Edit button click
editBtn.addEventListener('click', () => {
  const nameInput = document.createElement('input');
  nameInput.value = userName.textContent;
  nameInput.id = 'nameInput';
  nameInput.classList.add('edit-input');

  const emailInput = document.createElement('input');
  emailInput.value = userEmail.textContent;
  emailInput.id = 'emailInput';
  emailInput.classList.add('edit-input');

  userName.replaceWith(nameInput);
  userEmail.replaceWith(emailInput);

  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-block';

  profilePic.addEventListener('click', () => uploadPic.click());
});

// Save button click
saveBtn.addEventListener('click', () => {
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');

  const newName = document.createElement('h2');
  newName.id = 'userName';
  newName.textContent = nameInput.value;
  newName.style.color = '#00ff6a';

  const newEmail = document.createElement('p');
  newEmail.className = 'email';
  newEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> <span id="userEmail">${emailInput.value}</span>`;

  nameInput.replaceWith(newName);
  emailInput.replaceWith(newEmail);

  // Save to localStorage
  localStorage.setItem('userName', nameInput.value);
  localStorage.setItem('userEmail', emailInput.value);

  editBtn.style.display = 'inline-block';
  saveBtn.style.display = 'none';
});

// Upload profile picture
uploadPic.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result;
      localStorage.setItem('profilePic', reader.result);
    };
    reader.readAsDataURL(file);
  }
});
