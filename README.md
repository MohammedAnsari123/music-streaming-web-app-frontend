# StreamLite - User Frontend Application

**StreamLite** is a modern, high-performance music streaming web application designed to provide a seamless listening experience. It leverages a unique hybrid architecture, combining **Spotify's** rich metadata for discovery with the **Audius Network's** decentralized audio streaming for playback.

This documentation covers the architecture, features, technology stack, and setup instructions for the User Frontend.

---

## 📚 Table of Contents
- [Overview](#overview)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Setup & Installation](#️-setup--installation)
- [🎨 UI/UX Design System](#-uiux-design-system)
- [🔧 Core Components](#-core-components)

---

## Overview
The User Frontend is the public-facing interface where users interact with the platform. It is built as a **Single Page Application (SPA)** using React and Vite, ensuring fast load times and smooth transitions. It communicates with the StreamLite Backend API to fetch data and resolve audio streams.

---

## ✨ Key Features

### 🎵 Music Playback System
*   **Persistent Player:** A global audio player bar that remains active across page navigation (`AudioPlayer.jsx`).
*   **Smart Resolution:** Automatically bridges Spotify metadata to playable Audius streams.
*   **Controls:** Play, Pause, Next, Previous, Shuffle, Repeat, Volume Control, and Seek Bar.
*   **Error Handling:** Graceful fallbacks for unplayable tracks (e.g., "Track not available").

### 🔍 Discovery & Search
*   **Unified Search:** Real-time search that queries both the local library and external APIs (`/api/search`).
*   **Debounced Input:** Optimized search input to reduce API calls.
*   **Category Filtering:** Filter music by genres (Pop, Rock, Indiewave, etc.) on the dashboard.

### 👤 User Experience
*   **Landing Page:** immersive entrance with interactive Canvas API particle animations (`landingPage.jsx`).
*   **Authentication:** Secure Login and Sign-up forms with JWT token management (`AuthContext.jsx`).
*   **Dashboard:** Personalized home feed showing "Recently Played" and recommended tracks.

### 📚 Library Management
*   **Liked Songs:** Dedicated view for user-favorited tracks.
*   **Playlists:** Create, view, and manage custom playlists.
*   **Podcasts:** Browse and listen to episodic podcast content.

---

## 🛠️ Technology Stack

### Core Frameworks
*   **[React 18+](https://react.dev/):** UI Library for building component-based interfaces.
*   **[Vite](https://vitejs.dev/):** Next-generation frontend tooling for ultra-fast development and building.

### Styling & Animation
*   **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for rapid, responsive design.
*   **[Lucide React](https://lucide.dev/):** Beautiful, consistent icon set.
*   **HTML5 Canvas:** Used for high-performance background particle animations.
*   **CSS Modules/Global:** Custom variables for theming (Green/Black aesthetic).

### State Management & Routing
*   **Context API:** Native React state management used for:
    *   `AuthContext`: User session and token storage.
    *   `AudioPlayerContext`: Global playback state (current track, queue, isPlaying).
*   **[React Router DOM](https://reactrouter.com/):** Client-side routing for seamless navigation.

### Utilities
*   **Fetch API:** For HTTP requests to the Backend.
*   **Prop-Types:** (Implicit usage via component props) for data validation.

---

## 📂 Project Structure

```text
frontend/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── components/         # Reusable UI Blocks
│   │   ├── AudioPlayer.jsx    # The global music player bar
│   │   ├── Navbar.jsx         # Top navigation
│   │   ├── Sidebar.jsx        # (Deprecated/Removed for User App)
│   │   ├── TrackCard.jsx      # Individual song display card
│   │   ├── AnimatedBackground # Canvas particle effect
│   │   └── ...
│   │
│   ├── context/            # Global State Logic
│   │   ├── AuthContext.jsx       # Login/Signup logic
│   │   ├── AudioPlayerContext.jsx # Playback engine & Spotify->Audius bridge
│   │   └── PrivateRoutes.jsx     # Route protection wrapper
│   │
│   ├── pages/              # Page Views
│   │   ├── landingPage.jsx    # Public entrance page
│   │   ├── user/              # Authenticated User Pages
│   │   │   ├── userLogin.jsx
│   │   │   ├── userMusicDashboard.jsx
│   │   │   ├── LikedSongs.jsx
│   │   │   └── ...
│   │
│   ├── App.jsx             # Main Route Definitions
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles & Tailwind directives
│
├── .env                    # Environment variables
├── index.html              # HTML root
├── package.json            # Dependencies
├── postcss.config.js       # CSS processing config
├── tailwind.config.js      # Tailwind theme config
└── vite.config.js          # Vite bundler config
```

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v16 or higher)
*   NPM (Node Package Manager)

### Installation Steps

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Ensure backend is running on `http://localhost:3000` (default expectation). If changed, update API layouts.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

---

## 🎨 UI/UX Design System

*   **Color Palette:**
    *   **Primary:** StreamLite Green (`#22C55E`)
    *   **Background:** Deep Black (`#000000`) & Dark Gray (`#121212`)
    *   **Text:** White (`#FFFFFF`) & Light Gray (`#A1A1AA`)
*   **Typography:** Sans-serif (System default / Inter-like).
*   **Responsiveness:** Fully responsive design using Tailwind's mobile-first breakpoints (`sm`, `md`, `lg`).

---

## 🔧 Core Components Explanation

### `AudioPlayerContext.jsx` (The Brain)
This is the most critical file. It manages:
*   **Queue Management:** Next/Prev logic.
*   **Resolution Bridge:** When a track with `source: 'spotify'` is requested, it calls the backend `/api/resolve` endpoint to find the corresponding audio stream on Audius before playing.
*   **State:** `isPlaying`, `currentTrack`, `volume`, `duration`.

### `AudioPlayer.jsx` (The Interface)
The visual player bar. It consumes the context to update the seek bar, display album art, and handle user clicks. It uses the native HTML5 `<audio>` tag but controls it programmatically via React refs.
