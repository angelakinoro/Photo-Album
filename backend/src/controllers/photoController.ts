import {type Request, type Response } from "express";
import { prisma } from "../prisma/prismaClient.js";

// GET photos by album
export const getPhotosByAlbum = async (req: Request, res: Response) => {
    const { albumId } = req.params;
    try {
        const photos = await prisma.photo.findMany({
            where: { albumId: Number(albumId) },
        });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch photos "});
    }
};

// UPDATE photo title
export const updatePhotoTitle = async (req: Request, res: Response) => {
  const { photoId } = req.params;
  const { title } = req.body;
  try {
    const updatedPhoto = await prisma.photo.update({
      where: { id: Number(photoId) },
      data: { title },
    });
    res.json(updatedPhoto);
  } catch (err) {
    res.status(400).json({ error: "Failed to update photo title" });
  }
};
