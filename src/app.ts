import express from "express";
import authRoute from "./routes/authRoutes.js";
import courseRoute from "./routes/courseRoutes.js";
import lessonRoute from "./routes/lessonRoutes.js";
import cookieParser from "cookie-parser";
import enrollmentRoute from "./routes/enrollmentRoutes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("LearnHub Server is running");
});

app.use("/api/auth", authRoute);
app.use("/api", courseRoute);
app.use("/api", lessonRoute);
app.use("/api", enrollmentRoute);

export default app;
