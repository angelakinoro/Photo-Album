import express from "express";
import cors from "cors";

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Health check route
app.get("/api/health", (req, res) => {
    res.json({ status:"ok", message: "Backend running"});
})

export default app;