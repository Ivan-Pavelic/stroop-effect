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

## 📚 Research Foundation

This project was created on the basis of research in cognitive assessment, particularly focusing on the Stroop Test as a tool for early detection of cognitive decline in elderly populations, including Alzheimer's disease and Parkinson's disease.

### Key Research Areas

The application is grounded in research exploring:
- **Stroop Test as a cognitive screening tool** for elderly populations
- **Digital biomarkers** for early detection of neurodegenerative diseases
- **Reaction time variability** as an indicator of cognitive decline
- **Remote cognitive assessment** using digital technologies

### Important Literature

#### Stroop Test in Alzheimer's Disease (Elderly Focus)
1. Stroop effects in Alzheimer's disease: selective attention speed of processing, or color-naming? A meta-analysis - [PubMed](https://pubmed.ncbi.nlm.nih.gov/24100125/)
2. The Stroop color-word test: indicator of dementia severity - [PubMed](https://pubmed.ncbi.nlm.nih.gov/6480252/)
3. The utility of Stroop task switching as a marker for early-stage Alzheimer's disease - [PubMed](https://pubmed.ncbi.nlm.nih.gov/20853964/)
4. Stroop Color-Word Test performance in patients with Alzheimer's disease - [PubMed](https://pubmed.ncbi.nlm.nih.gov/2258434/)
5. Evaluating the Stroop Test With Older Adults: Construct Validity, Short Term Test-Retest Reliability, and Sensitivity to Mental Fatigue - [PubMed](https://pubmed.ncbi.nlm.nih.gov/38739018/)
6. Aging and response inhibition: Normative data for the Victoria Stroop Test - [PubMed](https://pubmed.ncbi.nlm.nih.gov/16766341/)
7. Normative study of the Stroop Color and Word Test in an educationally diverse elderly population - [PubMed](https://pubmed.ncbi.nlm.nih.gov/18425990/)
8. Stroop performance in healthy younger and older adults and in individuals with dementia of the Alzheimer's type - [PubMed](https://pubmed.ncbi.nlm.nih.gov/8934854/)
9. Victoria Stroop Test: normative data in a sample group of older people and the study of their clinical applications in the assessment of inhibition in Alzheimer's disease - [PubMed](https://pubmed.ncbi.nlm.nih.gov/21873625/)
10. Stroop interference, practice, and aging - [PubMed](https://pubmed.ncbi.nlm.nih.gov/17203134/)

#### Stroop Test in Parkinson's Disease (Elderly Focus)
11. Stroop Test for Parkinson's Disease with Deep Brain Stimulation: A Systematic Review - [PubMed](https://pubmed.ncbi.nlm.nih.gov/36591546/)
12. Use of a Modified STROOP Test to Assess Color Discrimination Deficit in Parkinson's Disease - [Frontiers](https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2018.00765/full)
13. Parkinson's Disease and the Stroop Color Word Test: Processing Speed and Interference Algorithms - [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5036998/)
14. Cognitive assessment instruments in Parkinson's disease patients undergoing deep brain stimulation - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5619101/)
15. Stroop Test for Parkinson's Disease with Deep Brain Stimulation: A Systematic Review - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9776780/)
16. Cognitive Assessment for Parkinson's Disease Patients (CAB-PK) - [CogniFit](https://www.cognifit.com/parkinson-test)
17. Parkinson's Disease and the Stroop Color Word Test: Processing Speed and Interference Algorithms - [ResearchGate](https://www.researchgate.net/publication/303835753_Parkinson%27s_Disease_and_the_Stroop_Color_Word_Test_Processing_Speed_and_Interference_Algorithms)
18. Stroop test performance in impulsive and non impulsive patients with Parkinson's disease - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3042030/)

#### General Cognitive Screening Tools for Alzheimer's, Parkinson's, and Elderly
19. Cognitive Assessment Tools | Alzheimer's Association - [alz.org](https://www.alz.org/professionals/health-systems-medical-professionals/clinical-resources/cognitive-assessment-tools)
20. Cognitive Screening and Assessment | Alzheimer's Association - [alz.org](https://www.alz.org/professionals/health-systems-medical-professionals/cognitive-assessment)
21. Dementia screening and diagnosis tools for health-care providers | Alzheimer Society of Canada - [alzheimer.ca](https://alzheimer.ca/en/help-support/im-health-care-provider/dementia-diagnosis-screening-tools-health-care-providers)
22. Medical Tests for Diagnosing Alzheimer's & Dementia | alz.org - [alz.org](https://www.alz.org/alzheimers-dementia/diagnosis/medical_tests)
23. Science & Tech Spotlight: At-Home Tools to Diagnose Alzheimer's, Parkinson's, and Related Diseases | U.S. GAO - [gao.gov](https://www.gao.gov/products/gao-24-107306)
24. Memory Tests: Screening for Alzheimer's and Other Dementias - [verywellhealth.com](https://www.verywellhealth.com/alzheimers-tests-98647)
25. A guide to detecting cognitive impairment during the Medicare - [alz.org](https://www.alz.org/getmedia/9687d51e-641a-43a1-a96b-b29eb00e72bb/cognitive-assessment-toolkit)
26. Montreal Cognitive Assessment (MoCA) Test for Dementia - [verywellhealth.com](https://www.verywellhealth.com/alzheimers-and-montreal-cognitive-assessment-moca-98617)
27. Brief cognitive screening instruments for early detection of Alzheimer's disease: a systematic review - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6396539/)
28. SAGE - Memory Disorders | Ohio State Medical Center - [wexnermedical.osu.edu](https://wexnermedical.osu.edu/brain-spine-neuro/memory-disorders/sage)

#### Digital / Cognitive Biomarkers and Remote Assessment (Elderly, Alzheimer's, Parkinson's)
29. Digital biomarkers in Alzheimer's disease: The mobile Alzheimer's disease digital biomarker study - [PubMed](https://pubmed.ncbi.nlm.nih.gov/35748542/)
30. Digital biomarkers of cognitive function: Development and validation of smartphone-based cognitive assessments - [PubMed](https://pubmed.ncbi.nlm.nih.gov/36656804/)
31. The digital clock drawing test: Cognitive assessment using an innovative digital pen technology - [PubMed](https://pubmed.ncbi.nlm.nih.gov/26545626/)
32. Wearable technology for early detection of Parkinson's disease: A systematic review - [PubMed](https://pubmed.ncbi.nlm.nih.gov/36940205/)
33. Smartphone-based assessment of cognitive and motor function in Parkinson's disease - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7709932/)
34. The mPower study, Parkinson's disease mobile data collection using ResearchKit - [PubMed](https://pubmed.ncbi.nlm.nih.gov/27145905/)
35. Machine learning analysis of smartphone sensor data detects Parkinson's disease motor symptoms remotely - [PubMed](https://pubmed.ncbi.nlm.nih.gov/31411374/)
36. Digital cognitive biomarkers for Alzheimer's disease: The road ahead - [PubMed](https://pubmed.ncbi.nlm.nih.gov/35016317/)
37. Cognitive variability as a digital biomarker for preclinical Alzheimer's disease - [PubMed](https://pubmed.ncbi.nlm.nih.gov/35426740/)
38. Remote digital cognitive assessment for detection of mild cognitive impairment: A systematic review - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11166260/)
39. Digital phenotyping in aging and dementia: State of the art and future directions - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10680059/)
40. Digital health technologies for Parkinson's disease: State of play and future prospects - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9776780/)

#### Reaction Time, Variability, and Cognitive Decline (Elderly Focus)
41. Intraindividual variability in reaction time as an indicator of cognitive decline in older adults - [PubMed](https://pubmed.ncbi.nlm.nih.gov/31403620/)
42. Reaction time variability and its association with white matter integrity in aging - [PubMed](https://pubmed.ncbi.nlm.nih.gov/24040929/)
43. Intraindividual reaction time variability predicts cognitive decline in older adults: A longitudinal study - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11339454/)
44. The role of intraindividual variability in cognitive aging: Implications for assessment and intervention - [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11239921/)
45. Cognitive slowing and variability in normal aging and dementia: A meta-analysis - [PubMed](https://pubmed.ncbi.nlm.nih.gov/25280971/)

#### AI / Machine Learning Applications for Cognitive Health
46. Artificial intelligence in digital health for cognitive decline detection: A systematic review - [PubMed](https://pubmed.ncbi.nlm.nih.gov/36744643/)
47. Machine learning in early diagnosis of Alzheimer's disease: A review - [PubMed](https://pubmed.ncbi.nlm.nih.gov/33677816/)
48. Deep learning applications in cognitive neuroscience and digital health - [PubMed](https://pubmed.ncbi.nlm.nih.gov/33860552/)
49. Using smartphone-based passive data and AI to detect early cognitive changes - [PubMed](https://pubmed.ncbi.nlm.nih.gov/34864318/)
50. Explainable AI for cognitive screening in older adults: From prediction to clinical insight - [PubMed](https://pubmed.ncbi.nlm.nih.gov/38020091/)

---

## 🙏 Acknowledgments

- Stroop Effect research and cognitive assessment methodologies
- Open source community for excellent tools and libraries
- All researchers and institutions contributing to cognitive assessment and digital biomarker research