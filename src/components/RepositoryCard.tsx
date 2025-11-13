import type { RepositoryType } from "@/models/repository";
import "../styles/repositoryCard.css";
import { useNavigate } from "react-router-dom";

const RepositoryCard = ({
  repo,
  currentPage,
}: {
  repo: RepositoryType;
  currentPage: number;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/repository/${repo.name}`, {
      state: { page: currentPage },
    });
  };

  const updatedDate = new Date(repo.updated_at).toLocaleDateString();

  return (
    <div className="repo-card" onClick={handleClick}>
      <div className="repo-header">
        <span className="repo-title">{repo.name}</span>
        <span className="repo-badge">
          {repo.private ? "Private" : "Public"}
        </span>
      </div>

      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}

      <div className="repo-footer">
        <span>Updated {updatedDate}</span>
      </div>
    </div>
  );
};

export default RepositoryCard;
