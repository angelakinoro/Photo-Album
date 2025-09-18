import { Router } from "express";
import { getPhotosByAlbum, updatePhotoTitle } from "../controllers/photoController.js";

const router = Router();

router.get("/album/:albumId", getPhotosByAlbum);
router.patch("/:photoId", updatePhotoTitle);

export default router;
