# Unified Knowledge Gateway (UKG)
### Ethio Telecom - Knowledge Management System

## Overview
The **Unified Knowledge Gateway (UKG)** is a modern, custom-built application designed to shift Ethio Telecom's IT Operations & Maintenance and Backbone Transmission sections from a generic "Reactive Maintenance Culture" to a "Proactive Knowledge Architecture." 

By simulating a Notion-like relational knowledge base, it explicitly captures **Tacit Knowledge** and **Crown Jewel** expertise, mapping documents to specific Ethiopian geographical regions and hardware states.

## Project Deliverables Compliance
The system was custom built to achieve the findings of the KM Report:

- **Central Intelligence Library**: Metadata-tagged MongoDB collection connecting documents, users, and tags (`/library`).
- **Upload Center & Duplicate Prevention Gate**: Checkbox requirement enforcing validation of `Technology Version` to block duplicate knowledge uploads by regional teams. Role-Based Access Control restricts non-experts from authoring Crown Jewels outright (`/upload`).
- **Expert Directory & Tacit Knowledge "Expert Link"**: 3-Tier Expertise mapping to users. Every document dynamically renders the author on a linked sidebar to simulate the "Side-by-Side Asking Culture".
- **Local Performance Layers**: A dedicated commenting/layering system underneath primary records allowing Regional Technicians to append geography-specific behaviors to core procedures without modifying the core document itself.
- **Contribution Analytics Dashboard**: Recharts-based metrics tracking document utilization directly answering the "Weekly Presentations graveyard" dilemma by highlighting highly utilized internal tech solutions.
- **Branding**: Implemented modern, vibrant design with primary hex `00A650` (Ethio Green) and `8CC63F` for secondary highlights.

## Tech Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v3, React Router v6, TanStack Query, Zustand, Recharts, Lucide-React, React-Quill
- **Backend:** Node.js, Express, MongoDB with Mongoose Schema references, JWT Authentication, Multer file upload setup.

## Setup & Run Instructions

### 1. Prerequisites 
- Node.js (v18+)
- MongoDB running locally on `localhost:27017`

*(Ensure Mongo service is up `net start MongoDB` on windows before proceeding)*

### 2. Backend Initialization
Open a terminal in the `/backend` folder:
```bash
cd backend
npm install

# Optional: Generate your own local environment if not using the default hardcoded dev fallback.
cp ../.env.example .env

# Seed the Database with 3-Tier Users and sample Knowledge
npm run seed

# Run Backend API Server 
npm run dev
```
*(The server will run on `http://localhost:5000`)*

### 3. Frontend Initialization
Open a new terminal in the `/frontend` folder:
```bash
cd frontend
npm install

# Run the Vite Development Server
npm run dev
```

### 4. Logging In
After seeding the database, you can log in to the App (running at `http://localhost:5173`) using the following accounts representing the 3-Tier Hierarchy:

- **Global Admin**: `admin@ethiotelecom.et` / `password123`
- **Core Expert**: `abebe.b@ethiotelecom.et` / `password123`
- **Regional Technician**: `fatuma.r@ethiotelecom.et` / `password123` *(Notice how this role is restricted from uploading Root Cause Analysis at the Upload section, but CAN post Local Performance Layers)*
