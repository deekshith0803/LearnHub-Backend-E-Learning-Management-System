# LearnHub Backend – E-Learning Management System

LearnHub Backend is a robust, modular **Node.js, Express, and TypeScript** REST API server for a multi-role E-Learning Management System (LMS). It handles user authentication, course management, lessons, enrollments, student progress tracking, quizzes, and complete administrative control.

---

## 🚀 Features

- **JWT Authentication in HTTP-Only Cookies:** Secure login, registration, and logout with bcrypt password hashing and token verification middleware.
- **Role-Based Access Control (RBAC):** Strict route authorization for `student`, `instructor`, and `admin` roles.
- **Course & Lesson Management:** Create, update, publish/draft, and delete courses and multimedia lessons.
- **Enrollment & Learning Progress:** Student course enrollment, lesson completion tracking, and automatic completion percentage calculation.
- **Quiz Engine:** Instructors can build quizzes with questions, options, and correct answers. Students can submit answers and get instant graded results.
- **Admin Oversight & Moderation:** System analytics, user status moderation (active/blocked), role management, course visibility, and moderation of student-to-instructor role applications.
- **MongoDB & Mongoose:** Fully typed schemas with relationships, timestamps, and indexes.
- **Strict CORS & Preflight Support:** Configured for cross-origin cookie sharing with the Vite client.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database:** MongoDB & Mongoose 9
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcrypt`
- **Cookies & Parsing:** `cookie-parser`, `express.json()`, `express.urlencoded()`
- **CORS:** `cors` with credentials support
- **Dev Execution:** `tsx watch`

---

## 📁 Project Structure

```text
LearnHub-Server/
├── src/
│   ├── controllers/
│   │   ├── adminController.ts      # Platform stats, users, course moderation, instructor requests
│   │   ├── authController.ts       # Register, login, logout, profile, role upgrade requests
│   │   ├── courseController.ts     # Public catalog, course CRUD, instructor analytics
│   │   ├── enrollmentController.ts # Course enrollments, enrolled course lists
│   │   ├── lessonController.ts     # Lesson CRUD linked to courses
│   │   ├── progressController.ts   # Progress retrieval and lesson completion updates
│   │   └── quizController.ts       # Quiz CRUD and student submissions
│   ├── middleware/
│   │   └── token.ts                # JWT cookie verification & RBAC authorization
│   ├── models/
│   │   ├── Course.ts               # Course schema
│   │   ├── Enrollment.ts           # Enrollment schema
│   │   ├── InstructorRequest.ts    # Student instructor application schema
│   │   ├── Lesson.ts               # Lesson schema
│   │   ├── Progress.ts             # Course progress schema
│   │   ├── Quiz.ts                 # Quiz and question schema
│   │   └── User.ts                 # User credentials and roles schema
│   ├── routes/
│   │   ├── adminRoutes.ts          # /api/admin/*
│   │   ├── authRoutes.ts           # /api/auth/*
│   │   ├── courseRoutes.ts         # /api/courses, /api/instructor/*
│   │   ├── enrollmentRoutes.ts     # /api/courses/:id/enroll, /api/my-courses
│   │   ├── lessonRoutes.ts         # /api/courses/:id/lessons, /api/lessons/:id
│   │   ├── progressRoutes.ts       # /api/courses/:id/progress
│   │   └── quizRoutes.ts           # /api/courses/:id/quiz, /api/quizzes/:id
│   ├── app.ts                      # Express app, CORS configuration, and route mounting
│   └── index.ts                    # Server entry point & MongoDB connection
├── .env.example                    # Sample environment variables
├── package.json
└── tsconfig.json
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js (v18+)**
- **MongoDB** instance (MongoDB Atlas connection URI or local MongoDB)

### 2. Clone the Repository
```bash
git clone https://github.com/deekshith0803/LearnHub-Backend-E-Learning-Management-System.git
cd LearnHub-Backend-E-Learning-Management-System
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of `LearnHub-Server`:
```bash
cp .env.example .env
```

Configure your variables:
```env
PORT=5002
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/LearnHub?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret_key_here
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port the Express server listens on | `5002` |
| `MONGODB_URI` | MongoDB connection connection string | `mongodb+srv://...` |
| `JWT_SECRET_KEY` | Secret key used to sign and verify JWT cookies | Secure random string |

> **Important:** Never commit your `.env` file or expose MongoDB/JWT secrets.

