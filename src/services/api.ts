const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("admin_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; admin: { id: string; username: string } }>("/login", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
    }),

  // Projects
  getProjects: () => request<any[]>("/projects"),
  getProject: (id: string) => request<any>(`/projects/${id}`),
  createProject: (data: any) =>
    request<any>("/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) =>
    request<any>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    request<any>(`/projects/${id}`, { method: "DELETE" }),

  // Services
  getServices: () => request<any[]>("/services"),
  createService: (data: any) =>
    request<any>("/services", { method: "POST", body: JSON.stringify(data) }),
  updateService: (id: string, data: any) =>
    request<any>(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService: (id: string) =>
    request<any>(`/services/${id}`, { method: "DELETE" }),

  // Timeline
  getTimeline: () => request<any[]>("/timeline"),
  createTimeline: (data: any) =>
    request<any>("/timeline", { method: "POST", body: JSON.stringify(data) }),
  updateTimeline: (id: string, data: any) =>
    request<any>(`/timeline/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTimeline: (id: string) =>
    request<any>(`/timeline/${id}`, { method: "DELETE" }),

  // About
  getAbout: () => request<any>("/about"),
  updateAbout: (data: any) =>
    request<any>("/about", { method: "PUT", body: JSON.stringify(data) }),

  // Contact
  getContact: () => request<any>("/contact"),
  updateContact: (data: any) =>
    request<any>("/contact", { method: "PUT", body: JSON.stringify(data) }),

  // Contact Messages (admin)
  getMessages: () => request<any[]>("/contact/messages"),
  markMessageRead: (id: string) =>
    request<any>(`/contact/messages/${id}/read`, { method: "PUT" }),
  deleteMessage: (id: string) =>
    request<any>(`/contact/messages/${id}`, { method: "DELETE" }),
};
