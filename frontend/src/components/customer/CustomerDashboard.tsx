import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Plus, User } from "lucide-react";
import { UserRole } from "@/types";
import { BookingRequestForm } from "./BookingRequestForm";
import { CustomerBookings } from "./CustomerBookings";

interface CustomerDashboardProps {
  onRoleChange: (role: UserRole | null) => void;
}

export const CustomerDashboard = ({ onRoleChange }: CustomerDashboardProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRoleChange(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Customer Dashboard</h1>
                <p className="text-muted-foreground">Book painting services and manage your appointments</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-secondary-foreground">SJ</span>
              </div>
              <span className="text-sm font-medium">Sarah Johnson</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="book" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="book" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Book Service</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>My Bookings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Request Painting Service</CardTitle>
                    <CardDescription>
                      Choose your preferred time slot and we'll automatically assign the best available painter
                    </CardDescription>
                  </div>
                  {!showBookingForm && (
                    <Button
                      onClick={() => setShowBookingForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Request</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showBookingForm ? (
                  <BookingRequestForm onClose={() => setShowBookingForm(false)} />
                ) : (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Ready to book your painting service?</p>
                    <Button onClick={() => setShowBookingForm(true)}>
                      Create Booking Request
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>
                  View and manage your upcoming painting appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerBookings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};