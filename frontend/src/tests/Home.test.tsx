import { render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/Home";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { vi, type Mocked } from "vitest"

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

// Helper wrapper (for react-router hooks) like useNavigate and useParams
const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Home Page", () => {
  it("shows loading state initially", () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    renderWithRouter(<Home />);
    await waitFor(() =>
      expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument()
    );
  });

  it("renders users when API succeeds", async () => {
    const fakeUsers = [
      { id: 1, name: "John Doe", username: "jdoe", email: "john@test.com" },
    ];
    const fakeAlbums = [{ id: 101, userId: 1, title: "Holiday Pics" }];

    mockedAxios.get
      .mockResolvedValueOnce({ data: fakeUsers }) // first call (users)
      .mockResolvedValueOnce({ data: fakeAlbums }); // second call (albums)

    renderWithRouter(<Home />);

    // Wait for user to appear
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@jdoe")).toBeInTheDocument();
    expect(screen.getByText(/1 album/i)).toBeInTheDocument();
  });

  it("navigates when sign out is clicked", async () => {
    // Mock successful data fetch
    mockedAxios.get
      .mockResolvedValueOnce({ data: [] }) // users
      .mockResolvedValueOnce({ data: [] }); // albums

    renderWithRouter(<Home />);

    const btn = await screen.findByRole("button", { name: /sign out/i });
    userEvent.click(btn);

  });
});
