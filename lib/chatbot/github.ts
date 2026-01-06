import type { GitHubContent, GitHubRepo } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

function createGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  return headers;
}

export async function getGitHubRepo(
  owner: string,
  repo: string,
  path?: string
): Promise<string> {
  try {
    const headers = createGitHubHeaders();

    if (path) {
      const contentResult = await fetchGitHubContent(
        owner,
        repo,
        path,
        headers
      );
      if (contentResult) return contentResult;
    }

    const repoData = await fetchGitHubRepo(owner, repo, headers);
    const readme = await fetchGitHubReadme(owner, repo, headers);

    return readme ? `${repoData}\n\nREADME:\n${readme}` : repoData;
  } catch (error) {
    console.error("GitHub API error:", error);
    return `I encountered an error accessing the GitHub repository ${owner}/${repo}. ${
      error instanceof Error
        ? error.message
        : "Please check if the repository exists and is accessible."
    }`;
  }
}

async function fetchGitHubContent(
  owner: string,
  repo: string,
  path: string,
  headers: HeadersInit
): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
    { headers }
  );

  if (!response.ok) return null;

  const content: GitHubContent = await response.json();

  if (
    content.type === "file" &&
    content.encoding === "base64" &&
    content.content
  ) {
    const fileContent = Buffer.from(content.content, "base64").toString(
      "utf-8"
    );
    return `File: ${path}\n\n${fileContent}`;
  }

  if (content.type === "dir") {
    const files: GitHubContent[] = Array.isArray(content) ? content : [content];
    const fileList = files
      .map((file) => `- ${file.name || "unknown"} (${file.type})`)
      .join("\n");
    return `Directory: ${path}\n\nFiles:\n${fileList}`;
  }

  return null;
}

async function fetchGitHubRepo(
  owner: string,
  repo: string,
  headers: HeadersInit
): Promise<string> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      return `Repository ${owner}/${repo} not found. Please check the repository name and owner.`;
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const repoData: GitHubRepo = await response.json();

  const lines = [
    `Repository: ${repoData.full_name}`,
    `Description: ${repoData.description || "No description"}`,
    `Stars: ${repoData.stargazers_count}`,
    `Forks: ${repoData.forks_count}`,
    `Language: ${repoData.language || "N/A"}`,
    `Created: ${new Date(repoData.created_at).toLocaleDateString()}`,
    `Updated: ${new Date(repoData.updated_at).toLocaleDateString()}`,
    `URL: ${repoData.html_url}`,
  ];

  if (repoData.homepage) {
    lines.push(`Homepage: ${repoData.homepage}`);
  }

  return lines.join("\n");
}

async function fetchGitHubReadme(
  owner: string,
  repo: string,
  headers: HeadersInit
): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
    { headers }
  );

  if (!response.ok) return null;

  const readme = await response.json();
  if (!readme.content) return null;

  return Buffer.from(readme.content, "base64").toString("utf-8");
}
