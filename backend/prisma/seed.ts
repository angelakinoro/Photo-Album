import { prisma }  from "../src/prisma/prismaClient.js";
import axios from "axios";

async function main() {
    console.log("Seeding database with a small JSONPlaceholder dataset");

    await prisma.photo.deleteMany();
    await prisma.album.deleteMany();
    await prisma.user.deleteMany();
     

    // Empty Object that will store mappings of the external Id to the new generated Id
    const userIdMap: Record<number, number> = {};
    const albumIdMap: Record<number, number> = {};

    // 1. Fetch and insert Users (limit 3)
    const { data: users } = await axios.get("https://jsonplaceholder.typicode.com/users");
    for (const user of users.slice(0, 3)) {
        const newUser = await prisma.user.create({
        data: {
            name: user.name,
            username: user.username,
            email: user.email,
        },
        });
        userIdMap[user.id] = newUser.id;
    }

    // 2. Fetch and insert Albums (limit 5)
    const { data: albums } = await axios.get("https://jsonplaceholder.typicode.com/albums");
    for (const album of albums.slice(0, 5)) {
        if (userIdMap[album.userId]) {
        const newAlbum = await prisma.album.create({
            data: {
            title: album.title,
            userId: userIdMap[album.userId],
            },
        });
        albumIdMap[album.id] = newAlbum.id;
        }
    }

    // 3. Fetch and insert Photos (limit 10)
    const { data: photos } = await axios.get("https://jsonplaceholder.typicode.com/photos");
    for (const photo of photos.slice(0, 10)) {
        if (albumIdMap[photo.albumId]) {
        await prisma.photo.create({
            data: {
            title: photo.title,
            imageUrl: photo.url,
            albumId: albumIdMap[photo.albumId],
            },
        });
        }
    }

    console.log("✅ Database seeded successfully with small dataset.");
    }

    main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
