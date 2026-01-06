import type { FunctionCall } from "./types";
import { searchWeb } from "./search";
import { getGitHubRepo } from "./github";
import { getPortfolioData, getProjectReadme } from "./portfolio";

export async function handleFunctionCall(
  call: FunctionCall,
  userMessage: string
): Promise<{
  functionResponse: {
    name: string;
    response: Record<string, unknown>;
  };
} | null> {
  switch (call.name) {
    case "search_web": {
      const query = call.args?.query || userMessage;
      const results = await searchWeb(query);
      return {
        functionResponse: {
          name: "search_web",
          response: { results, query },
        },
      };
    }

    case "get_github_repo": {
      const { owner, repo, path } = call.args || {};
      if (!owner || !repo) return null;
      const info = await getGitHubRepo(owner, repo, path);
      return {
        functionResponse: {
          name: "get_github_repo",
          response: { info, owner, repo, path: path || null },
        },
      };
    }

    case "get_portfolio_data": {
      const dataType = call.args?.dataType;
      if (!dataType) return null;
      const data = await getPortfolioData(dataType);
      return {
        functionResponse: {
          name: "get_portfolio_data",
          response: { data, dataType },
        },
      };
    }

    case "get_project_readme": {
      const projectTitle = call.args?.projectTitle;
      if (!projectTitle) return null;
      const readme = await getProjectReadme(projectTitle);
      return {
        functionResponse: {
          name: "get_project_readme",
          response: { readme, projectTitle },
        },
      };
    }

    default:
      return null;
  }
}
