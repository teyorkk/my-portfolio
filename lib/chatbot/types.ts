export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface ChatRequest {
  message: string;
  history?: Message[];
}

export interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

export interface GitHubContent {
  type: string;
  encoding?: string;
  content?: string;
  name?: string;
}

export interface GitHubRepo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  homepage: string | null;
}

export interface FunctionCall {
  name: string;
  args?: {
    query?: string;
    owner?: string;
    repo?: string;
    path?: string;
    dataType?: string;
    projectTitle?: string;
  };
}

export interface DuckDuckGoTopic {
  Text?: string;
}

export interface DuckDuckGoResponse {
  AbstractText?: string;
  RelatedTopics?: DuckDuckGoTopic[];
  Answer?: string;
}

