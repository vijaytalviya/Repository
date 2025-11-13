import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import "../styles/repositoryDetails.css";
import type { RepositoryType } from "@/models/repository";
import fetchRepoDetails from "@/api/fetchRepositoryDetails";
import starIcon from "../assets/star.svg";
import forkIcon from "../assets/fork.svg";
import watchIcon from "../assets/eye.svg";
const RepositoryDetails = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [repo, setRepo] = useState<RepositoryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await fetchRepoDetails(name as string);
        setRepo(res);
      } catch (err) {
        console.error("Error fetching repo:", err);
      } finally {
        setLoading(false);
      }
    };

    if (name) fetchRepo();
  }, [name]);

  if (loading) return <Loader />;
  if (!repo)
    return (
      <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
        Repository not found.
      </p>
    );

  return (
    <div className="repo-details-container">
      <div className="repo-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="repo-title-section">
          <h1>{repo.name}</h1>
          <span className="visibility-tag">
            {repo.private ? "Private" : "Public"}
          </span>
        </div>
      </div>

      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}

      <div className="repo-stats">
        <div className="info-item">
          <img src={starIcon} alt="logo" height={20} width={20} />
          <span>{repo.stargazers_count} stars</span>
        </div>
        <div className="info-item">
          <img src={watchIcon} alt="logo" height={20} width={20} />
          <span>{repo.watchers_count} watching</span>
        </div>
        <div className="info-item">
          <img src={forkIcon} alt="logo" height={15} width={15} />
          <span>{repo.forks_count} forks</span>
        </div>
        <div className="meta-item">
          <strong>Language:</strong>{" "}
          {repo.language && (
            <span className="stat-item">
              <span className="lang-dot" /> {repo.language}
            </span>
          )}
        </div>
      </div>

      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="github-link"
      >
        View on GitHub
      </a>
    </div>
  );
};

export default RepositoryDetails;
