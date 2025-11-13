import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import RepositoryCard from "@/components/RepositoryCard";
import { useNavigate } from "react-router-dom";
import type { RepositoryType } from "@/models/repository";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

const mockNavigate = useNavigate as jest.Mock;

const mockRepo: RepositoryType = {
  id: 1,
  name: "my-repo",
  html_url: "https://github.com/godaddy/my-repo",
  private: false,
  updated_at: "2025-01-01T00:00:00Z",
  stargazers_count: 42,
  watchers_count: 10,
  open_issues_count: 3,
  forks_count: 5,
  description: "A fantastic repository",
  language: "TypeScript",
};

describe("RepositoryCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders repo name, description and updated date", () => {
    render(<RepositoryCard repo={mockRepo} currentPage={1} />);

    expect(screen.getByText("my-repo")).toBeInTheDocument();
    expect(screen.getByText("A fantastic repository")).toBeInTheDocument();
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("navigates with repo name and page state on click", () => {
    const navigateMock = jest.fn();
    mockNavigate.mockReturnValue(navigateMock);

    render(<RepositoryCard repo={mockRepo} currentPage={3} />);

    fireEvent.click(screen.getByText("my-repo"));

    expect(navigateMock).toHaveBeenCalledWith("/repository/my-repo", {
      state: { page: 3 },
    });
  });
});
