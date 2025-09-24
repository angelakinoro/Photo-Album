# PhotoAlbums App

A full-stack web application that allows users to explore users, their albums, and album photos, with the ability to edit photo titles.  

---

## Features

- **Landing Page** – Public introduction to the app.  
- **Authentication** – Login with Firebase (Google auth).  
- **Home Page** – Lists all users and shows how many albums each user has.  
- **User Page** – Displays user details and their albums.  
- **Album Page** – Displays an album’s details and its photos.  
- **Photo Page** – Displays a single photo, allows editing of the photo title (PATCH request).  
- **Responsive Design** – Mobile, tablet, and desktop friendly.  
- **Protected Routes** – Logged-in users only can access Home, User, Album, and Photo pages.  

---

## Tech Stack

### Frontend
- **React (Vite + TypeScript)** – Component-based UI  
- **Tailwind CSS** – Utility-first styling  
- **shadcn/ui** – Polished UI components (Cards, Badges, Buttons, etc.)  
- **lucide-react** – Icons for improved UX  
- **React Router DOM** – Client-side routing  
- **Axios** – API requests  

### Backend
- **Node.js + Express** – REST API server  
- **Prisma ORM** – Database schema & migrations  
- **Supabase (Postgres)** – Cloud-hosted relational database  
- **Axios** – Fetching seed data from external API  

### Authentication
- **Firebase Authentication** – Google sign-in, session management  

---


---

## Database & Seeding

The app uses **Supabase** (Postgres) as the database.  

- Prisma manages migrations and schema definition.  
- Seeding is done via the [jsonplaceholder API](https://jsonplaceholder.typicode.com/), which provides mock users, albums, and photos.  
- The `prisma/seed.ts` script fetches data from the external API and populates the Supabase Postgres instance.  

### Example seed flow:
1. Fetch all users, albums, and photos from jsonplaceholder.  
2. Insert them into Supabase via Prisma.  
3. Backend APIs then serve this data to the frontend.  

---

## Firebase Configuration

Firebase Authentication is used for Google Sign-In.  

Steps:
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).  
2. Enable **Google Provider** in the Authentication section.  
3. Add your app credentials (`apiKey`, `authDomain`, etc.) to a `.env` file or directly into `firebase.ts`.  

---

## API Endpoints

### Users

-   `GET /api/users` → List all users
-   `GET /api/users/:id` → Get a single user

### Albums

-   `GET /api/albums` → List all albums
-   `GET /api/albums/:id` → Get an album and its photos

### Photos

-   `GET /api/photos/:id` → Get a single photo
-   `PATCH /api/photos/:id` → Update photo title

---

## Running Locally
### Prerequisites

-   Node.js (>=18)

-   Supabase (Postgres instance)

### Backend Setup

`cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev`

### Frontend Setup

`cd frontend
npm install
npm run dev`

---

### Author
**Angela Kinoro**