### 5. Start in Development Mode
```bash
npm run dev
```
The server will watch for changes and listen at `http://localhost:5002`.

### 6. Build & Start for Production
```bash
npm run build
npm start
```

---

## 🔗 REST API Endpoints (All 35 Endpoints)

### 1. Authentication & Profile (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new user |
| **POST** | `/api/auth/login` | Public | Authenticate user and issue JWT cookie |
| **POST** | `/api/auth/logout` | Authenticated | Invalidate JWT cookie |
| **GET** | `/api/auth/profile` | Authenticated | Get current authenticated user profile |
| **PUT** | `/api/auth/profile` | Authenticated | Update profile name or password |
| **POST** | `/api/auth/request-instructor` | Authenticated | Submit request to become an Instructor |

### 2. Courses (`/api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/courses` | Public | List all courses with category/search filters |
| **GET** | `/api/courses/:id` | Public | Get single course details by ID |
| **POST** | `/api/courses` | Instructor / Admin | Create a new course |
| **PUT** | `/api/courses/:id` | Instructor / Admin | Update course details or publish status |
| **DELETE** | `/api/courses/:id` | Instructor / Admin | Delete a course |
| **GET** | `/api/instructor/courses` | Instructor / Admin | Get courses created by the current instructor |
| **GET** | `/api/instructor/stats` | Instructor / Admin | Get instructor performance metrics |

### 3. Lessons (`/api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/courses/:id/lessons` | Public / Enrolled | Get all lessons for a specific course |
| **POST** | `/api/courses/:id/lessons` | Instructor / Admin | Add a new lesson to a course |
| **PUT** | `/api/lessons/:id` | Instructor / Admin | Update lesson title, video URL, or duration |
| **DELETE** | `/api/lessons/:id` | Instructor / Admin | Delete a lesson |

### 4. Enrollments (`/api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/courses/:id/enroll` | Student | Enroll current student in a course |
| **GET** | `/api/my-courses` | Student | Get all courses enrolled by the current student |

### 5. Learning Progress (`/api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/courses/:id/progress` | Student | Get completion progress for a course |
| **PUT** | `/api/courses/:id/progress` | Student | Mark a lesson as completed & recalculate progress |

### 6. Quizzes (`/api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/courses/:id/quiz` | Instructor / Admin | Create a quiz with multiple choice questions |
| **GET** | `/api/courses/:id/quiz` | Authenticated | Get quiz for a course |
| **POST** | `/api/quizzes/:id/submit` | Student | Submit quiz answers and receive score/feedback |
| **PUT** | `/api/quizzes/:id` | Instructor / Admin | Update quiz title, questions, or answers |
| **DELETE** | `/api/quizzes/:id` | Instructor / Admin | Delete a quiz |

### 7. Administration (`/api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/stats` | Admin | Get platform-wide overview analytics |
| **GET** | `/api/admin/users` | Admin | Get list of all registered users |
| **GET** | `/api/admin/users/:id` | Admin | Get specific user profile and history |
| **PATCH** | `/api/admin/users/:id/role` | Admin | Change user role (`student`, `instructor`, `admin`) |
| **PATCH** | `/api/admin/users/:id/status` | Admin | Change user account status (`active`, `blocked`) |
| **GET** | `/api/admin/courses` | Admin | Get all platform courses |
| **GET** | `/api/admin/instructor-requests` | Admin | Get all pending instructor applications |
| **PATCH** | `/api/admin/instructor-requests/:id/approve` | Admin | Approve application and upgrade user to instructor |
| **PATCH** | `/api/admin/instructor-requests/:id/reject` | Admin | Reject application with optional admin feedback |

---

## 🔐 Security & Validation

- **Bcrypt Hashing:** Passwords are never stored in plaintext and are salted with `bcrypt.hash(password, 10)`.
- **JWT Cookies:** Tokens are sent in `httpOnly`, `sameSite: "lax"`, signed cookies to prevent token interception.
- **CORS Protection:** Explicit origin whitelisting (`http://localhost:5173`) with credentials authorization.
- **Mongoose Constraints:** Duplicate emails rejected with `409 Conflict`, input normalization (email trimming and lowercase conversion).

---

## 👨‍💻 Author

**Deekshith M**
- GitHub: [@deekshith0803](https://github.com/deekshith0803)
- Portfolio: [deekshith-five.vercel.app](https://deekshith-five.vercel.app/)
