import { useState } from "react";
import { Wifi, WifiOff, Bluetooth, BluetoothOff, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  const [isWifiEnabled, setIsWifiEnabled] = useState(true);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const { toast } = useToast();

  const handleWifiChange = () => {
    setIsWifiEnabled(!isWifiEnabled);
    toast({
      description: `WiFi ${!isWifiEnabled ? 'enabled' : 'disabled'}`
    });
    console.log("WiFi mode changed:", !isWifiEnabled);
  };

  const handleBluetoothChange = () => {
    setIsBluetoothEnabled(!isBluetoothEnabled);
    toast({
      description: `Bluetooth ${!isBluetoothEnabled ? 'enabled' : 'disabled'}`
    });
    console.log("Bluetooth mode changed:", !isBluetoothEnabled);
  };

  return (
    <div className="glass-panel w-full sm:w-auto p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
        <h2 className="text-sm font-semibold text-purple-800">Robot Car Connection</h2>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={handleWifiChange}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex-1"
          >
            {isWifiEnabled ? (
              <Wifi className="w-4 h-4 text-purple-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-500" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${isWifiEnabled ? 'text-purple-500' : 'text-gray-500'}`}>
              WiFi
            </span>
          </button>

          <button
            onClick={handleBluetoothChange}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex-1"
          >
            {isBluetoothEnabled ? (
              <Bluetooth className="w-4 h-4 text-purple-500" />
            ) : (
              <BluetoothOff className="w-4 h-4 text-gray-500" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${isBluetoothEnabled ? 'text-purple-500' : 'text-gray-500'}`}>
              Bluetooth
            </span>
          </button>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
          isConnected ? 'border-purple-200' : 'border-red-200'
        }`}>
          {isWifiEnabled && (
            isConnected ? <Wifi className="w-4 h-4 text-purple-500" /> : <WifiOff className="w-4 h-4 text-red-500" />
          )}
          {isBluetoothEnabled && (
            isConnected ? <Bluetooth className="w-4 h-4 text-purple-500" /> : <BluetoothOff className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-xs sm:text-sm font-medium ${
            isConnected ? 'text-purple-500' : 'text-red-500'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
};