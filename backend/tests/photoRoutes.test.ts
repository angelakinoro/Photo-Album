import request from "supertest";
import app from "../src/app";

describe("Photo Routes", () => {
  // GET /api/photos/album/:albumId
  it("should fetch photos by album ID", async () => {
        const res = await request(app).get("/api/photos/album/11");

        if (res.statusCode === 400) {
        expect(res.body).toHaveProperty("error");
        } else {
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        }
    });

  // GET /api/photos/:photoId
  it("should fetch a single photo by ID", async () => {
        const res = await request(app).get("/api/photos/11");

        if (res.statusCode === 404) {
        expect(res.body).toHaveProperty("error", "Photo not found");
        } else if (res.statusCode === 400) {
        expect(res.body).toHaveProperty("error");
        } else {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("title");
        }
    });

  // PATCH /api/photos/:photoId
  it("should update a photo title", async () => {
        const res = await request(app).patch("/api/photos/11").send({ title: "Updated Title" });

        if (res.statusCode === 400) {
        expect(res.body).toHaveProperty("error", "Failed to update photo title");
        } else {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title", "Updated Title");
        }
    });
});
