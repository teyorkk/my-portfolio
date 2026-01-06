export function getFunctionDeclarations() {
  return [
    {
      name: "search_web",
      description:
        "Search the web for current information, news, or up-to-date data. Use this function when you need to find the latest information about current events, news, recent developments, or any information that changes over time.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The search query to look up on the web. Should be specific and relevant to what the user is asking about.",
          },
        },
        required: ["query"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
    {
      name: "get_github_repo",
      description:
        "Access GitHub repository information, including repository details, README files, and file contents. Use this when users ask about specific GitHub repositories, want to see code, or need information about a project on GitHub.",
      parameters: {
        type: "object",
        properties: {
          owner: {
            type: "string",
            description:
              "The GitHub username or organization that owns the repository (e.g., 'facebook', 'vercel', 'teyorkk').",
          },
          repo: {
            type: "string",
            description:
              "The name of the repository (e.g., 'react', 'next.js', 'my-portfolio').",
          },
          path: {
            type: "string",
            description:
              "Optional: Specific file or directory path within the repository (e.g., 'src/index.js', 'README.md', 'package.json'). If not provided, returns repository overview and README.",
          },
        },
        required: ["owner", "repo"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
    {
      name: "get_portfolio_data",
      description:
        "Access portfolio data files including projects, skills, certifications, and services. Use this when users ask about the portfolio owner's work, skills, certifications, or services offered.",
      parameters: {
        type: "object",
        properties: {
          dataType: {
            type: "string",
            description:
              "The type of portfolio data to retrieve. Must be one of: 'projects', 'skills', 'certifications', 'services'.",
            enum: ["projects", "skills", "certifications", "services"],
          },
        },
        required: ["dataType"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
    {
      name: "get_project_readme",
      description:
        "Get the README file from a project listed in the portfolio. Use this when users ask about a specific project's README or want to see project documentation. The project must be listed in the portfolio projects.",
      parameters: {
        type: "object",
        properties: {
          projectTitle: {
            type: "string",
            description:
              "The title of the project from the portfolio (e.g., 'IskolarBlock', 'My Portfolio Website', 'Trackify', 'Cineverse', 'SocMedSS', 'CineMood', 'La La Land').",
          },
        },
        required: ["projectTitle"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
  ];
}

