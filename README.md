# PulseBoard LivePoll Platform

> Full-Stack Real-Time Polling and Feedback Platform built using the MERN Stack.

A production-style hackathon project featuring authentication, protected routes, dynamic poll creation, public poll sharing, analytics dashboard, real-time updates using Socket.io, MongoDB Atlas integration, and VPS deployment.

---

## Overview

PulseBoard is a full-stack real-time polling and feedback platform built using the MERN stack. The application allows users to create polls, share public poll links, collect responses from participants, and analyze results through a live analytics dashboard.

The platform supports both anonymous and authenticated response modes, dynamic question creation, poll expiry systems, protected routes, JWT authentication, real-time updates using Socket.io, and public result publishing.

This project was developed as a hackathon submission focused on full-stack architecture, real-time communication, database design, authentication systems, analytics handling, and production-ready deployment.

---

# Features

## Authentication System

* User Registration
* User Login
* JWT-based Authentication
* Protected Dashboard Routes
* Persistent Login Sessions
* Logout Functionality

---

## Poll Management

* Create Polls
* Add Multiple Questions
* Add Multiple Options
* Mandatory / Optional Questions
* Anonymous or Authenticated Response Mode
* Poll Expiry Time
* Public Poll Sharing
* Delete Polls

---

## Public Poll System

* Public Poll Links
* Response Submission
* Single Option Question Selection
* Mandatory Validation Handling
* Expiry Validation
* Smooth Poll Submission Experience

---

## Analytics Dashboard

* Total Response Count
* Question-wise Analytics
* Option-wise Vote Counts
* Participation Insights
* Publish Final Results
* Public Result Viewing
* Live Updates with Socket.io

---

## Real-Time Features

* Live Analytics Updates
* Real-Time Response Count Updates
* WebSocket Communication using Socket.io

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React Hot Toast
* Socket.io Client

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Socket.io
* PM2

---

## Deployment

* IONOS VPS
* Nginx
* MongoDB Atlas

---

# Project Structure

```bash
PulseBoard/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │   └── api.js
│   │   │
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PollCard.jsx
│   │   │   └── AnalyticsCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreatePoll.jsx
│   │   │   ├── PublicPoll.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Results.jsx
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Poll.js
│   │   └── Response.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── pollRoutes.js
│   │   └── responseRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── screenshots/
│   ├── login.png
│   ├── dashboard.png
│   ├── create-poll.png
│   ├── analytics.png
│   └── results.png
│
├── .gitignore
├── README.md
└── package-lock.json
```

---

# Application Workflow

## User Flow

1. User registers or logs into the platform.
2. User creates a poll.
3. User adds multiple questions and options.
4. User shares the generated public poll link.
5. Respondents open the public poll page.
6. Respondents submit responses.
7. Poll creator views analytics dashboard.
8. Live analytics update in real time.
9. Poll creator publishes final results.
10. Public users can view final poll summaries.

---

# Database Design

## User Schema

Stores:

* Name
* Email
* Password
* Authentication Information

---

## Poll Schema

Stores:

* Poll Title
* Description
* Questions
* Options
* Expiry Date
* Response Mode
* Creator ID
* Publish Status

---

## Response Schema

Stores:

* Poll Reference
* Selected Answers
* User Information
* Submission Time

---

# Frontend Setup

## Step 1 — Clone Repository

```bash
git clone https://github.com/Swagatika1982/LivePulseBoard.git
```

---

## Step 2 — Open Project

```bash
cd PulseBoard
```

---

## Step 3 — Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Step 4 — Start Frontend Development Server

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Backend Setup

## Step 1 — Open Backend Folder

```bash
cd backend
```

---

## Step 2 — Install Backend Dependencies

```bash
npm install
```

---

## Step 3 — Create .env File

Create a `.env` file inside backend folder.

Example:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=your_secret_key
```

---

## Step 4 — Start Backend Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# MongoDB Atlas Setup

## Step 1 — Create MongoDB Atlas Account

Go to MongoDB Atlas and create a free cluster.

---

## Step 2 — Create Database User

Create username and password for database access.

---

## Step 3 — Add Network Access

Add your local IP or allow:

```bash
0.0.0.0/0
```

for development/testing.

---

## Step 4 — Get Connection String

Use the provided MongoDB connection string inside `.env`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pulseboard
```

---

# Socket.io Setup

## Backend

Install:

```bash
npm install socket.io
```

---

## Frontend

Install:

```bash
npm install socket.io-client
```

---

# API Overview

## Authentication APIs

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

---

## Poll APIs

### Create Poll

```http
POST /api/polls
```

### Get User Polls

```http
GET /api/polls/my-polls
```

### Public Poll Access

```http
GET /api/polls/public/:pollId
```

### Publish Results

```http
PATCH /api/polls/:pollId/publish
```

### Delete Poll

```http
DELETE /api/polls/:pollId
```

---

## Response APIs

### Submit Poll Response

```http
POST /api/responses/:pollId
```

### Analytics Dashboard

```http
GET /api/responses/:pollId/analytics
```

### Public Results

```http
GET /api/responses/:pollId/results
```

---

# Deployment Guide

## Backend Deployment on IONOS VPS

### Connect to VPS

```bash
ssh root@YOUR_VPS_IP
```

---

## Install Dependencies

```bash
npm install
```

---

## Install PM2

```bash
npm install pm2 -g
```

---

## Start Backend

```bash
pm2 start server.js --name pulseboard-backend
```

---

## Allow Backend Port

```bash
ufw allow 5000
```

---

# Nginx Reverse Proxy Setup

Example configuration:

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    root /var/www/pulseboard;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000/api;
    }

    location /socket.io {
        proxy_pass http://localhost:5000/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

# Build Frontend

```bash
cd frontend
npm run build
```

Upload generated `dist` folder to VPS.

---

# Future Improvements

* Pie Charts
* UI Improvements
* Better Data Visualization
* Email Notifications
* Poll Templates
* Poll Editing
* User Profiles
* Dark Mode
* Multi-Select Questions
* CSV Export
* Advanced Analytics

---

# Challenges Faced

* JWT Authentication Handling
* Protected Route Management
* Dynamic Form Validation
* Real-Time Socket.io Integration
* VPS Deployment
* MongoDB Atlas Configuration
* CORS and Mixed Content Issues
* Nginx Reverse Proxy Setup

---

# Learning Outcomes

This project helped in understanding:

* Full-stack MERN architecture
* REST API development
* Authentication systems
* Database schema design
* Real-time communication
* Deployment workflows
* VPS hosting
* Reverse proxy configuration
* Production-level project structure

---
# Deployment link

http://74.208.206.245/login

# GitHub Repository

https://github.com/Swagatika1982/LivePulseBoard
---

# Author

Developed by S.Sahoo

Built as a hackathon submission for a Full-Stack Web Development program, 
showcasing end-to-end application architecture, real-time updates, protected APIs, 
analytics handling, and VPS deployment.
