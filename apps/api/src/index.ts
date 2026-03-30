import express from "express";
import { initLogger } from "evlog";
import { evlog } from "evlog/express";
import V1routes from "./routes";
import cors from "cors";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error";

initLogger({
  env: { service: "colorie-track-api" },
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(evlog());

app.get("/health", (req, res) => {
  req.log.set({
    route: "health",
    status: req.statusCode,
    service: "colorie-track-api",
  });
  res.json({ ok: true, message: "Api is running!" });
});

app.use("/api/v1", V1routes);

// not found

app.use(notFound);

// error handler

app.use(errorHandler);

export default app;
