import axios from "axios";
import type { RepositoryType } from "@/models/repository";
import { GITHUB_API_BASE_URL, GITHUB_ORG } from "@/constants/api";

const fetchRepoDetails = async (
  repoName: string
): Promise<RepositoryType | null> => {
  const start = performance.now();
  try {
    const response = await axios.get<RepositoryType>(
      `${GITHUB_API_BASE_URL}/repos/${GITHUB_ORG}/${repoName}`
    );
    console.log("Fetch Repository Details Time:",performance.now() - start, "ms"); // console can be replaced with proper logging service in production env
    return response.data;
  } catch {
    return null;
  }
};

export default fetchRepoDetails;
