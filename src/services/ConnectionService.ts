/// <reference types="web-bluetooth" />

// Connection types
export type ConnectionType = 'bluetooth' | 'wifi';

export interface ConnectionStatus {
  isConnected: boolean;
  type: ConnectionType | null;
  deviceName?: string;
  signal?: number;
  error?: string;
}

class ConnectionService {
  private status: ConnectionStatus = {
    isConnected: false,
    type: null
  };

  // Bluetooth Methods
  async connectBluetooth(): Promise<void> {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth not supported');
      }

      const device = await navigator.bluetooth.requestDevice({
        // Customize these filters based on your car's Bluetooth characteristics
        filters: [
          { services: ['your-service-uuid'] },
          { namePrefix: 'CAR-' }
        ]
      });

      const server = await device.gatt?.connect();
      // Connect to specific services/characteristics
      
      this.status = {
        isConnected: true,
        type: 'bluetooth',
        deviceName: device.name
      };
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      throw error;
    }
  }

  // WiFi Methods
  async connectWiFi(ssid: string, password: string): Promise<void> {
    try {
      // Example using WebSocket for WiFi communication
      const ws = new WebSocket(`ws://your-car-ip:port`);
      
      ws.onopen = () => {
        this.status = {
          isConnected: true,
          type: 'wifi',
          deviceName: ssid
        };
      };

      ws.onclose = () => {
        this.status.isConnected = false;
      };

      ws.onerror = (error) => {
        throw error;
      };
    } catch (error) {
      console.error('WiFi connection failed:', error);
      throw error;
    }
  }

  // General Methods
  getStatus(): ConnectionStatus {
    return this.status;
  }

  async disconnect(): Promise<void> {
    // Implement disconnect logic based on current connection type
    this.status = {
      isConnected: false,
      type: null
    };
  }

  // Method to send commands to the car
  async sendCommand(command: string, data?: any): Promise<void> {
    if (!this.status.isConnected) {
      throw new Error('Not connected to car');
    }
    // Implement command sending logic based on connection type
  }
}

export const connectionService = new ConnectionService(); 