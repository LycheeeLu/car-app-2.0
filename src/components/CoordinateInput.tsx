import { useState } from "react";
import { MapPin, Plus, Car } from "lucide-react";
import { toast } from "sonner";

interface Coordinate {
  lat: number;
  lng: number;
}

interface CoordinateInputProps {
  onAddWaypoint: (coordinate: Coordinate) => void;
}

export const CoordinateInput = ({ onAddWaypoint }: CoordinateInputProps) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lat && lng) {
      onAddWaypoint({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      setLat("");
      setLng("");
    }
  };

  const getCarPosition = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('your-car-api-endpoint/location');
      const data = await response.json();
      
      const carPosition = {
        lat: "37.7749",
        lng: "-122.4194"
      };
      
      setLat(carPosition.lat);
      setLng(carPosition.lng);
      toast.success("Car position loaded");
    } catch (error) {
      toast.error("Failed to get car position");
      console.error("Error fetching car position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Add Waypoint</h2>
        </div>
        <button
          type="button"
          onClick={getCarPosition}
          disabled={isLoading}
          className="control-button bg-secondary text-secondary-foreground"
        >
          <Car className="w-4 h-4 inline-block mr-2" />
          {isLoading ? "Loading..." : "Use Car Position"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            step="any"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter latitude"
            required
          />
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            step="any"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter longitude"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full control-button bg-primary text-primary-foreground"
      >
        <Plus className="w-4 h-4 inline-block mr-2" />
        Add Waypoint
      </button>
    </form>
  );
};