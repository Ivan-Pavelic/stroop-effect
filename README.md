# 🧠 Stroop Effect Game

A full-stack cognitive assessment web application that measures cognitive flexibility using the Stroop Effect. The app includes AI-powered performance analysis and personalized recommendations.

![Stroop Test](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![Express](https://img.shields.io/badge/Backend-Express-lightgrey)
![Python](https://img.shields.io/badge/AI_Service-Python-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192)

---

## 🌐 Live Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **🎮 Play the Game** | [stroop-frontend.onrender.com](https://stroop-frontend.onrender.com) | Main application - play the Stroop Test here |
| **🔌 Backend API** | [stroop-backend.onrender.com](https://stroop-backend.onrender.com) | REST API server |
| **🤖 AI Service** | [stroop-ai-service.onrender.com](https://stroop-ai-service.onrender.com) | Python AI analysis service |
| **📊 API Health Check** | [stroop-backend.onrender.com/api/health](https://stroop-backend.onrender.com/api/health) | Check if API is running |

> ⚠️ **Note:** Free tier services sleep after 15 minutes of inactivity. The first request may take 30-60 seconds to wake up the service.

---

## 🎮 How to Play the Stroop Test

### What is the Stroop Effect?
The Stroop Effect demonstrates the interference in reaction time when the name of a color is printed in a different color ink. For example, the word "RED" printed in blue ink.

### Game Instructions

1. **Start the Game**
   - Visit [stroop-frontend.onrender.com](https://stroop-frontend.onrender.com)
   - Click the **"START"** button

2. **Play Each Round**
   - You will see a color word (e.g., "RED", "BLUE", "GREEN", "YELLOW")
   - The word will be displayed in a color that may or may not match the word
   - **Your task:** Select the COLOR the word is DISPLAYED in (not the word itself!)
   - Example: If you see "RED" written in blue color, select "BLUE"

3. **Complete All Rounds**
   - Answer all 10 questions as quickly and accurately as possible
   - Your response time and accuracy are measured

4. **View Your Results**
   - After completing the game, you'll see:
     - Your score (correct answers / total rounds)
     - Accuracy percentage
     - Average response time
     - 🧠 **AI Analysis** including:
       - Cognitive Score (0-100)
       - Performance level (Excellent/Good/Average/Needs Improvement)
       - Component scores (Accuracy, Speed, Consistency)
       - Personalized feedback
       - Recommendations for improvement

5. **Play Again or Return to Menu**
   - Click "Play Again" to start a new game
   - Click "Back to Menu" to access other features

### Game Modes

| Mode | Description |
|------|-------------|
| **Single Player** | Standard game - test your cognitive abilities |
| **Multiplayer** | Coming soon - compete with friends |

### Settings

Access Settings from the main menu to customize:
- **Number of Rounds:** 5, 10, 15, or 20
- **Difficulty:** Easy, Medium, or Hard
- **Language:** English (more coming soon)

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
│   │   │   ├── 📂 ui/
│   │   │   │   └── button.tsx      # Reusable button component
│   │   │   ├── MainMenu.tsx        # Home screen
│   │   │   ├── GameScreen.tsx      # Game play screen
│   │   │   ├── FeedbackScreen.tsx  # Answer feedback
│   │   │   ├── ResultsScreen.tsx   # Final results + AI analysis
│   │   │   ├── Settings.tsx        # Game settings
│   │   │   └── Leaderboard.tsx     # Top scores
│   │   │
│   │   ├── 📂 services/
│   │   │   └── api.ts              # API connection service
│   │   │
│   │   └── 📂 lib/
│   │       └── utils.ts            # Utility functions
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
│   │   │   └── aiController.ts     # AI service connection
│   │   │
│   │   ├── 📂 routes/              # API Endpoints
│   │   │   ├── auth.ts             # /api/auth/*
│   │   │   ├── game.ts             # /api/game/*
│   │   │   ├── leaderboard.ts      # /api/leaderboard/*
│   │   │   └── ai.ts               # /api/ai/*
│   │   │
│   │   ├── 📂 middleware/
│   │   │   └── auth.ts             # JWT authentication
│   │   │
│   │   ├── 📂 types/
│   │   │   └── index.ts            # TypeScript type definitions
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
│   ├── .env                        # Environment variables
│   └── 📂 venv/                    # Python virtual environment
│
├── .gitignore                      # Git ignore rules
└── README.md                       # This file (you are here :))
```

---

## 🗄️ Database Schema
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   DATABASE TABLES                                    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│     ┌─────────────┐    ┌─────────────┐     ┌───────────────┐     ┌─────────────┐     │
│     │ ai_analysis │    │   users     │     │   games       │     │   results   │     │
│     ├─────────────┤    ├─────────────┤     ├───────────────┤     ├─────────────┤     │
│     │ id          │  ┌─│ id          │────<│ user_id       │     │ id          │     │
│     │ user_id     │──┘ │ ime         │     │ id            │────<│ game_id     │     │
│     │ rezultat_ai │    │ prezime     │     │ datum         │     │ tocnost     │     │
│     │ datum       │    │ dob         │     │ trajanje      │     │ brzina      │     │
│     └─────────────┘    │ spol        │     │ broj_zadataka │     │ kognitivni_ │     │
│                        │ email       │     │ broj_pogresaka│     │   score     │     │
│                        │ lozinka_hash│     │ prosjecno_    │     └─────────────┘     │
│                        │ created_at  │     │   vrijeme     │                         │
│                        └─────────────┘     └───────────────┘                         │
│                               │                                                      │
│                               │            ┌──────────────┐                          │
│                               │            │  ai_tasks    │                          │
│                               │            ├──────────────┤                          |
│                               │            │ id           │                          │
│                               │            │ task_text    │                          │
│                               │            │ boja_teksta  │                          │
│                               └───────────>│ tocan_odgovor│                          │
│                               |            │ tezina       │                          │
│                               |            └──────────────┘                          │
│                               │                                                      │
│                               │            ┌─────────────┐                           │
│                               │            │  feedback   │                           │
│                               │            ├─────────────┤                           │
│                               └───────────>│ id          │                           │
│                                            │ user_id     │                           │
│                                            │ komentar    │                           │
│                                            │ ocjena      │                           │
│                                            └─────────────┘                           │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | User interface |
| **Styling** | Tailwind CSS | Responsive design |
| **Backend** | Node.js, Express 5, TypeScript | REST API |
| **Database** | PostgreSQL 16 | Data persistence |
| **ORM** | Prisma 5 | Database operations |
| **AI Service** | Python 3, Flask | Cognitive analysis |
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
| GET | `/api/leaderboard` | Get top players |
| GET | `/api/leaderboard/my-rank` | Get current user's rank |

### AI Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze` | Analyze game performance |
| POST | `/api/ai/generate-tasks` | Generate adaptive tasks |
| POST | `/api/ai/insights` | Get cognitive insights |

---

## 👥 Team

| Name | GitHub | Email |
|------|--------|-------|
| Marjan Anušić | [@marci2901](https://github.com/marci2901) | marjan.anusic@fer.hr |
| Lucija Klanjac | [@lus-terry](https://github.com/lus-terry) | lucija.klanjac@fer.hr |
| Lukas Schönberger | [@Mboopii](https://github.com/Mboopii) | lukas.schonberger@fer.hr |
| Ivan Pavelić | [@Ivan-Pavelic](https://github.com/Ivan-Pavelic) | ivan.pavelic@fer.hr |
