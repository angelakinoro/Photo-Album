import { Router } from "express";
import { getAlbums, getAlbumsByUser, createAlbum } from "../controllers/albumController.js";

const router = Router();

router.get("/", getAlbums);
router.get("/user/:userId", getAlbumsByUser);
router.post("/", createAlbum);

export default router;