# Palaj Yuvak Mandal Attendance System

A full-stack MERN application for managing attendance, members, and announcements.

## Features
- **Role-Based Access**: Admin (Full Access) vs Super Admin (Read Only).
- **Attendance**: Mark Present/Absent, History, Dashboard Stats.
- **Announcements**: Bulk Email Support.
- **Reports**: Dashboard Visuals.

## Setup Instructions

### 1. Backend Setup
1. Navigate to `/backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` file (already created with defaults). Update `MONGO_URI` if needed.
4. Run Database Seeder (Initial Data):
   ```bash
   node seeder.js
   ```
   *Creates Admin: `admin@baps.com` / `password123`*
   *Creates Super Admin: `super@baps.com` / `password123`*
5. Start Server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Dev Server:
   ```bash
   npm run dev
   ```

## Tech Stack
- MongoDB, Express, React, Node.js
- Tailwind CSS, Recharts, HeadlessUI
- Nodemailer, JWT Auth

## Project Structure
- `backend/models`: Database Schemas
- `backend/controllers`: Business Logic
- `frontend/src/pages`: React Pages
- `frontend/src/context`: Auth State Management
"# BAPS-Palaj" 
