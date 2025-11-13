import "@testing-library/jest-dom";
import { renderHook, act, waitFor } from "@testing-library/react";
import useRepositories from "@/hooks/useRepositories";
import { fetchRepositories } from "@/api/fetchRepositories";
import type { RepositoryType } from "@/models/repository";

jest.mock("@/api/fetchRepositories");

const mockFetchRepositories = fetchRepositories as jest.MockedFunction<
  typeof fetchRepositories
>;

const createRepo = (id: number, name: string): RepositoryType => ({
  id,
  name,
  html_url: `https://github.com/godaddy/${name}`,
  private: false,
  updated_at: "2025-01-01T00:00:00Z",
  stargazers_count: 10,
  watchers_count: 8,
  open_issues_count: 2,
  forks_count: 1,
  description: `Description for ${name}`,
  language: "TypeScript",
});

describe("useRepositories Hook", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fetches repositories successfully", async () => {
    const mockData = {
      repos: [createRepo(1, "repo1"), createRepo(2, "repo2")],
      hasNextPage: true,
      hasPrevPage: false,
      totalPages: 5,
    };

    mockFetchRepositories.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRepositories(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.repos).toEqual(mockData.repos);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(false);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.error).toBeNull();
  });

  it("handles API errors gracefully", async () => {
    mockFetchRepositories.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useRepositories(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to load repositories.");
    expect(result.current.repos).toEqual([]);
  });

  it("moves between pages correctly", async () => {
    const page1 = {
      repos: [createRepo(1, "repo1")],
      hasNextPage: true,
      hasPrevPage: false,
      totalPages: 5,
    };

    const page2 = {
      repos: [createRepo(2, "repo2")],
      hasNextPage: false,
      hasPrevPage: true,
      totalPages: 5,
    };

    mockFetchRepositories
      .mockResolvedValueOnce(page1) // initial load
      .mockResolvedValueOnce(page2) // go next
      .mockResolvedValueOnce(page1); // go prev

    const { result } = renderHook(() => useRepositories(1));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.goToNextPage());

    await waitFor(() => expect(result.current.currentPage).toBe(2));
    expect(result.current.repos[0].name).toBe("repo2");

    act(() => result.current.goToPrevPage());

    await waitFor(() => expect(result.current.currentPage).toBe(1));
    expect(result.current.repos[0].name).toBe("repo1");
  });
});
