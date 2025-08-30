import { Clock, DollarSign, MapPin, Navigation } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeliveryCardProps {
  id: string;
  merchantName: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedEarning: number;
  distance: number;
  estimatedTime: number;
  timeRemaining: number;
  onAccept: () => void;
  onReject: () => void;
}

export default function DeliveryCard({
  merchantName,
  pickupAddress,
  dropoffAddress,
  estimatedEarning,
  distance,
  estimatedTime,
  timeRemaining,
  onAccept,
  onReject,
}: DeliveryCardProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.merchantName}>{merchantName}</Text>
        <View style={styles.timer}>
          <Clock size={16} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>

      <View style={styles.locationInfo}>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#10B981" />
          <Text style={styles.locationText}>Pickup: {pickupAddress}</Text>
        </View>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#EF4444" />
          <Text style={styles.locationText}>Drop-off: {dropoffAddress}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <DollarSign size={16} color="#F59E0B" />
          <Text style={styles.detailText}>₹{estimatedEarning}</Text>
        </View>
        <View style={styles.detailItem}>
          <Navigation size={16} color="#2563EB" />
          <Text style={styles.detailText}>{distance} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#64748B" />
          <Text style={styles.detailText}>{estimatedTime} min</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
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
  details: {
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
