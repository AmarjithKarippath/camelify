export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const LANDING_URL =
  import.meta.env.VITE_LANDING_URL ?? "http://localhost:3000";

async function request(path: string, init: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });
}

// ----- Auth -----

export type Me = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: string;
  is_admin: boolean;
};

export async function getMe(): Promise<Me | null> {
  const res = await request("/v1/auth/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to load session (${res.status})`);
  return res.json();
}

export async function logout(): Promise<void> {
  await request("/v1/auth/logout", { method: "POST" });
}

// ----- Profile -----

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  theme_id: string;
  dob: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileUpsert = {
  username: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  theme_id?: string;
  dob?: string | null;
  category?: string | null;
};

export async function getMyProfile(): Promise<Profile | null> {
  const res = await request("/v1/profile");
  if (res.status === 404) return null;
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
  return res.json();
}

export async function upsertProfile(payload: ProfileUpsert): Promise<Profile> {
  const res = await request("/v1/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not save profile.");
  }
  return res.json();
}

export type UsernameAvailability = {
  username: string;
  available: boolean;
  reason: string | null;
};

export async function uploadAvatar(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/v1/uploads/avatar`, {
    method: "POST",
    credentials: "include",
    body: form,
    // NOTE: do not set Content-Type — the browser sets it with the multipart boundary.
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not upload photo.");
  }
  return res.json();
}

export async function checkUsername(username: string): Promise<UsernameAvailability> {
  const res = await request(
    `/v1/profile/username/${encodeURIComponent(username)}/availability`,
  );
  if (!res.ok) throw new Error(`Username check failed (${res.status})`);
  return res.json();
}

// ----- Links -----

export type LinkKind = "featured" | "link" | "social";

export type Link = {
  id: string;
  kind: LinkKind;
  platform: string;
  title: string;
  url: string;
  emoji: string | null;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type LinkCreate = {
  title: string;
  url: string;
  kind?: LinkKind;
  platform?: string;
  emoji?: string | null;
  is_visible?: boolean;
};

export async function getMyLinks(): Promise<Link[]> {
  const res = await request("/v1/links");
  if (!res.ok) throw new Error(`Failed to load links (${res.status})`);
  return res.json();
}

export async function deleteLink(id: string): Promise<void> {
  const res = await request(`/v1/links/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not delete link.");
  }
}

export async function createLink(payload: LinkCreate): Promise<Link> {
  const res = await request("/v1/links", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not save link.");
  }
  return res.json();
}

export async function createLinksBulk(payload: LinkCreate[]): Promise<Link[]> {
  const res = await request("/v1/links/bulk", {
    method: "POST",
    body: JSON.stringify({ items: payload }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not save links.");
  }
  return res.json();
}

// ----- Import -----

export type LinktreeImportResult = {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  links: Array<{ title: string; url: string }>;
  socials: Array<{ title: string; url: string }>;
  skipped_groups: number;
  total_imported: number;
};

export async function importFromLinktree(url: string): Promise<LinktreeImportResult> {
  const res = await request("/v1/import/linktree", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not import from Linktree.");
  }
  return res.json();
}

// ----- Feedback -----

export type FeedbackKind = "bug" | "feature" | "other";
export type FeedbackStatus = "new" | "in_review" | "closed";

export async function submitFeedback(payload: {
  kind: FeedbackKind;
  message: string;
}): Promise<void> {
  const res = await request("/v1/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not send feedback.");
  }
}

// ----- Admin -----

export type UsersStats = {
  days: number;
  total_all_time: number;
  total_in_period: number;
  new_today: number;
  new_this_week: number;
  data: Array<{ date: string; new_users: number }>;
};

export async function getUsersStats(days: number): Promise<UsersStats> {
  const res = await request(`/v1/admin/stats/users?days=${days}`);
  if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
  return res.json();
}

export type RecentUser = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
};

export async function getRecentUsers(limit = 10): Promise<RecentUser[]> {
  const res = await request(`/v1/admin/users/recent?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to load recent users (${res.status})`);
  return res.json();
}

export type AdminFeedbackItem = {
  id: string;
  kind: FeedbackKind;
  message: string;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
};

export type AdminFeedbackResponse = {
  counts: { new: number; in_review: number; closed: number; total: number };
  items: AdminFeedbackItem[];
};

export async function getAdminFeedback(
  statusFilter?: FeedbackStatus,
): Promise<AdminFeedbackResponse> {
  const q = statusFilter ? `?status=${statusFilter}` : "";
  const res = await request(`/v1/admin/feedback${q}`);
  if (!res.ok) throw new Error(`Failed to load feedback (${res.status})`);
  return res.json();
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
): Promise<AdminFeedbackItem> {
  const res = await request(`/v1/admin/feedback/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data) ?? "Could not update.");
  }
  return res.json();
}

// ----- Helpers -----

function extractError(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const detail = (data as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "object" && first !== null && "msg" in first) {
      return String((first as { msg: unknown }).msg);
    }
  }
  return null;
}
