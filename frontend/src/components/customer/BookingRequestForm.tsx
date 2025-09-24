import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Painter } from "@/types";
import { bookingAPI } from "@/services/api";

interface BookingRequestFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// Mock painter assignment logic
const mockPainters: Painter[] = [
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
];

export const BookingRequestForm = ({ onClose, onSuccess }: BookingRequestFormProps) => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedPainter, setAssignedPainter] = useState<Painter | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate inputs
    if (!startDate || !startTime || !endDate || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // API call with painter assignment logic
    try {
      const startDateTime = `${startDate}T${startTime}:00.000Z`;
      const endDateTime = `${endDate}T${endTime}:00.000Z`;

      const response = await bookingAPI.request({
        startTime: startDateTime,
        endTime: endDateTime,
        notes,
      });

      if (response.success && response.data) {
        // Booking successful
        setAssignedPainter(response.data.painter);
        toast({
          title: "Booking Confirmed!",
          description: `Your painting service has been assigned to ${response.data.painter.name}`,
        });
      } else {
        // No availability - show alternatives if provided
        setAlternativeSlots(response.alternatives || [
          "Tomorrow at 2:00 PM - 6:00 PM",
          "Day after tomorrow at 10:00 AM - 2:00 PM", 
          "This weekend at 9:00 AM - 1:00 PM",
        ]);
        toast({
          title: "No Available Painters",
          description: response.error || "We found some alternative time slots for you.",
          variant: "destructive",
        });
      }
      
      setShowResult(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create booking request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResult) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {assignedPainter ? (
              <>
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Booking Confirmed!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-warning" />
                <span>Alternative Options Available</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {assignedPainter ? (
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <h3 className="font-medium text-success mb-2">Your Painter Assignment</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {assignedPainter.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{assignedPainter.name}</p>
                    <p className="text-sm text-muted-foreground">{assignedPainter.experience} years experience</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">★ {assignedPainter.rating}</Badge>
                      {assignedPainter.specialties.map(specialty => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Booking Details</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Date:</strong> {new Date(`${startDate}T${startTime}`).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Time:</strong> {startTime} - {endTime}
                </p>
                {notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Notes:</strong> {notes}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <h3 className="font-medium text-warning mb-2">No Painters Available</h3>
                <p className="text-sm text-muted-foreground">
                  Unfortunately, no painters are available for your requested time slot.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-3">🏅 Recommended Alternative Slots</h4>
                <div className="space-y-2">
                  {alternativeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                      <span className="text-sm">{slot}</span>
                      <Button size="sm" variant="outline">Select</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={onClose}>
              {assignedPainter ? "Close" : "Try Different Time"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Request Painting Service</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Start Time</span>
              </h3>
              <div className="space-y-2">
                <Label htmlFor="start-date">Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>End Time</span>
              </h3>
              <div className="space-y-2">
                <Label htmlFor="end-date">Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Job Description (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Describe what you need painted (e.g., living room walls, kitchen cabinets, exterior house)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">🎨 How It Works</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• We'll automatically find the best available painter for your time slot</li>
              <li>• Our smart system prioritizes painters by rating and experience</li>
              <li>• If no one is available, we'll suggest alternative times</li>
              <li>• You'll get instant confirmation with painter details</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="secondary">
              {isSubmitting ? "Finding Painter..." : "Request Booking"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};