import { useState, useRef, useEffect } from "react";
import { MapPin, Car } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Coordinate {
  lat: number;
  lng: number;
}

interface WaypointMapProps {
  onAddWaypoint: (coordinate: Coordinate) => void;
}

export const WaypointMap = ({ onAddWaypoint }: WaypointMapProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [carPosition, setCarPosition] = useState<Coordinate | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified mapping)
    const lat = ((rect.height - y) / rect.height) * 90;
    const lng = ((x / rect.width) * 360) - 180;

    const newPoint = { lat, lng };
    setPoints(prev => [...prev, newPoint]);
    onAddWaypoint(newPoint);
    toast.success("Waypoint added at coordinates: " + lat.toFixed(6) + ", " + lng.toFixed(6));
  };

  // Convert lat/lng to pixel coordinates for display
  const getPixelCoordinates = (coord: Coordinate) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    const rect = mapRef.current.getBoundingClientRect();
    
    const x = ((coord.lng + 180) / 360) * rect.width;
    const y = rect.height - ((coord.lat / 90) * rect.height);
    
    return { x, y };
  };

  // Add function to handle car movement
  const startCarMovement = async () => {
    if (points.length < 2 || isMoving) return;
    
    setIsMoving(true);
    setCarPosition(points[0]); // Start from first waypoint

    // Move through each waypoint
    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      
      // Simulate movement with small steps
      const steps = 50;
      for (let step = 0; step <= steps; step++) {
        const progress = step / steps;
        const newPosition = {
          lat: start.lat + (end.lat - start.lat) * progress,
          lng: start.lng + (end.lng - start.lng) * progress
        };
        setCarPosition(newPosition);
        // Wait for a small delay to create animation effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    setIsMoving(false);
    toast.success("Route completed!");
  };

  const handleClearAll = async () => {
    setPoints([]);
    try {
      // Send 'c' command to Arduino
      await fetch('http://localhost:3001/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: 'c' }),
      });
      toast.success("Cleared all waypoints and sent clear command to car");
    } catch (error) {
      toast.error("Failed to send clear command to car");
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Visual Waypoint Map</h2>
      </div>

      <div
        ref={mapRef}
        className="relative w-full h-[300px] bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-crosshair overflow-hidden"
        onClick={handleClick}
      >
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700/50" />
          ))}
        </div>
        
        {/* Draw connecting lines between points */}
        <svg className="absolute inset-0 pointer-events-none">
          {points.map((point, index) => {
            if (index === 0) return null;
            const prevPoint = points[index - 1];
            const start = getPixelCoordinates(prevPoint);
            const end = getPixelCoordinates(point);
            
            return (
              <line
                key={`line-${index}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="4"
                className="animate-fade-in"
              />
            );
          })}
        </svg>

        {/* Draw points */}
        {points.map((point, index) => {
          const { x, y } = getPixelCoordinates(point);
          return (
            <div
              key={`point-${index}`}
              className="absolute w-3 h-3 rounded-full bg-primary animate-fade-in"
              style={{
                left: `${x - 6}px`,
                top: `${y - 6}px`,
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                {index + 1}
              </div>
            </div>
          );
        })}

        <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6 opacity-25" />

        {/* Add car icon */}
        {carPosition && (
          <div
            className="absolute transition-all duration-50 ease-linear"
            style={{
              left: `${getPixelCoordinates(carPosition).x - 12}px`,
              top: `${getPixelCoordinates(carPosition).y - 12}px`,
            }}
          >
            <Car className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Click anywhere on the map to add waypoints.
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={handleClearAll} 
            variant="destructive"
            disabled={isMoving}
          >
            Clear All
          </Button>
          <Button 
            onClick={startCarMovement}
            disabled={points.length < 2 || isMoving}
          >
            {isMoving ? "Moving..." : "Start Movement"}
          </Button>
        </div>
      </div>
    </div>
  );
};