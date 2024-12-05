import { AlertCircle, Pause, Play, Square } from "lucide-react";

interface ControlsProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  onEmergencyStop: () => void;
}

export const Controls = ({ isRunning, onToggleRunning, onEmergencyStop }: ControlsProps) => {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold">Controls</h2>
      <div className="flex gap-4">
        <button
          onClick={onToggleRunning}
          className={`flex-1 control-button ${
            isRunning
              ? "bg-car-warning text-white"
              : "bg-car-success text-white"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 inline-block mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 inline-block mr-2" />
              Resume
            </>
          )}
        </button>
        <button
          onClick={onEmergencyStop}
          className="flex-1 control-button bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
        >
          <Square className="w-4 h-4 inline-block mr-2" />
          Emergency Stop
        </button>
      </div>
    </div>
  );
};