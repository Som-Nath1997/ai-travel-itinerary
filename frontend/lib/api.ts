import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Location {
  name: string;
  lat?: number | null;  // Optional - may be null if place not found
  lng?: number | null;  // Optional - may be null if place not found
  rating?: number;
  type?: string;
  place_id?: string;
}

export interface DayPlan {
  day_number: number;
  description: string;
  locations: Location[];
}

export interface Itinerary {
  id: string;
  user_id: string;
  destination: string;
  duration: number;
  start_date?: string;
  end_date?: string;
  budget?: string;
  preferences?: string;
  day_plans: DayPlan[];
  created_at: string;
  updated_at: string;
}

export interface ItineraryListItem {
  id: string;
  destination: string;
  duration: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ItineraryCreateData {
  destination: string;
  duration: number;
  start_date?: string;
  end_date?: string;
  budget?: string;
  preferences?: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/v1/users/me');
    return response.data;
  },
};

export const itineraryApi = {
  generate: async (data: ItineraryCreateData): Promise<Itinerary> => {
    const response = await api.post<Itinerary>('/api/v1/itineraries/generate', data);
    return response.data;
  },

  getById: async (id: string): Promise<Itinerary> => {
    const response = await api.get<Itinerary>(`/api/v1/itineraries/${id}`);
    return response.data;
  },

  list: async (): Promise<ItineraryListItem[]> => {
    const response = await api.get<ItineraryListItem[]>('/api/v1/itineraries');
    return response.data;
  },
  update: async (id: string, data: ItineraryUpdateData): Promise<Itinerary> => {
    const response = await api.put<Itinerary>(`/api/v1/itineraries/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/itineraries/${id}`);
  },
};

export interface ItineraryUpdateData {
  destination?: string;
  start_date?: string;
  end_date?: string;
  budget?: string;
  preferences?: string;
}

