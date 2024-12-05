import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ModeSelectorProps {
  mode: "manual" | "waypoint";
  onModeChange: (mode: "manual" | "waypoint") => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold">Operation Mode</h2>
      <RadioGroup
        value={mode}
        onValueChange={(value: "manual" | "waypoint") => onModeChange(value)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual">Manual Control</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="waypoint" id="waypoint" />
          <Label htmlFor="waypoint">Waypoint Navigation</Label>
        </div>
      </RadioGroup>
    </div>
  );
};