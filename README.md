<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

<h1 align="center">BlogSphere</h1>

<p align="center">
  <b>A modern, full-stack blogging platform built for writers and readers. Fast, beautiful, and secure.</b>
</p>

<p align="center">
  <a href="#"><b>🔗 Live Demo → coming soon</b></a>
</p>

<p align="center">
  <img src="docs/screenshot-light.png" width="49%" alt="BlogSphere Light Mode" />
  &nbsp;
  <img src="docs/screenshot-dark.png" width="49%" alt="BlogSphere Dark Mode" />
</p>

---
## 🚀 Core Features

- 📝 Rich Text Markdown Editing & Live Preview
- 📚 Content Management: Save Drafts, Publish, Edit, and Delete
- 👑 Full Admin Dashboard (User Management, Featured Posts)
- ☁️ Cloudinary Integration (Fast & Secure Image Uploads)
- 💬 User Engagement (Likes, Comments, Bookmarks)
- 🧠 Smart Recommendations & Personalized Reading History
- 📊 Analytics Tracking (View counts & insights)
- 🛡️ Advanced Security (NoSQL injection prevention, XSS, Rate-limiting)

## ✨ Key Highlights

- **Modern UI/UX**: Fully responsive, dark-mode ready, glassmorphism design powered by Tailwind CSS and Framer Motion.
- **Admin Capabilities**: Full administrative control to manage users, ban accounts, delete comments, and feature standout posts.
- **Security First**: Protected against NoSQL injection, XSS, and parameter pollution. Fully rate-limited.
- **Performance Optimized**: TanStack React Query for data fetching, caching, and state management alongside Zustand.

---
## 🏛 System Design

- RESTful API design
- Stateless JWT authentication
- Role-Based Access Control (RBAC - Admin, User)
- MVC backend architecture

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18 (Vite), Tailwind CSS v4, Zustand, TanStack React Query, React Router v6, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js (MVC Pattern), JWT, bcryptjs |
| **Database** | MongoDB & Mongoose |
| **Cloud / Media** | Cloudinary, Multer |
| **Security** | Helmet, HPP, Express-Mongo-Sanitize |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/arjunvashishtha13/BlogSphere-API.git
cd BlogSphere-API
```

### 2. Backend Setup
Install backend dependencies:
```bash
npm install
```

Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Nodemailer for forgot password/verification
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_user
EMAIL_PASS=your_pass
EMAIL_FROM=noreply@blogsphere.com
```

Start the backend dev server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```

Create a `.env` file inside the `/client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm run dev
```

*The app will be running at `http://localhost:5173`.*

---

## 👑 Admin Setup

To access the Admin Dashboard, your user account must have the `admin` role. You can easily promote an existing user to an admin using the included seed script.

1. Register an account normally through the website frontend.
2. In your terminal, at the root of the project, run:
```bash
node scripts/seedAdmin.js your_email@example.com
```
3. Refresh your browser. You will now see the Admin Dashboard in your profile dropdown.

---

## 🌐 Deployment Guidelines

**Backend (Render, Railway, Heroku)**
- Set root directory to `/`
- Build command: `npm install`
- Start command: `npm start`
- Add all environment variables from your `.env` file. Change `CLIENT_URL` to your production frontend URL.

**Frontend (Vercel, Netlify)**
- Set root directory to `/client`
- Build command: `npm run build`
- Start command: `npm run preview`
- Set `VITE_API_URL` to your production backend URL (e.g., `https://your-backend.com/api`).
- *Note for Vercel*: The repository includes a `client/vercel.json` file to ensure React Router handles client-side routing correctly without throwing 404 errors.

---

## 👨‍💻 Author

**Arjun Vashishtha**

[![GitHub](https://img.shields.io/badge/GitHub-arjunvashishtha13-181717?style=for-the-badge&logo=github)](https://github.com/arjunvashishtha13)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-arjun--vashishtha13-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/arjun-vashishtha13)

---

<p align="center">
Built with ❤️ using React, Node.js, Express, MongoDB and Cloudinary.
</p>
