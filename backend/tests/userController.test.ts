import { getUsers, getUserById } from "../src/controllers/userController";

const mockPrisma = {
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
};

// replace real prisma with mock
jest.mock("../src/prisma/prismaClient", () => ({
    prisma: mockPrisma,
}))

const mockResponse = () => {
    const res:any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("User Controller", () => {
    afterEach(()=>{
        jest.clearAllMocks();
    });

    it("getUsers should return users", async () => {
        const req: any = {};
        const res = mockResponse();

        mockPrisma.user.findMany.mockResolvedValue([{id: 8, username: "Leanne Graham"}]);

        await getUsers(req, res);

        expect(res.json).toHaveBeenCalledWith([{id: 8, username: "Leanne Graham"}]);

    });

    it("getUserById should return user if found", async () => {
        const req: any = { params: { id: "8" } };
        const res = mockResponse();

        mockPrisma.user.findUnique.mockResolvedValue({ id: 8, username: "Leanne Graham" });

        await getUserById(req, res);

        expect(res.json).toHaveBeenCalledWith({ id: 8, username: "Leanne Graham" });
  });

  it("getUserById should return 404 if not found", async () => {
        const req: any = { params: { id: "99" } };
        const res = mockResponse();

        mockPrisma.user.findUnique.mockResolvedValue(null);

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

})