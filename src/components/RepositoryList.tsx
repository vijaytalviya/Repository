import React, { useMemo } from "react";
import RepositoryCard from "@/components/RepositoryCard";
import Loader from "@/components/Loader";
import useRepositories from "@/hooks/useRepositories";
import type { RepositoryType } from "@/models/repository";
import "../styles/repositoryList.css";
import { useSearchParams } from "react-router-dom";
import { getVisiblePages } from "@/utils/helper";

const RepositoriesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = Number(searchParams.get("page")) || 1;

  const {
    repos,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
  } = useRepositories(urlPage);

  const goToPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const visiblePages = useMemo(
    () => getVisiblePages(totalPages, currentPage),
    [currentPage, totalPages]
  );

  if (loading) return <Loader />;
  if (error) return <p className="error-text">{error}</p>;

  if (totalPages && currentPage > totalPages) {
    return (
      <div className="empty-state">
        <p>No more repositories.</p>
        <p>Visit a lower page.</p>
      </div>
    );
  }

  if (!repos.length) {
    return <p className="empty-state">No repositories found.</p>;
  }

  return (
    <div className="repo-container">
      <div className="repo-list">
        {repos.map((repo: RepositoryType) => (
          <RepositoryCard key={repo.id} repo={repo} currentPage={currentPage} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn"
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            {visiblePages.map((p, index) => {
              if (p === "...") {
                return (
                  <span key={`dots-${index}`} className="pagination-dots">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={p}
                  onClick={() => goToPage(p as number)}
                  className={`pagination-number ${
                    currentPage === p ? "active" : ""
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            className="btn"
            onClick={goToNextPage}
            disabled={!hasNextPage}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default RepositoriesList;
