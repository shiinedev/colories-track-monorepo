import express, { type Express } from "express";
import pinoHttp from "pino-http";
import cors from "cors";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error.js";
import V1routes from "./routes/index.js";
import { logger } from "./utils/logger.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: process.env.FRONT_END_URL,
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   }),
// );

// Allow all origins for development and specific origins for production
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowed = ["http://localhost:3000", "http://localhost:8081"];

      if (
        process.env.NODE_ENV !== "production" ||
        allowed.includes(origin) ||
        origin.endsWith(".railway.app")
      ) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

// loger
app.use(pinoHttp({ logger }));

app.get("/health", (req, res) => {
  req.log.info({
    route: "health",
    status: req.statusCode,
    service: "colorie-track-api",
  });

  res.json({
    ok: true,
    message: "Api is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", V1routes);

// not found

app.use(notFound);

// error handler

app.use(errorHandler);

export default app;
