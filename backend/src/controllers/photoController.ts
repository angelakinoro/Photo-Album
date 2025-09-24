import {type Request, type Response } from "express";
import { prisma } from "../prisma/prismaClient.js";

// GET photos by album
export const getPhotosByAlbum = async (req: Request, res: Response) => {
    const { albumId } = req.params;

    // Type guard to emsure albumId is a string
    if (typeof albumId !== 'string') {
        return res.status(400).json({error: "Invalid album ID provided"})
    }

    const parsedAlbumId = parseInt(albumId);

    // Check is parsed value is a valid number
    if (isNaN(parsedAlbumId)) {
        return res.status(400).json({error: "Invalid or missing album ID"})
    }
    try {
        const photos = await prisma.photo.findMany({
            where: { albumId: parsedAlbumId },
        });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch photos "});
    }
};

// GET single photo by ID
export const getPhotoById = async (req: Request, res: Response) => {
    const { photoId } = req.params;

    // Type guard to ensure photoId is a string
    if (typeof photoId !== 'string') {
        return res.status(400).json({error: "Invalid photo ID provided"})
    }

    const parsedPhotoId = parseInt(photoId);

    // Check if parsed value is a valid number
    if (isNaN(parsedPhotoId)) {
        return res.status(400).json({error: "Invalid or missing photo ID"})
    }

    try {
        const photo = await prisma.photo.findUnique({
            where: { id: parsedPhotoId },
        });

        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }

        res.json(photo);
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ error: "Failed to fetch photo" });
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
