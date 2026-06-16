<div align="center">
  <h1>BlogSphere</h1>
  <p>A modern, full-stack blogging platform built for writers and readers. Fast, beautiful, and secure.</p>
</div>

---

## 🌟 Features

BlogSphere is built with a focus on clean design, performance, and a rich user experience.

- **Rich Text Markdown Editing**: Write stories effortlessly with real-time Markdown preview.
- **Content Management**: Save drafts, publish, edit, and delete posts.
- **Admin Dashboard**: Full administrative control to manage users, ban accounts, delete comments, and feature standout posts.
- **Cloudinary Integration**: Fast and secure image uploads for cover photos and inline post images.
- **User Engagement**: Like, comment, and bookmark your favorite posts.
- **Smart Recommendations**: A personalized reading history and tailored post recommendations.
- **Analytics tracking**: View counts and basic analytics for writers.
- **Security First**: Protected against NoSQL injection, XSS, and parameter pollution. Fully rate-limited.
- **Modern UI/UX**: Fully responsive, dark-mode ready, glassmorphism design powered by Tailwind CSS and Framer Motion.

---

## 🛠️ Tech Stack

**Frontend**
- React 18 (Vite)
- Tailwind CSS v4 (Styling)
- Zustand (Global State Management)
- TanStack React Query (Data Fetching & Caching)
- React Router v6 (Navigation)
- Framer Motion (Animations)
- Lucide React (Icons)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- JSON Web Tokens (JWT) & bcryptjs (Authentication)
- Cloudinary & Multer (Image processing and storage)
- Helmet, HPP, Express-Mongo-Sanitize (Security)

---

## 🚀 Getting Started (Local Development)

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

The app will be running at `http://localhost:5173`.

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

## 📝 License

This project is licensed under the MIT License.
