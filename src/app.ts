import express from "express";
import authRoute from "./routes/authRoutes.js";
import courseRoute from "./routes/courseRoutes.js";
import lessonRoute from "./routes/lessonRoutes.js";
import cookieParser from "cookie-parser";
import enrollmentRoute from "./routes/enrollmentRoutes.js";
import progressRoute from "./routes/progressRoutes.js";
import quizRoute from "./routes/quizRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
    ],
    optionsSuccessStatus: 200,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("LearnHub Server is running");
});

app.use("/api", authRoute);
app.use("/api", courseRoute);
app.use("/api", lessonRoute);
app.use("/api", enrollmentRoute);
app.use("/api", progressRoute);
app.use("/api", quizRoute);
app.use("/api", adminRoute);

export default app;
