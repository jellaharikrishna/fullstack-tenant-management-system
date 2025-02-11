# 🏠 Tenant Management System

This is a full-stack web application for managing tenant details. It includes user authentication and authorization, allowing users to register, log in, add, update, view, and delete tenant details.

## 🛠 Tech Stack

### 🎨 Frontend
- ⚛️ React
- 🛤 React Router
- 🔔 React Toastify

### 🖥 Backend
- 🚀 Node.js
- 🌐 Express.js
- 🗄 SQLite3
- 🔒 bcrypt
- 🔑 JSON Web Token (JWT)

## ✨ Features
- 📝 User registration and authentication
- 🔐 Secure password hashing
- 🔑 JWT-based authentication
- 🏠 Add, update, view, and delete tenants
- 👤 User profile management
- 🔄 Password update functionality

## 📥 Installation

1. 📂 Clone the repository:
   ```sh
   git clone https://github.com/your-repo/tenant-management.git
   cd tenant-management
   ```

2. 📦 Install dependencies for the backend:
   ```sh
   cd backend
   npm install
   ```

3. 📦 Install dependencies for the frontend:
   ```sh
   cd frontend
   npm install
   ```

## 🚀 Running the Application

### ▶ Start Backend Server
```sh
cd backend
node server.js
```

### ▶ Start Frontend
```sh
cd frontend
npm start
```

## 📡 API Endpoints

### 🔑 User Authentication
- `POST /register` - 📝 Register a new user
- `POST /login` - 🔐 User login

### 🏠 Tenant Management
- `POST /tenants` - ➕ Add a new tenant
- `GET /tenants` - 📄 Get all tenants
- `GET /tenants/:tenantId` - 🔍 Get tenant by ID
- `PUT /tenants/:tenantId` - ✏ Update tenant details
- `DELETE /tenants/:tenantId` - ❌ Delete tenant

### 👤 User Profile
- `GET /profile` - 🔍 Get user profile
- `PUT /profile` - 🔄 Update password
- `DELETE /profile/:id` - 🗑 Delete user profile

## 📜 License
This project is licensed under the MIT License.

