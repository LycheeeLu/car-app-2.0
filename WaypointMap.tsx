import { useState, useCallback } from "react";
import { Car, History, Trash, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Coordinate {
  lat: number;
  lng: number;
}

interface WaypointMapProps {
  onAddWaypoint: (coordinate: Coordinate) => void;
}

const defaultCenter = {
  lat: 61.05871,
  lng: 28.18871
};

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Map Click Handler Component
function MapClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

// Custom Center Control Component
function CenterControl() {
  const map = useMap();
  
  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setView(pos, 15);
        },
        () => {
          toast.error("Error: The Geolocation service failed.");
        }
      );
    } else {
      toast.error("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
    <Button
      onClick={centerOnUserLocation}
      className="absolute top-4 right-4 z-[1000]"
      title="Center on my location"
    >
      <MapPin className="w-5 h-5" />
    </Button>
  );
}

// Add this custom car icon definition near the top of the file
const carIcon = L.divIcon({
  className: 'car-marker',
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const WaypointMap = ({ onAddWaypoint }: WaypointMapProps) => {
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [carPosition, setCarPosition] = useState<Coordinate | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const onMapClick = useCallback((e: L.LeafletMouseEvent) => {
    const newPoint = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
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

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Visual Waypoint Map</h2>
      </div>

      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      
          />
          <MapClickHandler onMapClick={onMapClick} />
          <CenterControl />

          {points.map((point, index) => (
            <Marker
              key={`point-${index}`}
              position={[point.lat, point.lng]}
            />
          ))}

          {points.length > 1 && (
            <Polyline
              positions={points.map(point => [point.lat, point.lng])}
          
            />
          )}

          {carPosition && (
            <Marker
              position={[carPosition.lat, carPosition.lng]}
              icon={carIcon}
            />
          )}
        </MapContainer>
      </div>

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
    </div>
  );
};