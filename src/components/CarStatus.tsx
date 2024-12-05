import { Battery, Navigation2, Shield, Bot } from "lucide-react";

interface CarStatusProps {
  battery: number;
  obstacleDistance: number | null;
  speed: number;
}

export const CarStatus = ({ battery, obstacleDistance, speed }: CarStatusProps) => {
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
    </div>
  );
};