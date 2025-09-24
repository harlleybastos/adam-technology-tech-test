import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Booking } from "@/types";

// Mock data - in real app this would come from API/database
const mockBookings: Booking[] = [
  {
    id: "booking-1",
    customerId: "customer-1",
    painterId: "painter-1",
    startTime: "2025-05-19T08:00:00Z",
    endTime: "2025-05-19T12:00:00Z",
    status: "confirmed",
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
  {
    id: "booking-2",
    customerId: "customer-2",
    painterId: "painter-1",
    startTime: "2025-05-22T13:00:00Z",
    endTime: "2025-05-22T17:00:00Z",
    status: "confirmed",
    notes: "Kitchen cabinet painting",
    painter: {
      id: "painter-1",
      name: "John Painter",
      email: "john@painter.com",
      experience: 5,
      rating: 4.8,
      specialties: ["Interior", "Exterior"],
    },
    customer: {
      id: "customer-2",
      name: "Mike Davis",
      email: "mike@email.com",
      phone: "+1 (555) 987-6543",
    },
  },
];

export const PainterBookings = () => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${hours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (mockBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No bookings yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Your assigned jobs will appear here once customers book your available slots.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mockBookings.map((booking) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{booking.customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
                  {booking.customer.phone && (
                    <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(booking.startTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {formatDuration(booking.startTime, booking.endTime)}
                  </Badge>
                </span>
              </div>
            </div>

            {booking.notes && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm">
                  <strong>Job Details:</strong> {booking.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};