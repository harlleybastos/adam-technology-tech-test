import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, User } from "lucide-react";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

export const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const { demoLogin } = useAuth();

  const handleSelect = async (role: UserRole) => {
    await demoLogin(role);
    onRoleSelect(role);
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Adam Painter Booking
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional painting services scheduling platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelect('painter')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm a Painter</CardTitle>
              <CardDescription className="text-lg">
                Manage your availability and view assigned bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Set your available time slots</li>
                <li>• View and manage bookings</li>
                <li>• Track your schedule</li>
                <li>• Update your availability</li>
              </ul>
              <Button className="w-full" size="lg">
                Continue as Painter
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelect('customer')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">I'm a Customer</CardTitle>
              <CardDescription className="text-lg">
                Book painting services for your preferred time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Request painting services</li>
                <li>• Choose your preferred time slot</li>
                <li>• Get automatically matched with painters</li>
                <li>• View your upcoming appointments</li>
              </ul>
              <Button variant="secondary" className="w-full" size="lg">
                Continue as Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};