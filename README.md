# LearnHub Backend – E-Learning Management System

LearnHub is a **MERN stack Learning Management System (LMS)** backend that provides APIs for user authentication, course management, lessons, enrollments, learning progress, quizzes, and administration.

## 🚀 Features

- **Authentication** – User registration, login, logout, and profile.
- **Role-Based Authorization** – Student, instructor, and admin roles.
- **Course Management** – Create, view, update, and delete courses.
- **Lesson Management** – Manage lessons associated with courses.
- **Enrollments** – Enroll students in courses and view enrolled courses.
- **Learning Progress** – Track completed lessons and course completion percentage.
- **Quizzes** – Create quizzes, submit answers, and calculate scores.
- **Admin Dashboard APIs** – View statistics, manage users, update user roles and status, and view courses.
- **MongoDB Integration** – Store application data using MongoDB and Mongoose.
- **JWT Authentication** – Protect routes using JSON Web Tokens and HTTP-only cookies.

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- dotenv
- cookie-parser

## 📁 Project Structure

```text
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── types/
├── app.ts
└── index.ts
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd LearnHub-Backend-E-Learning-Management-System
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
```

Replace the example values with your actual configuration. **Never commit your `.env` file or expose your secrets on GitHub.**

### 4. Start the development server

```bash
npm run dev
```

### 5. Build and run for production

```bash
npm run build
npm start
```

Check your `package.json` to confirm that these scripts are configured.

## 🔗 API Endpoints

The following endpoints are implemented in the project.

### Authentication

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/auth/register` | Register a user                      |
| POST   | `/api/auth/login`    | Log in                               |
| POST   | `/api/auth/logout`   | Log out                              |
| GET    | `/api/auth/profile`  | Get the authenticated user's profile |

### Courses

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/api/courses`            | Get all courses           |
| GET    | `/api/courses/:id`        | Get a course by ID        |
| POST   | `/api/courses`            | Create a course           |
| PUT    | `/api/courses/:id`        | Update a course           |
| DELETE | `/api/courses/:id`        | Delete a course           |
| GET    | `/api/instructor/courses` | Get instructor courses    |
| GET    | `/api/instructor/stats`   | Get instructor statistics |

### Lessons

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/api/courses/:id/lessons` | Get course lessons |
| POST   | `/api/courses/:id/lessons` | Create a lesson    |
| PUT    | `/api/lessons/:id`         | Update a lesson    |
| DELETE | `/api/lessons/:id`         | Delete a lesson    |

### Enrollments

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | `/api/courses/:id/enroll` | Enroll in a course   |
| GET    | `/api/my-courses`         | Get enrolled courses |

### Learning Progress

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| PUT    | `/api/courses/:id/progress` | Update learning progress |
| GET    | `/api/courses/:id/progress` | Get learning progress    |

### Quizzes

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | `/api/courses/:id/quiz`   | Create a quiz       |
| GET    | `/api/courses/:id/quiz`   | Get a course quiz   |
| POST   | `/api/quizzes/:id/submit` | Submit quiz answers |

### Admin

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | `/api/admin/stats`     | Get platform statistics |
| GET    | `/api/admin/users`     | Get all users           |
| GET    | `/api/admin/users/:id` | Get a user by ID        |
| GET    | `/api/admin/courses`   | Get all courses         |

**Note:** Protected endpoints require authentication and, where applicable, the correct user role.

## 🔐 Security

- Password hashing with bcrypt.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Role-based access control.
- Input validation for supported operations.

## 🧪 API Testing

Use **Postman** to test the API endpoints. For protected routes, log in first and send the authentication cookie with subsequent requests.

## 🗺️ Future Improvements

- Payment integration.
- Quiz attempt and result history.
- Pagination and filtering.
- Improved validation and error handling.
- Additional course analytics and reporting.

## 👨‍💻 Author

**Deekshith M**

- GitHub: [deekshith0803](https://github.com/deekshith0803)
- Portfolio: [deekshith-five.vercel.app](https://deekshith-five.vercel.app/)

---

Built as a full-stack development project to practice backend development, authentication, authorization, REST APIs, and database design.
