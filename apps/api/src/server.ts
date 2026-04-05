import app from "./index.js";
import { connectDB } from "./config/db.js";
import { log } from "evlog";

export default async function startServer() {
  try {
    await connectDB();
    app.listen(process.env.PORT || 9000, () => {
      log.info({
        message: "Server started",
        port: process.env.PORT || 9000,
      });
    });
  } catch (error) {
    log.error({
      message: "failed to connect database",
      couse: "database or port error",
    });
    console.log("error serser starting:", error);
    process.exit(1);
  }
}

startServer();
