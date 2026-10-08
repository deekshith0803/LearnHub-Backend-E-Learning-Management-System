import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/databaseConnection.js";

await connectDB();

const PORT = process.env.PORT;

app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
});
