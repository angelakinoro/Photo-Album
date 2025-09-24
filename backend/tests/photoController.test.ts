import { getPhotosByAlbum, getPhotoById, updatePhotoTitle } from "../src/controllers/photoController";

const mockPrisma = {
  photo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock("../src/prisma/prismaClient", () => ({
  prisma: mockPrisma,
}));

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Photo Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getPhotosByAlbum should return photos for an album", async () => {
        const req: any = { params: { albumId: "1" } };
        const res = mockResponse();

        mockPrisma.photo.findMany.mockResolvedValue([{ id: 1, title: "Photo 1" }]);

        await getPhotosByAlbum(req, res);

        expect(res.json).toHaveBeenCalledWith([{ id: 1, title: "Photo 1" }]);
    });

  it("getPhotoById should return a photo by ID", async () => {
        const req: any = { params: { photoId: "1" } };
        const res = mockResponse();

        mockPrisma.photo.findUnique.mockResolvedValue({ id: 1, title: "Photo 1" });

        await getPhotoById(req, res);

        expect(res.json).toHaveBeenCalledWith({ id: 1, title: "Photo 1" });
    });

  it("getPhotoById should return 404 if photo not found", async () => {
        const req: any = { params: { photoId: "999" } };
        const res = mockResponse();

        mockPrisma.photo.findUnique.mockResolvedValue(null);

        await getPhotoById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Photo not found" });
    });

  it("updatePhotoTitle should update a photo", async () => {
        const req: any = { params: { photoId: "1" }, body: { title: "Updated Title" } };
        const res = mockResponse();

        mockPrisma.photo.update.mockResolvedValue({ id: 1, title: "Updated Title" });

        await updatePhotoTitle(req, res);

        expect(res.json).toHaveBeenCalledWith({ id: 1, title: "Updated Title" });
    });
});
