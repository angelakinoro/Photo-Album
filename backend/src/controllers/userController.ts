import { type Request, type Response } from "express";
import {prisma} from "../prisma/prismaClient.js"

// GET all users
export const getUsers = async (req: Request, res: Response) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error){
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error"}); 
    };
}

// GET user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { albums: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};


// CREATE new user
export const createUser = async (req: Request, res: Response) => {
    try{
        const { name, username, email} = req.body;

        const newUser = await prisma.user.create({
            data: { name, username, email}
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({message: "Internal server error"});
    }
};