import request from "supertest";
import app from "../src/app";

describe ("User Routes", () => {
    // GET /api/users
    it ("should fetch all users", async () => {
        const res = await request(app).get("/api/users");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // GET /api/users/:id
    it ("should fetch a single user by id", async () => {
        // user with id = 8
        const res = await request(app).get("/api/users/8");

        if (res.statusCode === 404) {
            expect(res.body).toHaveProperty("error", "User not found");
        } else {
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("id", 8);
            expect(res.body).toHaveProperty("albums");
        }
    });
    
})