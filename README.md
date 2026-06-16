# BlogSphere

A production-ready full-stack blogging platform built with **Node.js**, **Express**, **MongoDB**, and **React**. Designed as a portfolio project that demonstrates modern API architecture, thoughtful UI design, and real-world features beyond basic CRUD.

![BlogSphere](https://img.shields.io/badge/Node.js-Express-green) ![React](https://img.shields.io/badge/React-Vite-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)

## Features

### Frontend
- Premium editorial UI with dark/light mode (persisted)
- Hero landing page with featured & trending sections
- Instant search, category filtering, pagination
- Rich markdown editor with live preview & auto-save drafts
- Blog detail: likes, bookmarks, share, comments, related posts
- Author profiles & protected user dashboard
- Analytics: views, likes, top posts, reading history, recommendations
- Skeleton loaders, empty states, toast notifications
- Framer Motion page transitions, lazy-loaded routes
- SEO: meta tags, Open Graph, structured data

### Backend
- RESTful API with centralized error handling
- JWT authentication with input validation (`express-validator`)
- Posts: CRUD, drafts, categories, tags, views, reading time
- Likes, bookmarks, comments, reading history
- Featured, trending, related posts, analytics endpoints
- MongoDB indexes for optimized queries
- Cascade delete comments when post is deleted

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Backend  | Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt |
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion     |
| State    | Zustand, TanStack React Query                     |
| UI       | Lucide icons, React Hot Toast, React Helmet Async |

## Project Structure

```
BlogSphere-API/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # API client
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── store/          # Zustand stores
│       └── utils/          # Helpers
├── config/                 # Database config
├── controllers/            # Route handlers
├── middleware/             # Auth, validation, errors
├── models/                 # Mongoose schemas
├── routes/                 # Express routes
├── utils/                  # AppError, asyncHandler
├── validators/             # Request validation rules
└── server.js               # Entry point
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone & configure

```bash
git clone <your-repo-url>
cd BlogSphere-API
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET`.

### 2. Install dependencies

```bash
npm install
cd client && npm install
```

### 3. Run development servers

**Terminal 1 — API (port 5000):**
```bash
npm run dev
```

**Terminal 2 — Frontend (port 5173):**
```bash
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

### Auth
| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| POST   | `/api/auth/register`  | Register + JWT     |
| POST   | `/api/auth/login`     | Login + JWT        |

### Posts
| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/posts`                | List (search, filter, paginate) |
| GET    | `/api/posts/featured`       | Featured posts           |
| GET    | `/api/posts/trending`       | Trending (7 days)        |
| GET    | `/api/posts/categories`     | Category counts          |
| GET    | `/api/posts/:id`            | Single post (+ view count) |
| GET    | `/api/posts/:id/related`    | Related posts            |
| POST   | `/api/posts`                | Create (auth)            |
| PUT    | `/api/posts/:id`            | Update (auth, author)    |
| DELETE | `/api/posts/:id`            | Delete (auth, author)    |
| POST   | `/api/posts/:id/like`       | Like (auth)              |
| POST   | `/api/posts/:id/unlike`     | Unlike (auth)            |

### Users
| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| GET    | `/api/users/profile`          | Own profile + stats   |
| PUT    | `/api/users/profile`          | Update profile        |
| GET    | `/api/users/posts`            | Own posts             |
| GET    | `/api/users/analytics`        | Dashboard analytics   |
| GET    | `/api/users/bookmarks`        | Saved posts           |
| POST   | `/api/users/bookmarks/:postId`| Toggle bookmark       |
| GET    | `/api/users/history`          | Reading history       |
| GET    | `/api/users/recommendations`  | Personalized picks    |
| GET    | `/api/users/:id`              | Public author profile |

### Comments
| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| POST   | `/api/comments/:postId`     | Add comment (auth) |
| GET    | `/api/comments/:postId`     | List comments      |
| DELETE | `/api/comments/:id`         | Delete (auth)      |

## Production Build

```bash
cd client && npm run build
npm start
```

Serve the `client/dist` folder via a static host or reverse proxy alongside the API.

## License

ISC
