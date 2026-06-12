# 📝 TaskPro

TaskPro is a modern, responsive Full-Stack Task Management application designed to streamline workflows, organize daily objectives, and track productivity metrics. Built using the MERN ecosystem and stylized with Tailwind CSS, TaskPro features a clean dashboard interface, dynamic state filtering, and secure user authentication.

---

## 🚀 Key Features

*   **Dynamic Task Overview Dashboard:** Monitor personal workflow stats at a glance, including Total Tasks, Completed Items, Pending Queue, and live Completion Progress tracking bars.
*   **Granular Creation Controls:** Seamlessly assign tasks with structural metadata:
    *   **Contextual Status Routing:** Choose between *In-Progress* (instantly routes to the Pending board) or *Completed* (instantly archives to Completed).
    *   **Priority Tiers:** Select *Low*, *Medium*, or *High* prioritization badges with reactive UI highlights.
    *   **Due Dates:** Set clear deadlines with localized calendar date transformations.
*   **Isolated Functional Archives:** Separate sub-panels for **Pending Tasks** and a **Completed Archive** with immediate state re-synchronization across layouts upon modification.
*   **Secure API Architecture:** Protected data mutations utilizing JSON Web Tokens (JWT) passing via bearer authorization protocols.

---

## 🛠️ Technology Stack

### Frontend
*   **React.js** (Functional Components, Hooks, Context API)
*   **Tailwind CSS** (Utility-first styling with custom animation extensions)
*   **Lucide React** (Vector icon iconography assets)
*   **Axios** (Promise-based asynchronous HTTP client requests)

### Backend
*   **Node.js & Express.js** (RESTful API endpoints routing architecture)
*   **MongoDB & Mongoose** (NoSQL relational schema structure)
*   **JWT & bcryptjs** (Encrypted authorization tokens and password hashing algorithms)

---

## 📦 Directory Structure

```text
TaskPro/
├── backend/
│   ├── config/             # Database connection setups
│   ├── controllers/        # Request handling logic modules
│   ├── models/             # Mongoose database validation blueprints
│   ├── routes/             # REST API endpoint structures
│   ├── server.js           # Server application entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/         # Global layout design presets
    │   ├── components/     # Reusable interactive components
    │   ├── pages/          # Main sub-views (Dashboard, CompletePage, PendingPage)
    │   ├── App.jsx         # Component router controller
    │   └── main.jsx
    └── package.json
