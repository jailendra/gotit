import { router } from "expo-router";
import {
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Navigation,
  Package,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DeliveryOrder {
  id: string;
  merchantName: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedEarning: number;
  distance: number;
  estimatedTime: number;
  orderValue: number;
  timeRemaining: number;
}

export default function DeliveriesScreen() {
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([
    {
      id: "1",
      merchantName: "McDonald's",
      pickupAddress: "Sector 18, Noida",
      dropoffAddress: "Sector 15, Noida",
      estimatedEarning: 65,
      distance: 2.5,
      estimatedTime: 25,
      orderValue: 450,
      timeRemaining: 28,
    },
    {
      id: "2",
      merchantName: "Pizza Hut",
      pickupAddress: "DLF Mall, Gurgaon",
      dropoffAddress: "Golf Course Road",
      estimatedEarning: 85,
      distance: 4.2,
      estimatedTime: 35,
      orderValue: 780,
      timeRemaining: 15,
    },
    {
      id: "3",
      merchantName: "Starbucks",
      pickupAddress: "CP Metro Station",
      dropoffAddress: "India Gate",
      estimatedEarning: 45,
      distance: 1.8,
      estimatedTime: 20,
      orderValue: 320,
      timeRemaining: 45,
    },
  ]);

  const [timers, setTimers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailableOrders((prev) =>
        prev.map((order) => ({
          ...order,
          timeRemaining: Math.max(0, order.timeRemaining - 1),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const acceptOrder = (orderId: string) => {
    Alert.alert(
      "Accept Order",
      "Are you sure you want to accept this delivery?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => {
            setAvailableOrders((prev) =>
              prev.filter((order) => order.id !== orderId)
            );
            router.push(`/delivery/${orderId}`);
          },
        },
      ]
    );
  };

  const rejectOrder = (orderId: string) => {
    setAvailableOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderOrderCard = ({ item }: { item: DeliveryOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.merchantName}>{item.merchantName}</Text>
        <View style={styles.timer}>
          <Clock size={16} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(item.timeRemaining)}</Text>
        </View>
      </View>

      <View style={styles.locationInfo}>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#10B981" />
          <Text style={styles.locationText}>Pickup: {item.pickupAddress}</Text>
        </View>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#EF4444" />
          <Text style={styles.locationText}>
            Drop-off: {item.dropoffAddress}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <DollarSign size={16} color="#F59E0B" />
          <Text style={styles.detailText}>₹{item.estimatedEarning}</Text>
        </View>
        <View style={styles.detailItem}>
          <Navigation size={16} color="#2563EB" />
          <Text style={styles.detailText}>{item.distance} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.estimatedTime} min</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectOrder(item.id)}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => acceptOrder(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Deliveries</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {availableOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Package size={64} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No deliveries available</Text>
          <Text style={styles.emptySubtitle}>
            New orders will appear here when customers place them
          </Text>
        </View>
      ) : (
        <FlatList
          data={availableOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  acceptButton: {
    flex: 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
