import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AlbumPage from "../pages/AlbumPage";
import axios from "axios";
import { vi, type Mocked } from "vitest";

// Mock axios as before
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

// Mock console.error to prevent it from logging errors to stderr
const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

const renderWithRouter = (albumId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/albums/${albumId}`]}>
      <Routes>
        <Route path="/albums/:albumId" element={<AlbumPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("AlbumPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  // After all tests, restore the original console.error
  afterAll(() => {
    errorSpy.mockRestore();
  });

  it("renders loading state", () => {
    mockedAxios.get.mockImplementationOnce(() => new Promise(() => {}));
    renderWithRouter("1");
    expect(screen.getByText(/Loading photos/i)).toBeInTheDocument();
  });

  it("renders error state", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
    renderWithRouter("1");

    await waitFor(() =>
      expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument()
    );
  });

  it("renders empty album message", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    renderWithRouter("1");

    await waitFor(() =>
      expect(screen.getByText(/No photos in this album/i)).toBeInTheDocument()
    );
  });

  it("renders photos successfully", async () => {
    const mockPhotos = [
      { id: 1, title: "First Photo", imageUrl: "http://example.com/1.jpg", albumId: 1 },
      { id: 2, title: "Second Photo", imageUrl: "http://example.com/2.jpg", albumId: 1 },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockPhotos });

    renderWithRouter("1");

    expect(await screen.findByText("First Photo")).toBeInTheDocument();
    expect(await screen.findByText("Second Photo")).toBeInTheDocument();

    const imgs = screen.getAllByRole("img");
    expect(imgs.length).toBe(2);
  });

  it("shows fallback when image fails to load", async () => {
    const mockPhotos = [
      { id: 1, title: "Broken Photo", imageUrl: "http://broken.url/test.jpg", albumId: 1 },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockPhotos });

    renderWithRouter("1");

    const img = await screen.findByRole("img");

    await waitFor(() => {
      img.dispatchEvent(new Event("error"));
      expect(screen.getByText(/Image failed to load/i)).toBeInTheDocument();
    });
  });
});