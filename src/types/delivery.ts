export interface DeliveryOrder {
  id: string;
  merchantName: string;
  pickupAddress: string;
  dropoffAddress: string;
  customerName: string;
  customerPhone: string;
  merchantPhone: string;
  estimatedEarning: number;
  distance: number;
  estimatedTime: number;
  orderValue: number;
  deliveryCode: string;
  status:
    | "pending"
    | "accepted"
    | "pickup"
    | "transit"
    | "delivered"
    | "cancelled";
  createdAt: string;
  timeRemaining?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  profilePhoto: string;
  rating: number;
  totalDeliveries: number;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  isOnline: boolean;
  documents: {
    license: string;
    aadhaar: string;
    vehicle: string;
  };
}

export interface EarningsData {
  period: "day" | "week" | "month";
  totalEarnings: number;
  deliveries: number;
  tips: number;
  bonuses: number;
  baseEarnings: number;
}
