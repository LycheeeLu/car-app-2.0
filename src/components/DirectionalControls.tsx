import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface DirectionalControlsProps {
  onDirectionPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const DirectionalControls = ({ onDirectionPress }: DirectionalControlsProps) => {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold">Direction Controls</h2>
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        {/* Empty cell for spacing */}
        <div className="h-12" />
        {/* Up button */}
        <button
          onClick={() => onDirectionPress('up')}
          className="control-button bg-secondary h-12 flex items-center justify-center"
          aria-label="Move Forward"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        {/* Empty cell for spacing */}
        <div className="h-12" />
        {/* Left button */}
        <button
          onClick={() => onDirectionPress('left')}
          className="control-button bg-secondary h-12 flex items-center justify-center"
          aria-label="Turn Left"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        {/* Empty cell for spacing */}
        <div className="h-12" />
        {/* Right button */}
        <button
          onClick={() => onDirectionPress('right')}
          className="control-button bg-secondary h-12 flex items-center justify-center"
          aria-label="Turn Right"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        {/* Empty cell for spacing */}
        <div className="h-12" />
        {/* Down button */}
        <button
          onClick={() => onDirectionPress('down')}
          className="control-button bg-secondary h-12 flex items-center justify-center"
          aria-label="Move Backward"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        {/* Empty cell for spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
};