import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, Plus } from "lucide-react";
import { UserRole } from "@/types";
import { AddAvailabilityForm } from "./AddAvailabilityForm";
import { AvailabilityList } from "./AvailabilityList";
import { PainterBookings } from "./PainterBookings";

interface PainterDashboardProps {
  onRoleChange: (role: UserRole | null) => void;
}

export const PainterDashboard = ({ onRoleChange }: PainterDashboardProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  
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
                <h1 className="text-2xl font-bold text-foreground">Painter Dashboard</h1>
                <p className="text-muted-foreground">Manage your availability and bookings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">JP</span>
              </div>
              <span className="text-sm font-medium">John Painter</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="availability" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="availability" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Availability</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Bookings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Availability</CardTitle>
                    <CardDescription>
                      Manage your available time slots for painting services
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Availability</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            <CardContent>
              {showAddForm ? (
                <AddAvailabilityForm 
                  onClose={() => setShowAddForm(false)} 
                  onSuccess={() => setRefresh(prev => !prev)}
                />
              ) : (
                <AvailabilityList refresh={refresh} />
              )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>
                  View and manage your assigned painting jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PainterBookings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};