import app from ".";
import { connectDB } from "./config/db";
import { log } from "evlog";

export default async function startServer() {
  connectDB();
  app.listen(process.env.PORT || 9000, () => {
    log.info({
      message: "Server started",
      port: process.env.PORT || 9000,
    });
  });
}

startServer();
