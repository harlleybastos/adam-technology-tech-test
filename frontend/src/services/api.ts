import { Booking, TimeSlot, Painter, BookingRequest } from "@/types";

const API_BASE_URL = "http://localhost:3001";

// Auth token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  demoLogin: async (role: 'painter' | 'customer') => {
    const response = await apiRequest('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  register: async (userData: {
    email: string;
    password: string;
    role: 'painter' | 'customer';
    name: string;
    phone?: string;
  }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  logout: () => {
    setAuthToken(null);
  },
};

// Painter Availability API
export const availabilityAPI = {
  create: async (availability: { startTime: string; endTime: string }): Promise<TimeSlot> => {
    const response = await apiRequest('/availability', {
      method: 'POST',
      body: JSON.stringify(availability),
    });
    return response.data;
  },

  getMy: async (): Promise<TimeSlot[]> => {
    const response = await apiRequest('/availability/me');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/availability/${id}`, {
      method: 'DELETE',
    });
  },
};

// Customer Booking API
export const bookingAPI = {
  request: async (bookingRequest: BookingRequest) => {
    const response = await apiRequest('/booking-request', {
      method: 'POST',
      body: JSON.stringify(bookingRequest),
    });
    return response;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await apiRequest('/bookings/me');
    return response.data;
  },

  cancel: async (bookingId: string): Promise<void> => {
    await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  },

  reschedule: async (bookingId: string, newTimes: { startTime: string; endTime: string }) => {
    const response = await apiRequest(`/bookings/${bookingId}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(newTimes),
    });
    return response.data;
  },
};

// Painter Bookings API
export const painterAPI = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await apiRequest('/painter/bookings');
    return response.data;
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    const response = await apiRequest(`/painter/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  getProfile: async (): Promise<Painter> => {
    const response = await apiRequest('/painter/profile');
    return response.data;
  },

  updateProfile: async (profileData: Partial<Painter>) => {
    const response = await apiRequest('/painter/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },
};

// Error handling helper
export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Mock data fallback (remove when backend is ready)
export const mockData = {
  painters: [
    {
      id: "painter-1",
      name: "John Painter",
      email: "john@painter.com",
      experience: 5,
      rating: 4.8,
      specialties: ["Interior", "Exterior"],
    },
    {
      id: "painter-2",
      name: "Mike Brusher",
      email: "mike@painter.com",
      experience: 3,
      rating: 4.6,
      specialties: ["Interior", "Cabinet"],
    },
  ],
  
  availability: [
    {
      id: "1",
      painterId: "painter-1",
      startTime: "2025-05-18T10:00:00Z",
      endTime: "2025-05-18T14:00:00Z",
      isBooked: false,
    },
    {
      id: "2",
      painterId: "painter-1",
      startTime: "2025-05-19T08:00:00Z",
      endTime: "2025-05-19T12:00:00Z",
      isBooked: true,
    },
  ],
  
  bookings: [
    {
      id: "booking-1",
      customerId: "customer-1",
      painterId: "painter-1",
      startTime: "2025-05-19T08:00:00Z",
      endTime: "2025-05-19T12:00:00Z",
      status: "confirmed" as const,
      notes: "Living room and bedroom painting",
      painter: {
        id: "painter-1",
        name: "John Painter",
        email: "john@painter.com",
        experience: 5,
        rating: 4.8,
        specialties: ["Interior", "Exterior"],
      },
      customer: {
        id: "customer-1",
        name: "Sarah Johnson",
        email: "sarah@email.com",
        phone: "+1 (555) 123-4567",
      },
    },
  ],
};