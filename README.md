# Maqam (MERN Stack Edition) 🕌

A full-stack recreation of the **Maqam** Cemetery Location Finder, Grave Records Management, and Infaq Platform built with **Node.js/Express**, **React (Vite)**, and **MongoDB (Mongoose)**.

---

## 🌟 Key Features

1. **Grave Location Finder (Interactive Map)**
   - High-resolution Google Maps (Satellite & Hybrid) centered on cemetery coordinates (`2.909678, 101.464498`).
   - Instant search by Name, IC number, Plot number, or Date of Death.
   - Interactive popups with deceased photos, info cards, and **🚗 Get Directions** (calculates walking route on map + opens Google Maps external navigation).
   - Side panel listing matching records for mobile and desktop.

2. **Admin Grave Records Management (CRUD)**
   - Role-protected administrative dashboard (`/admin/graves`).
   - Search highlighting across Name, IC number, and Plot number.
   - Add and Edit grave records with GPS coordinate validation and image file upload (Multer).
   - Delete record with confirmation modal.

3. **Infaq n Go (Donation Page)**
   - Authentic design card with Lime Green accents.
   - Masjid Al-Hidayah Tabung Pembangunan & Agro Bank Berhad account information (`1005 5410 0001 0976`).
   - DuitNow QR code and one-click "Copy Account Number" action.

4. **Authentication & Authorization**
   - JWT-based authentication with bcrypt password hashing.
   - Role separation: `admin` and `visitor`.
   - User profile management (name, email, password update).

5. **Bilingual Localization (EN / BM)**
   - Instant toggle between **English (EN)** and **Bahasa Melayu (BM)**.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

### 1. Install Dependencies

You can install dependencies for both the server and client simultaneously from the `maqam-mern` root folder:

```bash
cd maqam-mern
npm install
npm run install-all
```

Or install them manually:
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 2. Seed Sample Database

Seed initial admin account (`test@example.com` / `admin123`), visitor account (`visitor@example.com` / `visitor123`), and sample cemetery grave markers:

```bash
cd maqam-mern/server
npm run seed
```

### 3. Run the Development Servers

From the `maqam-mern` root directory:
```bash
npm run dev
```

Or run them in separate terminals:
- **Backend API**: `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend App**: `cd client && npm run dev` (Runs on `http://localhost:5173`)

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `test@example.com` | `admin123` |
| **Visitor** | `visitor@example.com` | `visitor123` |

---

## 📁 Directory Structure

```
maqam-mern/
├── server/
│   ├── src/
│   │   ├── config/db.js              # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth & Profile logic
│   │   │   └── graveController.js    # Grave CRUD & Search
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT & Admin role guard
│   │   │   └── uploadMiddleware.js   # Multer file upload
│   │   ├── models/
│   │   │   ├── User.js               # User Schema
│   │   │   └── Grave.js              # Grave Schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth
│   │   │   └── graveRoutes.js        # /api/graves
│   │   ├── seed.js                   # Database seeder
│   │   └── server.js                 # Express server entry point
│   ├── uploads/                      # Uploaded grave photos
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── assets/                   # Static images and icons
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Bilingual Navbar with auth controls
│   │   │   ├── ProtectedRoute.jsx    # Route protection component
│   │   │   └── Toast.jsx             # Alert toast notifications
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state & JWT storage
│   │   │   └── LanguageContext.jsx   # EN / BM localization
│   │   ├── pages/
│   │   │   ├── MapFinder.jsx         # Google Maps Grave Location Finder
│   │   │   ├── AdminGraveList.jsx    # Admin CRUD records table
│   │   │   ├── GraveForm.jsx         # Create & Edit form with upload
│   │   │   ├── Donation.jsx          # Infaq n Go donation card
│   │   │   ├── Login.jsx             # Sign in
│   │   │   ├── Register.jsx          # Register
│   │   │   └── Profile.jsx           # User profile
│   │   ├── services/
│   │   │   └── api.js                # Axios client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── package.json
└── README.md
```
