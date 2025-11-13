import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PER_PAGE } from "@/constants/api";
import { fetchRepositories } from "@/api/fetchRepositories";
import type { RepositoryType } from "@/models/repository";

function useRepositories(urlPage: number) {
  const [repos, setRepos] = useState<RepositoryType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRepos = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const { repos, hasNextPage, hasPrevPage, totalPages } =
        await fetchRepositories(page, DEFAULT_PER_PAGE);

      setRepos(repos);
      setHasNextPage(hasNextPage);
      setHasPrevPage(hasPrevPage);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch {
      setError("Failed to load repositories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepos(urlPage);
  }, [loadRepos, urlPage]);

  const goToNextPage = () => {
    if (hasNextPage) loadRepos(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (hasPrevPage && currentPage > 1) loadRepos(currentPage - 1);
  };

  return {
    repos,
    loading,
    error,
    currentPage,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    totalPages,
  };
}

export default useRepositories;
