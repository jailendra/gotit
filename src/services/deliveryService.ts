export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface DeliveryRequest {
  id: string;
  merchantId: string;
  merchantName: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  customerName: string;
  customerPhone: string;
  orderValue: number;
  estimatedEarning: number;
  deliveryInstructions?: string;
  timeLimit: number; // seconds
}

class DeliveryService {
  private static instance: DeliveryService;
  private listeners: ((orders: DeliveryRequest[]) => void)[] = [];

  static getInstance(): DeliveryService {
    if (!DeliveryService.instance) {
      DeliveryService.instance = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  // Simulate real-time delivery updates
  startListening() {
    setInterval(() => {
      // Simulate new orders coming in
      if (Math.random() > 0.7) {
        // 30% chance every interval
        this.notifyNewOrders();
      }
    }, 15000); // Check every 15 seconds
  }

  private notifyNewOrders() {
    const mockOrders: DeliveryRequest[] = [
      {
        id: Date.now().toString(),
        merchantId: "merchant_1",
        merchantName: "Burger King",
        pickupLocation: {
          latitude: 28.5355,
          longitude: 77.391,
          address: "Select City Walk, Saket",
        },
        dropoffLocation: {
          latitude: 28.5245,
          longitude: 77.385,
          address: "Malviya Nagar, Delhi",
        },
        customerName: "Amit Singh",
        customerPhone: "+91 99999 88888",
        orderValue: 650,
        estimatedEarning: 80,
        deliveryInstructions: "Ring the bell twice",
        timeLimit: 60,
      },
    ];

    this.listeners.forEach((listener) => listener(mockOrders));
  }

  subscribe(listener: (orders: DeliveryRequest[]) => void) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  acceptOrder(orderId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        resolve(Math.random() > 0.05);
      }, 1000);
    });
  }

  updateDeliveryStatus(
    orderId: string,
    status: string,
    data?: any
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Order ${orderId} updated to ${status}`, data);
        resolve(true);
      }, 500);
    });
  }

  uploadDeliveryPhoto(
    orderId: string,
    photoUri: string,
    type: "pickup" | "delivery"
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Photo uploaded for order ${orderId}`, { type, photoUri });
        resolve(true);
      }, 2000);
    });
  }
}

export const deliveryService = DeliveryService.getInstance();
