import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import RepositoriesList from "@/components/RepositoryList";
import useRepositories from "@/hooks/useRepositories";
import type { RepositoryType } from "@/models/repository";
import { MemoryRouter } from "react-router-dom";

jest.mock("@/hooks/useRepositories");

jest.mock(
  "@/components/RepositoryCard",
  () =>
    ({ repo }: { repo: RepositoryType }) =>
      <div data-testid="repo-card">{repo.name}</div>
);

const mockUseRepositories = useRepositories as jest.MockedFunction<
  typeof useRepositories
>;

const mockSetParams = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useSearchParams: () => [new URLSearchParams({ page: "1" }), mockSetParams],
  };
});

describe("RepositoriesList Component", () => {
  const mockRepos: RepositoryType[] = [
    {
      id: 1,
      name: "repo1",
      html_url: "https://github.com/repo1",
      private: false,
      updated_at: "2025-01-01T00:00:00Z",
      stargazers_count: 10,
      watchers_count: 8,
      open_issues_count: 2,
      forks_count: 1,
      description: "desc 1",
      language: "TypeScript",
    },
    {
      id: 2,
      name: "repo2",
      html_url: "https://github.com/repo2",
      private: false,
      updated_at: "2025-01-01T00:00:00Z",
      stargazers_count: 5,
      watchers_count: 5,
      open_issues_count: 1,
      forks_count: 2,
      description: "desc 2",
      language: "JS",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loader while loading", () => {
    mockUseRepositories.mockReturnValue({
      repos: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
      goToNextPage: jest.fn(),
      goToPrevPage: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/repositories?page=1"]}>
        <RepositoriesList />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message when request fails", () => {
    mockUseRepositories.mockReturnValue({
      repos: [],
      loading: false,
      error: "Failed to load repositories.",
      currentPage: 1,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
      goToNextPage: jest.fn(),
      goToPrevPage: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/repositories?page=1"]}>
        <RepositoriesList />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Failed to load repositories.")
    ).toBeInTheDocument();
  });

  it("shows empty state when no repositories found", () => {
    mockUseRepositories.mockReturnValue({
      repos: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasPrevPage: false,
      hasNextPage: false,
      goToNextPage: jest.fn(),
      goToPrevPage: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/repositories?page=1"]}>
        <RepositoriesList />
      </MemoryRouter>
    );

    expect(screen.getByText("No repositories found.")).toBeInTheDocument();
  });

  it("renders repository cards and pagination", () => {
    mockUseRepositories.mockReturnValue({
      repos: mockRepos,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 5,
      hasPrevPage: false,
      hasNextPage: true,
      goToNextPage: jest.fn(),
      goToPrevPage: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/repositories?page=1"]}>
        <RepositoriesList />
      </MemoryRouter>
    );

    const cards = screen.getAllByTestId("repo-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("repo1");
    expect(cards[1]).toHaveTextContent("repo2");

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Next →")).toBeEnabled();
    expect(screen.getByText("← Previous")).toBeDisabled();
  });

  it("fires pagination callbacks", () => {
    const mockNext = jest.fn();
    const mockPrev = jest.fn();

    mockUseRepositories.mockReturnValue({
      repos: mockRepos,
      loading: false,
      error: null,
      currentPage: 3,
      totalPages: 5,
      hasPrevPage: true,
      hasNextPage: true,
      goToNextPage: mockNext,
      goToPrevPage: mockPrev,
    });

    render(
      <MemoryRouter initialEntries={["/repositories?page=3"]}>
        <RepositoriesList />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Next →"));
    fireEvent.click(screen.getByText("← Previous"));

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockPrev).toHaveBeenCalledTimes(1);
  });

  it("updates search params when a page number is clicked", () => {
    mockSetParams.mockClear();

    mockUseRepositories.mockReturnValue({
      repos: mockRepos,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 5,
      hasPrevPage: false,
      hasNextPage: true,
      goToNextPage: jest.fn(),
      goToPrevPage: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/repositories?page=1"]}>
        <RepositoriesList />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("2"));

    expect(mockSetParams).toHaveBeenCalledWith({ page: "2" });
  });
});
