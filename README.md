# AnimeVault 🌸 - Full Stack Web Application

AnimeVault is a full-stack web application designed for searching, tracking, and reviewing anime titles. This project was developed as a final exam for the Web Application Development course.
🚀 Tech Stack

    Frontend: Vue.js 3 (Composition API), TypeScript, Pinia, Bootstrap 5

    Backend: Node.js, Express, TypeORM

    Database: MySQL (wad_exam_db)

    External API: Jikan API (MyAnimeList v4)

🛠️ Installation & Setup
1. Database Configuration

Create a new schema named wad_exam_db in MySQL. Update your database credentials in backend/src/data-source.ts (or your .env file).
2. Backend Setup
Bash

cd backend
npm install
npm run dev

The server will be running at http://localhost:3000
3. Frontend Setup
Bash

cd frontend
npm install
npm run dev

The application will be accessible at http://localhost:5173
✨ Key Features

    Secure Authentication: User registration and login with hashed passwords using bcrypt.

    Dynamic Search: Efficient anime search functionality with API request optimization.

    Personalized Lists: Users can add titles to their "My List" with custom statuses (Watching, Completed, Dropped).

    Reviews & Ratings: Ability to rate (1-10) and leave comments on specific titles.

    Responsive Design: Fully optimized UI for mobile and desktop devices.

👥 Author

Mej Ivanović Singidunum University, 2026

Under the mentorship of Professor Bojan Papaz
