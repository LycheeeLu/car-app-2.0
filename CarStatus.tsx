import { Battery, Navigation2, Shield, Bot, Car, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CarStatusProps {
  battery: number;
  obstacleDistance: number | null;
  speed: number;
}

interface CarLocation {
  lat: string;
  lng: string;
  timestamp: Date;
}

export const CarStatus = ({ battery, obstacleDistance, speed }: CarStatusProps) => {
  const [carLocation, setCarLocation] = useState<CarLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCarPosition = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch('your-car-api-endpoint/location');
      const data = await response.json();
      
      // Mock data - replace with actual API response
      const carPosition: CarLocation = {
        lat: "37.7749",
        lng: "-122.4194",
        timestamp: new Date()
      };
      
      setCarLocation(carPosition);
      toast.success("Car position loaded");
    } catch (error) {
      toast.error("Failed to get car position");
      console.error("Error fetching car position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-car-success";
    if (level > 20) return "text-car-warning";
    return "text-car-error";
  };

  const getObstacleColor = (distance: number | null) => {
    if (distance === null) return "text-car-neutral";
    if (distance > 100) return "text-car-success";
    if (distance > 50) return "text-car-warning";
    return "text-car-error";
  };

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Bot className="w-5 h-5 text-purple-500" />
        Vehicle Status
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2">
          <Battery className={`w-6 h-6 ${getBatteryColor(battery)}`} />
          <span className="text-sm font-medium">{battery}%</span>
          <span className="text-xs text-muted-foreground">Battery</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Shield className={`w-6 h-6 ${getObstacleColor(obstacleDistance)}`} />
          <span className="text-sm font-medium">
            {obstacleDistance ? `${obstacleDistance}cm` : 'N/A'}
          </span>
          <span className="text-xs text-muted-foreground">Obstacle</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Navigation2 className="w-6 h-6 text-purple-500" />
          <span className="text-sm font-medium">{speed} km/h</span>
          <span className="text-xs text-muted-foreground">Speed</span>
        </div>
      </div>

      {/* Car Location Display Box */}
      <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium">Car's Current Location</h3>
          </div>
          <button
            onClick={getCarPosition}
            disabled={isLoading}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Latitude: </span>
            <span className="font-medium">{carLocation?.lat || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Longitude: </span>
            <span className="font-medium">{carLocation?.lng || 'N/A'}</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Last Updated: {carLocation ? carLocation.timestamp.toLocaleString() : 'Never'}
        </div>
      </div>
    </div>
  );
};