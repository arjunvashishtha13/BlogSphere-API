# 🚀 BlogSphere API

A RESTful backend API for a blogging platform built using **Node.js, Express, and MongoDB**.
It supports user authentication, blog creation, and secure access to protected routes using JWT.

---

## 📌 Features

* 🔐 User Authentication (Register & Login)
* 🔑 JWT-based Authorization
* 📝 Blog Post CRUD (Create, Read, Update, Delete)
* 🛡️ Protected Routes using Middleware
* 🧠 MongoDB with Mongoose ODM
* 📦 Clean MVC Architecture

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (jsonwebtoken), bcryptjs
* **Tools:** Postman, VS Code, GitHub

---

## 📂 Project Structure

```
BlogSphere-API
│
├── controllers
├── models
├── routes
├── middleware
├── config
│
├── server.js
├── package.json
└── .env
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/YOUR_USERNAME/BlogSphere-API.git
cd BlogSphere-API
```

### 2. Install dependencies

```
npm install
```

### 3. Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the server

```
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 🔑 API Endpoints

### Auth Routes

* `POST /api/auth/register` → Register user
* `POST /api/auth/login` → Login user

---

### Post Routes

* `POST /api/posts` → Create post (Protected)
* `GET /api/posts` → Get all posts
* `GET /api/posts/:id` → Get single post
* `PUT /api/posts/:id` → Update post (Protected)
* `DELETE /api/posts/:id` → Delete post (Protected)

---

## 🔐 Authentication

To access protected routes, include JWT token in headers:

```
Authorization: Bearer YOUR_TOKEN
```

---

## 🧪 Testing

Use **Postman** or **Thunder Client** to test API endpoints.

---

## 📈 Future Improvements

* 💬 Comment system
* ❤️ Like/Unlike posts
* 🔍 Search & Pagination
* 🌐 Frontend integration (React)

---

## 👨‍💻 Author

**Arjun Vashishtha**

* GitHub: https://github.com/arjunvashishtha13
* LinkedIn: https://linkedin.com/in/arjun-vashishtha13

---

## ⭐ If you found this useful

Give it a ⭐ on GitHub!
