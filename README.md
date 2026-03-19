# 💬 Chat Application — Backend

> A scalable, real-time chat application backend built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. Supports authentication, media uploads via Cloudinary, and live messaging.

---

## 🚀 Features

- 🔐 **User Authentication** — Secure login & registration using JWT & bcryptjs
- 💬 **Real-Time Messaging** — Instant bidirectional communication powered by Socket.IO
- 🖼️ **Media Uploads** — Image/file sharing via Cloudinary integration
- 🍪 **Cookie-Based Sessions** — Secure token storage with cookie-parser
- 🌐 **CORS Support** — Configured for seamless frontend-backend communication
- 📁 **File Handling** — Temporary file storage using express-fileupload
- 🗄️ **MongoDB Database** — Persistent data storage via Mongoose ODM

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js v5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | Real-time communication |
| Cloudinary | Cloud media storage |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| dotenv | Environment configuration |
| express-fileupload | File/image upload handling |

---

## 📁 Project Structure

```
backend/
├── config/
│   └── .env                  # Environment variables
├── database/
│   └── db.js                 # MongoDB connection
├── routes/
│   ├── user.route.js         # User routes (/api/v1/user)
│   └── message.route.js      # Message routes (/api/v1/message)
├── utils/
│   └── socket.io.js          # Socket.IO initialization
├── app.js                    # Express app setup
├── server.js                 # HTTP server + entry point
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Shubham8468/Chat_Application_Backend.git
cd Chat_Application_Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `config/.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

4. **Start the development server**

```bash
npm test
```

> The server will start on the port defined in your `.env` file.

---

## 🔌 API Endpoints

### 👤 User Routes — `/api/v1/user`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and get token |
| GET | `/logout` | Logout user |
| GET | `/me` | Get current user profile |

### 💬 Message Routes — `/api/v1/message`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/send/:id` | Send a message to a user |
| GET | `/all/:id` | Get all messages with a user |

> ⚠️ Routes may vary. Refer to the route files for the complete list.

---

## 🔄 Real-Time Events (Socket.IO)

| Event | Description |
|---|---|
| `connection` | User connects to the socket |
| `sendMessage` | Client sends a new message |
| `receiveMessage` | Client receives a message |
| `disconnect` | User disconnects |

---

## 🌍 Environment Variables Reference

| Variable | Description |
|---|---|
| `PORT` | Port number for the server |
| `NODE_ENV` | Environment mode (`development` / `production`) |
| `FRONTEND_URL` | URL of the frontend app (for CORS) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Your Cloudinary API secret |

---

## 📦 Dependencies

```json
{
  "bcryptjs": "^3.0.3",
  "cloudinary": "^2.9.0",
  "cookie-parser": "^1.4.7",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "express-fileupload": "^1.5.2",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.3.0",
  "socket.io": "^4.8.3"
}
```

---

## 🔒 Security Practices

- Passwords are hashed using **bcryptjs** before storing in the database
- Authentication is handled via **HTTP-only cookies** with JWT tokens
- Environment variables are kept out of version control using `.gitignore`
- CORS is restricted to the allowed frontend URL only

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add: your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Shubham**
- GitHub: [@Shubham8468](https://github.com/Shubham8468)

---

## 📄 License

This project is licensed under the **ISC License**.

---

> ⭐ If you found this project helpful, please give it a star on GitHub!