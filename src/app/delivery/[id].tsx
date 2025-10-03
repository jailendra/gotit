import Header from "@/src/components/Header";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  Phone,
  Star,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OrderDetails {
  id: string;
  merchantName: string;
  merchantPhone: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  customerName: string;
  customerPhone: string;
  estimatedEarning: number;
  distance: number;
  estimatedTime: number;
  orderValue: number;
  items: string[];
  specialInstructions?: string;
  rating: number;
  tips?: number;
  deliveryCode: string;
}

export default function DeliveryDetailsScreen() {
  const [orderDetails] = useState<OrderDetails>({
    id: "ORD-2024-001",
    merchantName: "Pizza Hut",
    merchantPhone: "+91 98765 43210",
    pickupAddress: "DLF Mall, Gurgaon, Sector 28",
    pickupLat: 28.4595,
    pickupLng: 77.0266,
    dropoffAddress: "Golf Course Road, Block A, Gurgaon",
    dropoffLat: 28.4543,
    dropoffLng: 77.0458,
    customerName: "Priya Sharma",
    customerPhone: "+91 87654 32109",
    estimatedEarning: 125,
    distance: 4.2,
    estimatedTime: 35,
    orderValue: 780,
    items: ["Large Margherita Pizza", "Garlic Bread", "Pepsi 500ml"],
    specialInstructions: "Ring the bell twice. Apartment 401, 4th floor.",
    rating: 4.8,
    tips: 25,
    deliveryCode: "ABCD",
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const inset = useSafeAreaInsets();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startNavigation = async (type: "pickup" | "dropoff") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { lat, lng } =
      type === "pickup"
        ? { lat: orderDetails.pickupLat, lng: orderDetails.pickupLng }
        : { lat: orderDetails.dropoffLat, lng: orderDetails.dropoffLng };

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Navigation Error", "Unable to open maps application");
    }
  };

  const callMerchant = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Linking.openURL(`tel:${orderDetails.merchantPhone}`);
    } catch (error) {
      Alert.alert("Call Error", "Unable to make phone call");
    }
  };

  const proceedToPickup = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/pickupConfirmation");
  };

  return (
    <View style={[styles.container, { paddingBottom: inset.bottom }]}>
      <Header
        title="Delivery Details"
        subtitle={`Order #${orderDetails.id}`}
        showBack
        style={{ paddingTop: inset.top }}
        onBack={() => router.back()}
        right={
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>ACCEPTED</Text>
          </View>
        }
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.merchantName}>{orderDetails.merchantName}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{orderDetails.rating}</Text>
            </View>
          </View>

          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <DollarSign size={20} color="#059669" />
              <View>
                <Text style={styles.earningsAmount}>
                  ₹{orderDetails.estimatedEarning}
                </Text>
                {orderDetails.tips && (
                  <Text style={styles.tipsAmount}>
                    +₹{orderDetails.tips} tips
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.orderStats}>
              <Text style={styles.statText}>
                {orderDetails.distance} km • {orderDetails.estimatedTime} min
              </Text>
              <Text style={styles.orderValue}>
                Order Value: ₹{orderDetails.orderValue}
              </Text>
            </View>
          </View>
        </View>

        {/* Pickup Information */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#10B981" />
            <Text style={styles.locationTitle}>Pickup Location</Text>
            <TouchableOpacity style={styles.callButton} onPress={callMerchant}>
              <Phone size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <Text style={styles.locationAddress}>
            {orderDetails.pickupAddress}
          </Text>
          <Text style={styles.merchantPhone}>
            📞 {orderDetails.merchantPhone}
          </Text>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => startNavigation("pickup")}
          >
            <Navigation size={20} color="#ffffff" />
            <Text style={styles.navigationText}>
              Start Navigation to Pickup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.cardTitle}>Order Items</Text>
          {orderDetails.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemBullet}>•</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Customer Information */}
        <View style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <User size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Customer Details</Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{orderDetails.customerName}</Text>
            <Text style={styles.customerPhone}>
              📞 {orderDetails.customerPhone}
            </Text>
          </View>

          <View style={styles.dropoffInfo}>
            <Text style={styles.dropoffLabel}>Delivery Address:</Text>
            <Text style={styles.dropoffAddress}>
              {orderDetails.dropoffAddress}
            </Text>
          </View>

          {orderDetails.specialInstructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsLabel}>
                Special Instructions:
              </Text>
              <Text style={styles.instructionsText}>
                {orderDetails.specialInstructions}
              </Text>
            </View>
          )}

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Delivery Code:</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{orderDetails.deliveryCode}</Text>
            </View>
          </View>
        </View>

        {/* Time Information */}
        <View style={styles.timeCard}>
          <View style={styles.timeRow}>
            <Clock size={18} color="#64748B" />
            <Text style={styles.timeLabel}>Accepted at:</Text>
            <Text style={styles.timeValue}>
              {currentTime.toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Clock size={18} color="#F59E0B" />
            <Text style={styles.timeLabel}>Expected delivery:</Text>
            <Text style={styles.timeValue}>
              {new Date(
                currentTime.getTime() + orderDetails.estimatedTime * 60000
              ).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={proceedToPickup}
        >
          <Text style={styles.proceedButtonText}>I'm on my way to pickup!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  statusBadge: {
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  merchantName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  earningsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#059669",
  },
  tipsAmount: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  orderStats: {
    alignItems: "flex-end",
  },
  statText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  orderValue: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  callButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  locationAddress: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 22,
  },
  merchantPhone: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  navigationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  itemsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  itemBullet: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "700",
  },
  itemText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  customerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: "#64748B",
  },
  dropoffInfo: {
    marginBottom: 16,
  },
  dropoffLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  dropoffAddress: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
  },
  instructionsContainer: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 18,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  codeBox: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 2,
  },
  timeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  proceedButton: {
    backgroundColor: "#059669",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
});
