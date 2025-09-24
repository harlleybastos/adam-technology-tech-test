export interface Painter {
  id: string;
  name: string;
  email: string;
  experience: number;
  rating: number;
  specialties: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface TimeSlot {
  id: string;
  painterId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  painterId: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  painter: Painter;
  customer: Customer;
}

export interface BookingRequest {
  startTime: string;
  endTime: string;
  notes?: string;
}

export type UserRole = 'painter' | 'customer';