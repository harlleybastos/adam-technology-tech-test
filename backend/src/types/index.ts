export type Role = 'painter' | 'customer';

export interface UserResponse {
  id: string;
  email: string;
  role: Role;
}

export interface AvailabilitySlotResponse {
  id: string;
  painterId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}


