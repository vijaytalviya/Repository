import axios from "axios";
import type { RepositoryType } from "@/models/repository";
import { GITHUB_API_BASE_URL, GITHUB_ORG } from "@/constants/api";

export type RepoResponse = {
  repos: RepositoryType[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
};

export async function fetchRepositories(
  page: number,
  perPage: number = 10
): Promise<RepoResponse> {
  const startTime = performance.now();

  const response = await axios.get(
    `${GITHUB_API_BASE_URL}/orgs/${GITHUB_ORG}/repos?per_page=${perPage}&page=${page}`
  );

  const linkHeader = response.headers["link"];
  let hasNextPage = false;
  let hasPrevPage = false;
  let totalPages = 0;

  if (linkHeader) {
    hasNextPage = linkHeader.includes(`rel="next"`);
    hasPrevPage = linkHeader.includes(`rel="prev"`);

    const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);

    if (lastPageMatch) {
      totalPages = Number(lastPageMatch[1]);
    } else {
      const nextPageMatch = linkHeader.match(/&page=(\d+)>; rel="next"/);
      totalPages = nextPageMatch ? 0 : page;
    }
  }

  const duration = (performance.now() - startTime).toFixed(2);
  console.log(`Fetched repositories in ${duration}ms`);

  return {
    repos: response.data,
    hasNextPage,
    hasPrevPage,
    totalPages,
  };
}
