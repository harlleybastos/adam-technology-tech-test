import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, Mail, Star } from "lucide-react";
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
    customerId: "customer-1",
    painterId: "painter-2",
    startTime: "2025-05-25T10:00:00Z",
    endTime: "2025-05-25T16:00:00Z",
    status: "confirmed",
    notes: "Kitchen cabinet painting and touch-ups",
    painter: {
      id: "painter-2",
      name: "Mike Brusher",
      email: "mike@painter.com",
      experience: 3,
      rating: 4.6,
      specialties: ["Interior", "Cabinet"],
    },
    customer: {
      id: "customer-1",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "+1 (555) 123-4567",
    },
  },
];

export const CustomerBookings = () => {
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

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  if (mockBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No bookings yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first booking request to get started.
        </p>
      </div>
    );
  }

  const upcomingBookings = mockBookings.filter(booking => isUpcoming(booking.startTime));
  const pastBookings = mockBookings.filter(booking => !isUpcoming(booking.startTime));

  return (
    <div className="space-y-6">
      {upcomingBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Upcoming Appointments</span>
          </h3>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Past Appointments</span>
          </h3>
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BookingCard = ({ booking }: { booking: Booking }) => {
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

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {booking.painter.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-lg">{booking.painter.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm font-medium">{booking.painter.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  • {booking.painter.experience} years exp
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                {booking.painter.specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
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
          <div className="bg-muted rounded-lg p-3 mb-4">
            <p className="text-sm">
              <strong>Job Details:</strong> {booking.notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{booking.painter.email}</span>
            </div>
          </div>
          
          {isUpcoming(booking.startTime) && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="secondary" size="sm">
                Contact Painter
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};