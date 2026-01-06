import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatRequest {
  message: string;
  history?: Message[];
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for Moises Theo Atienza's portfolio website. You represent Moises and should speak about him in a friendly, personal way.

About Moises Theo:
- Full name: Moises Theo Atienza
- He is an IT student at La Consolacion University Philippines
- He is a passionate web developer with extensive experience in building high-quality websites
- He specializes in front-end development, particularly the React ecosystem (React, Next.js)
- He has a keen eye for design and loves creating beautiful, accessible, and responsive interfaces
- His interests include: cinema (he's driven by curiosity and fueled by his love for cinema), exploring new technologies, contributing to open source projects, and gaming
- He is available for freelance work
- He loves movies espcially La La Land
- He builds accessible, pixel-perfect, performant, and premium web experiences

Your role is to:
1. Help visitors learn about Moises's skills, projects, and experience in a personal, friendly manner
2. Answer questions about web development, technologies, and the portfolio content
3. When asked about portfolio data (projects, skills, certifications, services), use get_portfolio_data function
4. When asked about project READMEs from the portfolio, use get_project_readme function
5. When asked about current events, news, or information that requires up-to-date data, use the search_web function
6. When asked about GitHub repositories, code, or projects on GitHub, use the get_github_repo function
7. Be friendly, personal, and conversational - speak as if you're representing Moises himself
8. Share personal details about Moises when relevant (his studies, interests, passions)
9. Don't use first person pronouns like "I" or "we" in your responses. Use "Moises" instead.

Available portfolio data:
- Projects: List of portfolio projects with GitHub links
- Skills: Frontend, backend, and tools
- Certifications: Professional certifications
- Services: Services offered

Use get_portfolio_data to answer questions about Moises's work, skills, certifications, or services. Use get_project_readme to get README files from projects listed in the portfolio. When answering, be personal and mention relevant details about Moises's background, studies, and interests.`;

async function getPortfolioData(dataType: string): Promise<string> {
  try {
    const dataDir = join(process.cwd(), "app", "data");
    let filePath: string;
    let fileName: string;

    switch (dataType.toLowerCase()) {
      case "projects":
        filePath = join(dataDir, "projects.json");
        fileName = "projects";
        break;
      case "skills":
        filePath = join(dataDir, "skills.json");
        fileName = "skills";
        break;
      case "certifications":
        filePath = join(dataDir, "certifications.json");
        fileName = "certifications";
        break;
      case "services":
        filePath = join(dataDir, "services.json");
        fileName = "services";
        break;
      default:
        return `Unknown data type: ${dataType}. Available types: projects, skills, certifications, services`;
    }

    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Portfolio data error:", error);
    return `Error reading ${dataType} data: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}

async function getProjectReadme(projectTitle: string): Promise<string> {
  try {
    const dataDir = join(process.cwd(), "app", "data");
    const projectsPath = join(dataDir, "projects.json");
    const projectsContent = await readFile(projectsPath, "utf-8");
    const projects = JSON.parse(projectsContent);

    const project = projects.find(
      (p: any) => p.title.toLowerCase() === projectTitle.toLowerCase()
    );

    if (!project || !project.link) {
      return `Project "${projectTitle}" not found in portfolio. Available projects: ${projects
        .map((p: any) => p.title)
        .join(", ")}`;
    }

    const githubUrl = project.link;
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!match) {
      return `Invalid GitHub URL for project "${projectTitle}": ${githubUrl}`;
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

    return await getGitHubRepo(owner, repo, "README.md");
  } catch (error) {
    console.error("Project README error:", error);
    return `Error getting README for project "${projectTitle}": ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}

async function getGitHubRepo(
  owner: string,
  repo: string,
  path?: string
): Promise<string> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers.Authorization = `token ${token}`;
    }

    if (path) {
      const contentResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers }
      );

      if (contentResponse.ok) {
        const content = await contentResponse.json();
        if (content.type === "file" && content.encoding === "base64") {
          const fileContent = Buffer.from(content.content, "base64").toString(
            "utf-8"
          );
          return `File: ${path}\n\n${fileContent}`;
        } else if (content.type === "dir") {
          const files = Array.isArray(content) ? content : [content];
          const fileList = files
            .map((file: any) => `- ${file.name} (${file.type})`)
            .join("\n");
          return `Directory: ${path}\n\nFiles:\n${fileList}`;
        }
      }
    }

    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers,
      }
    );

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return `Repository ${owner}/${repo} not found. Please check the repository name and owner.`;
      }
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();

    let result = `Repository: ${repoData.full_name}\n`;
    result += `Description: ${repoData.description || "No description"}\n`;
    result += `Stars: ${repoData.stargazers_count}\n`;
    result += `Forks: ${repoData.forks_count}\n`;
    result += `Language: ${repoData.language || "N/A"}\n`;
    result += `Created: ${new Date(
      repoData.created_at
    ).toLocaleDateString()}\n`;
    result += `Updated: ${new Date(
      repoData.updated_at
    ).toLocaleDateString()}\n`;
    result += `URL: ${repoData.html_url}\n\n`;

    if (repoData.homepage) {
      result += `Homepage: ${repoData.homepage}\n`;
    }

    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );

    if (readmeResponse.ok) {
      const readme = await readmeResponse.json();
      if (readme.content) {
        const readmeContent = Buffer.from(readme.content, "base64").toString(
          "utf-8"
        );
        result += `\nREADME:\n${readmeContent}`;
      }
    }

    return result;
  } catch (error) {
    console.error("GitHub API error:", error);
    return `I encountered an error accessing the GitHub repository ${owner}/${repo}. ${
      error instanceof Error
        ? error.message
        : "Please check if the repository exists and is accessible."
    }`;
  }
}

async function searchWeb(query: string): Promise<string> {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(
        query
      )}&format=json&no_html=1&skip_disambig=1`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) {
      return `I attempted to search for "${query}" but encountered an issue. Here's what I know: For the latest information, I recommend checking reliable news sources or search engines directly.`;
    }

    const data = await response.json();

    let results = "";

    if (data.AbstractText) {
      results += data.AbstractText + "\n\n";
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      results += "Related information:\n";
      data.RelatedTopics.slice(0, 3).forEach((topic: any, index: number) => {
        if (topic.Text) {
          results += `${index + 1}. ${topic.Text}\n`;
        }
      });
    }

    if (data.Answer) {
      results = data.Answer + "\n\n" + results;
    }

    return (
      results ||
      `I searched for "${query}" but didn't find specific results. Please try rephrasing your question or check reliable news sources directly.`
    );
  } catch (error) {
    console.error("Search error:", error);
    return `I encountered an error while searching. For the latest information about "${query}", please check reliable news sources or search engines directly.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: ChatRequest = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: [
        {
          functionDeclarations: [
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
              } as any,
            },
          ],
        },
      ],
    });

    const filteredHistory: Message[] = (history || [])
      .filter((msg: Message, index: number) => {
        if (index === 0 && msg.role === "model") return false;
        return true;
      })
      .slice(-7);

    const chat = model.startChat({
      history: filteredHistory,
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const functionResponses = await Promise.all(
        functionCalls.map(async (call: any) => {
          if (call.name === "search_web") {
            const query = call.args?.query || message;
            const searchResults = await searchWeb(query);
            return {
              functionResponse: {
                name: "search_web",
                response: {
                  results: searchResults,
                  query: query,
                },
              },
            };
          }
          if (call.name === "get_github_repo") {
            const owner = call.args?.owner;
            const repo = call.args?.repo;
            const path = call.args?.path;
            if (owner && repo) {
              const repoInfo = await getGitHubRepo(owner, repo, path);
              return {
                functionResponse: {
                  name: "get_github_repo",
                  response: {
                    info: repoInfo,
                    owner: owner,
                    repo: repo,
                    path: path || null,
                  },
                },
              };
            }
          }
          if (call.name === "get_portfolio_data") {
            const dataType = call.args?.dataType;
            if (dataType) {
              const data = await getPortfolioData(dataType);
              return {
                functionResponse: {
                  name: "get_portfolio_data",
                  response: {
                    data: data,
                    dataType: dataType,
                  },
                },
              };
            }
          }
          if (call.name === "get_project_readme") {
            const projectTitle = call.args?.projectTitle;
            if (projectTitle) {
              const readme = await getProjectReadme(projectTitle);
              return {
                functionResponse: {
                  name: "get_project_readme",
                  response: {
                    readme: readme,
                    projectTitle: projectTitle,
                  },
                },
              };
            }
          }
          return null;
        })
      );

      const validResponses = functionResponses.filter((r) => r !== null);

      if (validResponses.length > 0) {
        result = await chat.sendMessage(validResponses);
        response = result.response;
      }
    }

    const text = response.text();

    return NextResponse.json({
      response: text,
      history: await chat.getHistory(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
