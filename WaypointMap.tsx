import { useState, useRef, useCallback } from "react";
import { Car, History, Trash, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

interface Coordinate {
  lat: number;
  lng: number;
}

interface WaypointMapProps {
  onAddWaypoint: (coordinate: Coordinate) => void;
}

const defaultCenter = {
  lat: 61.05871,
  lng: 28.18871 //center set to lappenranta city center
};

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export const WaypointMap = ({ onAddWaypoint }: WaypointMapProps) => {
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [carPosition, setCarPosition] = useState<Coordinate | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const newPoint = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    
    setPoints(prev => [...prev, newPoint]);
    onAddWaypoint(newPoint);
    toast.success(`Waypoint added at coordinates: ${newPoint.lat.toFixed(6)}, ${newPoint.lng.toFixed(6)}`);
  }, [onAddWaypoint]);

  const handleClearPreviousWaypoint = async () => {
    if (points.length > 0) {
      setPoints(prev => prev.slice(0, -1));
      try {
        await fetch('http://localhost:3001/command', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command: 'p' }),
        });
        toast.info("Previous waypoint removed and sent command to car");
      } catch (error) {
        toast.error("Failed to send clear previous command to car");
      }
    } else {
      toast.error("No waypoints to remove");
    }
  };

  const handleClearAll = async () => {
    setPoints([]);
    try {
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

  const startCarMovement = async () => {
    if (points.length < 2 || isMoving) return;
    
    setIsMoving(true);
    setCarPosition(points[0]);

    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      
      const steps = 50;
      for (let step = 0; step <= steps; step++) {
        const progress = step / steps;
        const newPosition = {
          lat: start.lat + (end.lat - start.lat) * progress,
          lng: start.lng + (end.lng - start.lng) * progress
        };
        setCarPosition(newPosition);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    setIsMoving(false);
    toast.success("Route completed!");
  };

  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map?.panTo(pos);
          map?.setZoom(15);
        },
        () => {
          toast.error("Error: The Geolocation service failed.");
        }
      );
    } else {
      toast.error("Error: Your browser doesn't support geolocation.");
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Visual Waypoint Map</h2>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={14}
        onClick={onMapClick}
        options={options}
        onLoad={map => setMap(map)}
      >
        {/* Waypoint markers */}
        {points.map((point, index) => (
          <Marker
            key={`point-${index}`}
            position={point}
            label={(index + 1).toString()}
          />
        ))}

        {/* Connecting lines between waypoints */}
        <Polyline
          path={points}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }}
        />

        {/* Car marker */}
        {carPosition && (
          <Marker
            position={carPosition}
            icon={{
              path: "M8 12L8 8C8 4.68629 10.6863 2 14 2V2C17.3137 2 20 4.68629 20 8L20 12",
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 1,
              scale: 2,
            }}
          />
        )}
      </GoogleMap>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            onClick={handleClearPreviousWaypoint}
            disabled={isMoving || points.length === 0}
            className="flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            Clear Previous
          </Button>
          <Button 
            onClick={handleClearAll}
            variant="destructive"
            disabled={isMoving || points.length === 0}
            className="flex items-center gap-2"
          >
            <Trash className="w-5 h-5" />
            Clear All
          </Button>
        </div>
        <Button 
          onClick={startCarMovement}
          disabled={points.length < 2 || isMoving}
        >
          {isMoving ? "Moving..." : "Start Movement"}
        </Button>
      </div>

      <Button
        onClick={centerOnUserLocation}
        className="absolute top-4 right-4 z-10"
        title="Center on my location"
      >
        <MapPin className="w-5 h-5" />
      </Button>
    </div>
  );
};