import { getAlbums, getAlbumsByUser} from "../src/controllers/albumController";

const mockPrisma = {
  album: {
    findMany: jest.fn(),
    create: jest.fn(),
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

describe("Album Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getAlbums should return all albums", async () => {
        const req: any = {};
        const res = mockResponse();

        mockPrisma.album.findMany.mockResolvedValue([{ id: 1, title: "Album 1" }]);

        await getAlbums(req, res);

        expect(res.json).toHaveBeenCalledWith([{ id: 1, title: "Album 1" }]);
    });

  it("getAlbumsByUser should return albums for a user", async () => {
        const req: any = { params: { userId: "1" } };
        const res = mockResponse();

        mockPrisma.album.findMany.mockResolvedValue([{ id: 1, title: "Album 1", photos: [] }]);

        await getAlbumsByUser(req, res);

        expect(res.json).toHaveBeenCalledWith([{ id: 1, title: "Album 1", photos: [] }]);
    });
});
