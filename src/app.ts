import express, { Application } from "express";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middlewares/index.middleware";
import routes from "./routes/index.routes"

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Wallet service is up & running",
  });
});

app.use("/api", routes);


app.use(notFoundHandler); //404 handler
app.use(errorHandler); //global error handler 
export default app;