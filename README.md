# 🧠 Stroop Effect Game

A full-stack cognitive assessment web application that measures cognitive flexibility using the Stroop Effect. The app includes AI-powered performance analysis, personalized recommendations, and multiple cognitive games.

![Stroop Test](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![Express](https://img.shields.io/badge/Backend-Express-lightgrey)
![Python](https://img.shields.io/badge/AI_Service-Python-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192)

---

## 🌐 Live Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **🎮 Play the Game** | [stroop-frontend.onrender.com](https://stroop-frontend.onrender.com) | Main application - play cognitive games here |
| **🔌 Backend API** | [stroop-backend.onrender.com](https://stroop-backend.onrender.com) | REST API server |
| **🤖 AI Service** | [stroop-ai-service.onrender.com](https://stroop-ai-service.onrender.com) | Python AI analysis service |
| **📊 API Health Check** | [stroop-backend.onrender.com/api/health](https://stroop-backend.onrender.com/api/health) | Check if API is running |

> ⚠️ **Note:** Free tier services sleep after 15 minutes of inactivity. The first request may take 30-60 seconds to wake up the service.

---

## 🎮 Available Games

### 1. Stroop Effect Game
The classic Stroop Effect test that measures cognitive flexibility and interference control.

**Features:**
- Dynamic difficulty scaling with progressive color additions
- Series-based gameplay (increases complexity over time)
- Croatian language interface
- Real-time performance tracking
- AI-powered cognitive analysis

**How to Play:**
1. Read the color word displayed on screen (e.g., "CRVENA", "PLAVA", "ZELENA")
2. Select the **COLOR** the word is displayed in (not the word itself!)
3. Example: If you see "CRVENA" written in blue color, select "PLAVA"
4. Complete all rounds as quickly and accurately as possible

**Difficulty Progression:**
- Series 1: 4 colors (CRVENA, PLAVA, ZELENA, ŽUTA)
- Series 2+: Additional colors added (LJUBIČASTA, SMEĐA, NARANČASTA, ROZA)
- Congruence chance decreases with each series

### 2. Memory Chain (Lanac Pamćenja)
A memory training game that challenges your working memory and attention span.

**Features:**
- Progressive difficulty levels
- Visual memory challenges
- Performance tracking
- Croatian language interface

---

## 🎯 Key Features

### User Features
- ✅ **User Registration & Authentication** - Secure JWT-based login system
- ✅ **Multiple Cognitive Games** - Stroop Effect and Memory Chain
- ✅ **Real-time Performance Tracking** - Track accuracy, reaction time, and cognitive scores
- ✅ **Leaderboard** - Compete with other players (end-users only)
- ✅ **Personal Statistics** - View your game history and progress
- ✅ **Responsive Design** - Optimized for mobile devices and tablets
- ✅ **Croatian Language** - Full localization in Croatian
- ✅ **QR Code Access** - Easy mobile access via QR code on login screen

### Admin Features
- ✅ **User Management Dashboard** - View and manage all users
- ✅ **User Details & Analytics** - Detailed performance graphs and statistics
- ✅ **AI Analysis Insights** - View cognitive scores and AI feedback for users
- ✅ **User Creation** - Add new users to the system
- ✅ **Secure Admin Access** - Role-based access control

### Technical Features
- ✅ **AI-Powered Analysis** - Machine learning-based cognitive assessment
- ✅ **Real-time Data Visualization** - Interactive charts using Recharts
- ✅ **Modern UI/UX** - Beautiful animations with Framer Motion
- ✅ **Type-Safe API** - Full TypeScript implementation
- ✅ **Database Migrations** - Automated schema management with Prisma

---

## 📁 Project Structure

```
stroop-effect/
│
├── 📂 frontend/                    # Next.js React Application
│   ├── 📂 src/
│   │   ├── 📂 app/                 # Next.js App Router
│   │   │   ├── globals.css         # Global styles
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── page.tsx            # Main page component
│   │   │
│   │   ├── 📂 components/          # React Components
│   │   │   ├── 📂 ui/              # Reusable UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── ...
│   │   │   ├── Login.tsx           # Login screen with QR code
│   │   │   ├── MainMenu.tsx        # Home screen
│   │   │   ├── GameScreen.tsx      # Stroop game screen
│   │   │   ├── MemoryChainScreen.tsx # Memory Chain game
│   │   │   ├── ResultsScreen.tsx   # Final results + AI analysis
│   │   │   ├── AdminDashboard.tsx   # Admin user management
│   │   │   ├── UserDetail.tsx      # User statistics & graphs
│   │   │   └── Leaderboard.tsx     # Top scores
│   │   │
│   │   ├── 📂 services/
│   │   │   └── api.ts              # API connection service
│   │   │
│   │   └── 📂 lib/
│   │       ├── utils.ts            # Utility functions
│   │       └── animations.ts       # Animation utilities
│   │
│   ├── .env.local                  # Environment variables
│   ├── package.json                # Dependencies
│   ├── tailwind.config.ts          # Tailwind CSS config
│   └── tsconfig.json               # TypeScript config
│
├── 📂 backend/                     # Express.js API Server
│   ├── 📂 src/
│   │   ├── 📂 controllers/         # Business Logic
│   │   │   ├── authController.ts   # Authentication logic
│   │   │   ├── gameController.ts   # Game results logic
│   │   │   ├── leaderboardController.ts  # Leaderboard logic
│   │   │   ├── adminController.ts # Admin operations
│   │   │   └── aiController.ts     # AI service connection
│   │   │
│   │   ├── 📂 routes/              # API Endpoints
│   │   │   ├── auth.ts             # /api/auth/*
│   │   │   ├── game.ts             # /api/game/*
│   │   │   ├── leaderboard.ts      # /api/leaderboard/*
│   │   │   ├── admin.ts            # /api/admin/*
│   │   │   └── ai.ts               # /api/ai/*
│   │   │
│   │   ├── 📂 middleware/
│   │   │   └── auth.ts             # JWT authentication
│   │   │
│   │   ├── 📂 lib/
│   │   │   └── prisma.ts           # Prisma client singleton
│   │   │
│   │   └── index.ts                # Server entry point
│   │
│   ├── 📂 prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── 📂 migrations/          # Database migrations
│   │
│   ├── .env                        # Environment variables
│   ├── package.json                # Dependencies
│   └── tsconfig.json               # TypeScript config
│
├── 📂 ai-service/                  # Python Flask AI Service
│   ├── app.py                      # Main Flask application
│   ├── requirements.txt            # Python dependencies
│   ├── stroop_model.joblib         # Trained ML model
│   ├── .env                        # Environment variables
│   └── 📂 venv/                    # Python virtual environment
│
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts with authentication (username, email, role: USER/ADMIN)
- **Game** - Game sessions and metadata
- **GameSession** - Individual game play sessions
- **Result** - Game results with accuracy, reaction time, and cognitive scores
- **AITask** - AI-generated tasks
- **AIAnalysis** - AI performance analysis results
- **Feedback** - User feedback and ratings

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | User interface |
| **Styling** | Tailwind CSS, Framer Motion | Responsive design & animations |
| **Charts** | Recharts | Data visualization |
| **Backend** | Node.js, Express 5, TypeScript | REST API |
| **Database** | PostgreSQL 16 | Data persistence |
| **ORM** | Prisma 5 | Database operations |
| **AI Service** | Python 3, Flask, scikit-learn | Cognitive analysis |
| **Authentication** | JWT (JSON Web Tokens) | Secure auth |
| **Deployment** | Render | Cloud hosting |

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js v20+ 
- Python 3.12+
- PostgreSQL 16+
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ivan-Pavelic/stroop-effect.git
cd stroop-effect
```

### Step 2: Set Up the Database

```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE stroop_db;"
```

### Step 3: Set Up the Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/stroop_db
# JWT_SECRET=your-secret-key
# PORT=5000
# FRONTEND_URL=http://localhost:3000
# AI_SERVICE_URL=http://localhost:5001

# Run database migrations
npx prisma migrate dev

# Start the server
npm run dev
```

### Step 4: Set Up the AI Service

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

### Step 5: Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

### Step 6: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **AI Service:** http://localhost:5001

### Demo Credentials

For testing purposes, you can use:
- **Username:** `demo.digobr`
- **Password:** `digobr123`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Game

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game/result` | Save game result |
| GET | `/api/game/history` | Get user's game history |
| GET | `/api/game/stats` | Get user's statistics |

### Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get top players (excludes admins) |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users (admin only) |
| POST | `/api/admin/users` | Create new user (admin only) |
| GET | `/api/admin/users/:id` | Get user details (admin only) |
| GET | `/api/admin/users/:id/stats` | Get user statistics (admin only) |

### AI Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze` | Analyze game performance |

---

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface with smooth animations
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Accessibility** - Keyboard navigation and screen reader support
- **Dark/Light Mode Ready** - CSS variables for easy theme switching
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **Role-Based Access Control** - Admin and user role separation
- **CORS Protection** - Configured CORS policies
- **Input Validation** - Server-side validation for all inputs

---

## 📊 Performance Features

- **Database Connection Pooling** - Optimized database connections
- **Lazy Loading** - Code splitting for faster initial load
- **Image Optimization** - Next.js image optimization
- **Caching** - Strategic caching for API responses

---

## 🐛 Known Issues & Limitations

- Free tier Render services may sleep after inactivity (15 minutes)
- First request after sleep may take 30-60 seconds
- Admin user is hidden from user list and leaderboard
- AI feedback is only visible to admins (hidden from end-users)

---

## 🚧 Future Enhancements

- [ ] Multiplayer game mode
- [ ] Additional cognitive games
- [ ] Email notifications
- [ ] Export statistics to PDF
- [ ] Mobile app version
- [ ] Real-time multiplayer competitions

---

## 👥 Team

| Name | GitHub | Email |
|------|--------|-------|
| Marjan Anušić | [@marci2901](https://github.com/marci2901) | marjan.anusic@fer.hr |
| Lucija Klanjac | [@lus-terry](https://github.com/lus-terry) | lucija.klanjac@fer.hr |
| Lukas Schönberger | [@Mboopii](https://github.com/Mboopii) | lukas.schonberger@fer.hr |
| Ivan Pavelić | [@Ivan-Pavelic](https://github.com/Ivan-Pavelic) | ivan.pavelic@fer.hr |

---

## 📝 License

This project is part of a university course project.

---

## 🙏 Acknowledgments

- Stroop Effect research and cognitive assessment methodologies
- Open source community for excellent tools and libraries
