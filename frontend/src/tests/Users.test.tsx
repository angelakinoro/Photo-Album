import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Users from "../pages/Users";
import { api } from "../api/client";

// 🔹 Mock the api client
vi.mock("../api/client", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("Users Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the heading", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText(/Users/i)).toBeInTheDocument();
    });
  });

  test("renders list of users when API succeeds", async () => {
    (api.get as any).mockResolvedValue({
      data: [
        { id: 1, name: "John Doe", username: "johnd", email: "john@example.com" },
        { id: 2, name: "Jane Doe", username: "janed", email: "jane@example.com" },
      ],
    });

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  test("renders empty list gracefully", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    render(<Users />);

    await waitFor(() => {
      // Just ensures the heading is there and no crash
      expect(screen.getByText(/Users/i)).toBeInTheDocument();
    });
  });

  test("handles API error without crashing", async () => {
    (api.get as any).mockRejectedValue(new Error("API error"));

    render(<Users />);

    await waitFor(() => {
      expect(screen.getByText(/Users/i)).toBeInTheDocument();
    });
  });
});
