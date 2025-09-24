import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { TimeSlot } from "@/types";
import { availabilityAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AvailabilityListProps {
  refresh: boolean;
}

export const AvailabilityList = ({ refresh }: AvailabilityListProps) => {
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      const data = await availabilityAPI.getMy();
      setAvailability(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch availability",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      await availabilityAPI.delete(id);
      toast({
        title: "Availability Deleted",
        description: "Time slot has been removed",
      });
      fetchAvailability(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete availability",
        variant: "destructive",
      });
    }
  };
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
    const totalMinutes = Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
        <p className="text-muted-foreground">Loading availability...</p>
      </div>
    );
  }

  if (availability.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No availability slots added yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Click "Add Availability" to set your working hours.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {availability.map((slot) => (
        <div
          key={slot.id}
          className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium">
                  {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {formatDuration(slot.startTime, slot.endTime)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(slot.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant={slot.isBooked ? "secondary" : "outline"}>
              {slot.isBooked ? "Booked" : "Available"}
            </Badge>
            {!slot.isBooked && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(slot.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};