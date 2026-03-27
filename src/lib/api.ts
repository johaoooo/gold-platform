const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api'
  : process.env.NEXT_PUBLIC_API_URL || 'https://backend-gold-iubc.onrender.com/api';

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.detail || 'Identifiants incorrects');
  return data;
}

export async function registerUser(payload: any) {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

export function saveTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  document.cookie = 'access_token=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) { logout(); return null; }
    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
  } catch {
    logout();
    return null;
  }
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();
  const makeRequest = (t: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...options.headers,
      },
    });

  let res = await makeRequest(token);
  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) throw new Error('Session expirée');
    res = await makeRequest(token);
  }
  return res;
}

export async function getProjects(filters?: any) {
  const params = new URLSearchParams();
  if (filters?.secteur) params.append('secteur', filters.secteur);
  if (filters?.localisation) params.append('localisation', filters.localisation);
  if (filters?.montant_min) params.append('montant_min', String(filters.montant_min));
  if (filters?.montant_max) params.append('montant_max', String(filters.montant_max));

  const res = await fetch(`${API_URL}/projects/?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Erreur lors du chargement des projets');
  return data;
}

export async function getProjectById(id: number) {
  const res = await fetch(`${API_URL}/projects/${id}/`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Projet introuvable');
  return data;
}

export async function createProject(payload: any) {
  const res = await authFetch(`${API_URL}/projects/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

export async function investInProject(payload: { projet_id: number; montant: number; message?: string }) {
  const res = await authFetch(`${API_URL}/investments/create/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

export async function getMyInvestments() {
  const res = await authFetch(`${API_URL}/investments/my/`);
  const data = await res.json();
  if (!res.ok) throw new Error('Erreur lors du chargement des investissements');
  return data;
}

export async function getProfile() {
  const res = await authFetch(`${API_URL}/auth/profile/`);
  const data = await res.json();
  if (!res.ok) throw new Error('Erreur lors du chargement du profil');
  return data;
}
