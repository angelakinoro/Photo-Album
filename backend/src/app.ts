import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";

dotenv.config();

const app: Application = express();

//Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);

//Health check route
app.get("/api/health", (req, res) => {
    res.json({ status:"ok", message: "Backend running"});
})

export default app;