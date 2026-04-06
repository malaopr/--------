const API_BASE = '/api';



export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  first_name: string;
  last_name: string;
  grade?: string;
  subject?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  creator_id: string;
  members_count: number;
  created_at: string;
}

export interface Post {
  id: string;
  group_id: string;
  group_name: string;
  author_id: string;
  author_name: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Event {
  id: string;
  author_id: string;
  title: string;
  content: string;
  event_date: string | null;
  location?: string;
  image_url?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}



export function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export function setToken(token: string) {
  localStorage.setItem('access_token', token);
}

export function clearToken() {
  localStorage.removeItem('access_token');
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem('current_user');
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: User) {
  localStorage.setItem('current_user', JSON.stringify(user));
}

export function clearAuth() {
  clearToken();
  localStorage.removeItem('current_user');
}



async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body.detail || `Ошибка ${res.status}`;
    throw new Error(msg);
  }

  return res.json();
}



export const api = {
  
  async login(email: string, password: string) {
    const data = await request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    setCurrentUser(data.user);
    return data;
  },

  async register(body: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
  }) {
    return request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async me() {
    return request<User>('/auth/me');
  },

  
  async getFeed(page = 1, limit = 6, search = '') {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return request<PaginatedResponse<Post>>(`/posts/feed?${params}`);
  },

  async createPost(group_id: string, title: string, content: string) {
    return request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify({ group_id, title, content }),
    });
  },

  async likePost(postId: string) {
    return request<{ likes_count: number }>(`/posts/${postId}/like`, { method: 'POST' });
  },

  async getComments(postId: string) {
    return request<Comment[]>(`/posts/${postId}/comments`);
  },

  async createComment(postId: string, content: string) {
    return request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  
  async getEvents(page = 1, limit = 6, search = '') {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return request<PaginatedResponse<Event>>(`/events?${params}`);
  },

  async createEvent(body: { title: string; content: string; event_date?: string; location?: string; image_url?: string }) {
    return request<Event>('/events', { method: 'POST', body: JSON.stringify(body) });
  },

  async deleteEvent(id: string) {
    return request<{ message: string }>(`/events/${id}`, { method: 'DELETE' });
  },

  
  async getGroups(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return request<PaginatedResponse<Group>>(`/groups?${params}`);
  },

  async getGroup(id: string) {
    return request<Group>(`/groups/${id}`);
  },

  async createGroup(name: string, description = '') {
    return request<Group>('/groups', { method: 'POST', body: JSON.stringify({ name, description }) });
  },

  async joinGroup(id: string) {
    return request<{ message: string }>(`/groups/${id}/join`, { method: 'POST' });
  },

  async leaveGroup(id: string) {
    return request<{ message: string }>(`/groups/${id}/leave`, { method: 'POST' });
  },

  async deleteGroup(id: string) {
    return request<{ message: string }>(`/groups/${id}`, { method: 'DELETE' });
  },

  
  async getUsers(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return request<PaginatedResponse<User>>(`/users?${params}`);
  },
};
