import { type Request, type Response } from "express";
import { prisma } from "../prisma/prismaClient.js";

//GET all albums
export const getAlbums = async (req: Request, res: Response) => {
    try {
        const albums = await prisma.album.findMany();
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch albums"})
    }
};

// GET albums by user
export const getAlbumsByUser = async(req: Request, res: Response) => {
    const { userId } = req.params
    try {
        const albums = await prisma.album.findMany({
            where: { userId: Number(userId) },
            include: { photos: true},
        });
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch albums for user"});
    }
};

// POST new album
/*
export const createAlbum = async(req: Request, res: Response) => {
    const { title, userId } = req.body;
    try {
        const newAlbum = await prisma.album.create({
            data: { title, userId: Number(userId) }
        });
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(400).json({ error: "Failed to create album" })
    }
};*/