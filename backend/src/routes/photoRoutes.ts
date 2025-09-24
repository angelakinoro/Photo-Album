import { Router } from "express";
import { getPhotosByAlbum, updatePhotoTitle, getPhotoById} from "../controllers/photoController.js";

const router = Router();

router.get("/album/:albumId", getPhotosByAlbum);
router.get("/:photoId", getPhotoById)
router.patch("/:photoId", updatePhotoTitle);

export default router;
