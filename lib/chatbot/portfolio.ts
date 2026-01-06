import { readFile } from "fs/promises";
import { join } from "path";
import type { Project } from "./types";
import { getGitHubRepo } from "./github";

const DATA_DIR = join(process.cwd(), "app", "data");

export async function getPortfolioData(dataType: string): Promise<string> {
  try {
    let filePath: string;

    switch (dataType.toLowerCase()) {
      case "projects":
        filePath = join(DATA_DIR, "projects.json");
        break;
      case "skills":
        filePath = join(DATA_DIR, "skills.json");
        break;
      case "certifications":
        filePath = join(DATA_DIR, "certifications.json");
        break;
      case "services":
        filePath = join(DATA_DIR, "services.json");
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

export async function getProjectReadme(projectTitle: string): Promise<string> {
  try {
    const projectsPath = join(DATA_DIR, "projects.json");
    const projectsContent = await readFile(projectsPath, "utf-8");
    const projects: Project[] = JSON.parse(projectsContent);

    const project = projects.find(
      (p: Project) => p.title.toLowerCase() === projectTitle.toLowerCase()
    );

    if (!project || !project.link) {
      return `Project "${projectTitle}" not found in portfolio. Available projects: ${projects
        .map((p: Project) => p.title)
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
