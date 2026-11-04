import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/databaseConnection.js";

await connectDB();

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Error: Port ${PORT} is already in use by another process. Please free up port ${PORT} or change PORT in .env.`,
    );
  } else {
    console.error("Server error:", error);
  }
});
