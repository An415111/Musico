#  Musico

Musico is a full-stack music streaming web app built with Node.js, Express, MongoDB, and EJS. It includes authentication, music player, playlists, lyrics, and an admin panel.

---

## Live Demo
Coming soon...

---

##  Tech Stack

- Node.js, Express.js
- MongoDB (Mongoose)
- EJS, HTML, CSS, JavaScript
- JWT (httpOnly cookies)
- Cloudinary, Nodemailer

---

##  Features

-  OTP-based Signup & Login  
-  Music player (play, pause, shuffle, repeat, volume)  
-  Lyrics (API integration)  
-  Playlist & Queue system  
-  Recently Played  
-  Search functionality  
-  Dark/Light mode  
-  Profile update  
-  Admin panel (add/delete songs)  

---

##  Setup

```bash
git clone https://github.com/An415111/musico.git
cd musico
npm install

```

Create a `.env` file inside the `backend` folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
CLOUDINARY_URL=your_cloudinary_url
```

Run the project:

```bash
node backend/server.js
```
## 🌐 Live Demo
https://musico-1-de4o.onrender.com