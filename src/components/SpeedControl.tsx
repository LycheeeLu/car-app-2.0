import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface SpeedControlProps {
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
}

export const SpeedControl = ({ onSpeedChange, currentSpeed }: SpeedControlProps) => {
  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    onSpeedChange(newSpeed);
    toast.info(`Speed set to ${newSpeed} km/h`);
    console.log("Speed changed:", newSpeed);
  };

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Speed Control</h2>
        <span className="text-sm font-medium">{currentSpeed} km/h</span>
      </div>
      <Slider
        defaultValue={[currentSpeed]}
        max={30}
        min={0}
        step={1}
        onValueChange={handleSpeedChange}
        className="w-full"
      />
    </div>
  );
};