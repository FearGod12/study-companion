# Study Companion

## 📚 Project Overview

Study Companion is a comprehensive study tracking and productivity application designed to help users manage their study sessions, create schedules, and track their learning progress.

## 🌟 Features

- User Authentication
- Study Session Tracking
- Customizable Study Schedules
- Detailed Study Statistics
- Notification System
- Streak Tracking

## 🚀 Technology Stack

### Frontend
- React
- Vite
- Javascript

### Backend
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Redis
- JWT Authentication

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20+ recommended)
- npm or yarn
- MongoDB
- Redis

## 🔧 Installation

### Clone the Repository
```bash
git clone https://github.com/FearGod12/study-companion.git
cd study-companion
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run build
npm run start  # for production
# or
npm run dev    # for development
```

## 🔐 Environment Configuration

Create `.env` files in both frontend and backend directories with the following variables:

### Backend `.env`
```
MONGODB_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

ROOT_EMAIL=your_root_email
GMAIL_USER=your_gmail_email
GMAIL_PASSWORD=your_gmail_app_password

CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
CLOUDINARY_URL=your_cloudinary_url
```

### Frontend `.env`
```
VITE_BASE_URL=http://localhost:3000/api
```

## 📡 API Documentation

The backend uses Swagger for API documentation. Once the server is running, access the API documentation at:
`http://localhost:3000/docs`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Onyenike Chukwudi - onyenikechukwudi@gmail.com

Project Link: [https://github.com/FearGod12/study-companion](https://github.com/FearGod12/study-companion)

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Redis](https://redis.io/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
