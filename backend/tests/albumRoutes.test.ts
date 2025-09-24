import request from "supertest";
import app from "../src/app";

describe("Album Routes", () => {
    // GET /api/albums
    it("should fetch all albums", async () => {
        const res = await request(app).get("/api/albums");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // GET /api/albums/user/:userId
    it("should fetch albums for a given user", async () => {

        const res = await request(app).get("/api/albums/user/8");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("photos");
        }
    });

});
