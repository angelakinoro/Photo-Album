import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PhotoPage from "../pages/PhotoPage";
import axios from "axios";
import { vi, type Mocked } from "vitest";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

const renderWithRouter = (id: string) => {
  return render(
    <MemoryRouter initialEntries={[`/photos/${id}`]}>
      <Routes>
        <Route path="/photos/:id" element={<PhotoPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("PhotoPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", async () => {
    mockedAxios.get.mockImplementationOnce(
      () => new Promise(() => {}) // never resolves
    );

    renderWithRouter("1");
    expect(screen.getByText(/Loading photo/i)).toBeInTheDocument();
  });

  it("renders error state", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    renderWithRouter("1");

    await waitFor(() =>
      expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument()
    );
  });

  it("renders photo not found", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    renderWithRouter("1");

    await waitFor(() =>
      expect(screen.getByText(/Photo not found/i)).toBeInTheDocument()
    );
  });

  it("renders photo details successfully", async () => {
    const mockPhoto = {
      id: 1,
      title: "Test Photo",
      imageUrl: "http://example.com/test.jpg",
      albumId: 1,
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockPhoto });

    renderWithRouter("1");

    expect(await screen.findByText("Test Photo")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", mockPhoto.imageUrl);
  });

  it("allows editing photo title and saving", async () => {
    const mockPhoto = {
      id: 1,
      title: "Old Title",
      imageUrl: "http://example.com/test.jpg",
      albumId: 1,
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockPhoto });
    mockedAxios.patch.mockResolvedValueOnce({
      data: { ...mockPhoto, title: "New Title" },
    });

    renderWithRouter("1");

    // Wait for photo to load
    await screen.findByText("Old Title");

    // Click edit button
    fireEvent.click(screen.getByText(/Edit Title/i));

    // Type new title
    const input = screen.getByPlaceholderText(/Enter photo title/i);
    fireEvent.change(input, { target: { value: "New Title" } });

    // Click save
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "http://localhost:4000/api/photos/1",
        { title: "New Title" }
      )
    );

    expect(await screen.findByText("New Title")).toBeInTheDocument();
  });
});
