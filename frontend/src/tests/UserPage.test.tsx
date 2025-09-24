import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserPage from "../pages/UserPage";
import axios from "axios";
import { vi, type Mocked } from "vitest";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("UserPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    renderWithRouter(<UserPage />);
    expect(screen.getByText(/loading user/i)).toBeInTheDocument();
  });

  it("renders error state when API fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    renderWithRouter(<UserPage />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("renders 'User not found' when API returns null", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: null }) // user
      .mockResolvedValueOnce({ data: [] }); // albums

    renderWithRouter(<UserPage />);

    expect(await screen.findByText(/user not found/i)).toBeInTheDocument();
  });

  it("renders user info and albums", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { id: 1, name: "Alice", username: "alice123", email: "alice@test.com" },
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, userId: 1, title: "My Album" }],
      });

    renderWithRouter(<UserPage />);

    // Wait for user info
    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("@alice123")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();

    // Album
    expect(screen.getByText("My Album")).toBeInTheDocument();
  });

  it("navigates back when Back button is clicked", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { id: 1, name: "Alice", username: "alice123", email: "alice@test.com" },
      })
      .mockResolvedValueOnce({ data: [] });

    renderWithRouter(<UserPage />);

    const backButton = await screen.findByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
  });

  it("navigates to album page when album is clicked", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { id: 1, name: "Alice", username: "alice123", email: "alice@test.com" },
      })
      .mockResolvedValueOnce({
        data: [{ id: 10, userId: 1, title: "Cool Album" }],
      });

    renderWithRouter(<UserPage />);

    const albumCard = await screen.findByText("Cool Album");
    expect(albumCard).toBeInTheDocument();

    fireEvent.click(albumCard);
  });
});
