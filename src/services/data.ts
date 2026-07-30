const API_BASE = "/api";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
  order: number;
  repo_url?: string;
  demo_url?: string;
  tech_stack?: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  order: number;
}

export interface TimelineData {
  id: string;
  year: string;
  title_en: string;
  title_id: string;
  event_en: string;
  event_id: string;
  order: number;
}

export interface AboutData {
  id: string;
  content_en: string;
  content_id: string;
}

export interface ContactData {
  id: string;
  email: string;
  phone: string;
  address: string;
  social_links: Record<string, string>;
}

export async function getProjects(): Promise<ProjectData[]> {
  return fetchJSON<ProjectData[]>("/projects");
}

export async function getServices(): Promise<ServiceData[]> {
  return fetchJSON<ServiceData[]>("/services");
}

export async function getTimeline(): Promise<TimelineData[]> {
  return fetchJSON<TimelineData[]>("/timeline");
}

export async function getAbout(): Promise<AboutData> {
  return fetchJSON<AboutData>("/about");
}

export async function getContact(): Promise<ContactData> {
  return fetchJSON<ContactData>("/contact");
}
