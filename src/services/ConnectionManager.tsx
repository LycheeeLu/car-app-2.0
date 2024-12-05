import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Wifi, Bluetooth } from 'lucide-react';
import { connectionService, ConnectionStatus } from '../services/ConnectionService';

export const ConnectionManager = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    type: null
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connectBluetooth = async () => {
    setIsConnecting(true);
    try {
      await connectionService.connectBluetooth();
      toast.success('Connected via Bluetooth');
      setStatus(connectionService.getStatus());
    } catch (error) {
      toast.error('Bluetooth connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWiFi = async () => {
    setIsConnecting(true);
    try {
      await connectionService.connectWiFi('CarWiFi', 'password');
      toast.success('Connected via WiFi');
      setStatus(connectionService.getStatus());
    } catch (error) {
      toast.error('WiFi connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Connection Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={connectBluetooth}
            disabled={isConnecting || status.isConnected}
            className="control-button bg-primary"
          >
            <Bluetooth className="w-4 h-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect Bluetooth'}
          </button>
          <button
            onClick={connectWiFi}
            disabled={isConnecting || status.isConnected}
            className="control-button bg-primary"
          >
            <Wifi className="w-4 h-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect WiFi'}
          </button>
        </div>
      </div>

      {status.isConnected && (
        <div className="text-sm">
          <p>Connected via: {status.type}</p>
          <p>Device: {status.deviceName}</p>
        </div>
      )}
    </div>
  );
}; 