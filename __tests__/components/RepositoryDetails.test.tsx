import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RepositoryDetails from "@/components/RepositoryDetails";
import fetchRepoDetails from "@/api/fetchRepositoryDetails";

jest.mock("@/api/fetchRepositoryDetails");
jest.mock("@/components/Loader", () => () => (
  <div role="status" aria-label="Loading..." />
));

const mockFetchRepoDetails = fetchRepoDetails as jest.MockedFunction<
  typeof fetchRepoDetails
>;

describe("RepositoryDetails", () => {
  const mockRepo = {
    id: 1,
    name: "sample-repo",
    html_url: "https://github.com/godaddy/sample-repo",
    private: false,
    updated_at: "2025-01-01T00:00:00Z",
    stargazers_count: 10,
    watchers_count: 5,
    forks_count: 3,
    open_issues_count: 0,
    description: "A sample test repository",
    language: "TypeScript",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loader while fetching", async () => {
    mockFetchRepoDetails.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockRepo), 50))
    );

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/repository/sample-repo"]}>
          <Routes>
            <Route path="/repository/:name" element={<RepositoryDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders repository details after fetch", async () => {
    mockFetchRepoDetails.mockResolvedValueOnce(mockRepo);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/repository/sample-repo"]}>
          <Routes>
            <Route path="/repository/:name" element={<RepositoryDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("sample-repo")).toBeInTheDocument();
    });

    expect(screen.getByText("Public")).toBeInTheDocument();
    expect(screen.getByText("A sample test repository")).toBeInTheDocument();
    expect(screen.getByText(/10 stars/)).toBeInTheDocument();
    expect(screen.getByText(/5 watching/)).toBeInTheDocument();
    expect(screen.getByText(/3 forks/)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
  });

  it("renders 'Repository not found' when API returns null", async () => {
    mockFetchRepoDetails.mockResolvedValueOnce(null);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/repository/missing-repo"]}>
          <Routes>
            <Route path="/repository/:name" element={<RepositoryDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Repository not found/i)).toBeInTheDocument();
    });
  });
});
