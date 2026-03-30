import express, { Application } from "express";
import cors from "cors";
// import { errorMiddleware } from "./middlewares/error.middleware";
// import routes from "./routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health checker
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Wallet service is up & running",
  });
});

// app.use("/api", routes);
// app.use(errorMiddleware);

export default app;