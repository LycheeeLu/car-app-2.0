import { useState } from "react";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { CarStatus } from "@/components/CarStatus";
import { Controls } from "@/components/Controls";
import { DirectionalControls } from "@/components/DirectionalControls";
import { SpeedControl } from "@/components/SpeedControl";
import { ModeSelector } from "@/components/ModeSelector";
import { WaypointMap } from "@/components/WaypointMap";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Navigation } from "lucide-react";

interface Coordinate {
  lat: number;
  lng: number;
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [waypoints, setWaypoints] = useState<Coordinate[]>([]);
  const [speed, setSpeed] = useState(15);
  const [mode, setMode] = useState<"manual" | "waypoint">("manual");
  const { toast } = useToast();

  const carStatus = {
    battery: 85,
    obstacleDistance: null,
    speed: speed,
  };

  const handleAddWaypoint = (coordinate: Coordinate) => {
    setWaypoints([...waypoints, coordinate]);
    toast({
      title: "Success",
      description: "Waypoint added successfully"
    });
  };

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
    toast({
      description: isRunning ? "Mission paused" : "Mission resumed"
    });
  };

  const handleEmergencyStop = () => {
    setIsRunning(false);
    setSpeed(0);
    toast({
      description: "Emergency stop activated",
      className: "bg-red-500 text-white"
    });
  };

  const handleDirectionPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (mode === "waypoint") return;
    const directionMessages = {
      up: "Moving forward",
      down: "Moving backward",
      left: "Turning left",
      right: "Turning right"
    };
    toast({
      description: directionMessages[direction]
    });
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    console.log("Speed updated:", newSpeed);
  };

  const handleModeChange = (newMode: "manual" | "waypoint") => {
    setMode(newMode);
    toast({
      description: `Switched to ${newMode} mode`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-purple-500">Auto-Nav Explorer</h1>
            <Navigation className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <ModeSelector mode={mode} onModeChange={handleModeChange} />
            <CarStatus {...carStatus} />
            <SpeedControl onSpeedChange={handleSpeedChange} currentSpeed={speed} />
            <Controls
              isRunning={isRunning}
              onToggleRunning={handleToggleRunning}
              onEmergencyStop={handleEmergencyStop}
            />
            <div className={`${mode === "waypoint" ? "opacity-50 pointer-events-none" : ""}`}>
              <DirectionalControls onDirectionPress={handleDirectionPress} />
            </div>
          </div>
          
          <div className={`space-y-4 ${mode === "manual" ? "opacity-50 pointer-events-none" : ""}`}>
            <WaypointMap onAddWaypoint={handleAddWaypoint} />
            <div className="glass-panel p-4">
              <h2 className="text-lg font-semibold mb-3">Waypoints</h2>
              {waypoints.length === 0 ? (
                <p className="text-gray-500">No waypoints added yet</p>
              ) : (
                <div className="space-y-2">
                  {waypoints.map((wp, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">
                        Point {index + 1}: ({wp.lat.toFixed(6)}, {wp.lng.toFixed(6)})
                      </span>
                      <span className="text-xs text-gray-500">
                        {index === 0 ? "Current Target" : "Queued"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;