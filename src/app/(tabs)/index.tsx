import { router } from "expo-router";
import {
  Camera,
  Clock,
  DollarSign,
  MapPin,
  Package,
  Power,
  Star,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [todayStats, setTodayStats] = useState({
    totalOrders: 12,
    completedOrders: 10,
    earnings: 850,
    rating: 4.8,
  });

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const triggerRandomVerification = () => {
    Alert.alert(
      "Security Check Required",
      "Random verification needed to continue driving. This helps ensure account security.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Verify Now",
          onPress: () =>
            router.push({
              pathname: "/verification",
              params: { type: "random" },
            }),
        },
      ]
    );
  };

  useEffect(() => {
    // Simulate random verification trigger (in real app, this would be server-driven)
    const randomCheck = Math.random();
    if (randomCheck > 0.9 && isOnline) {
      // 10% chance when online
      setTimeout(() => {
        triggerRandomVerification();
      }, 30000); // After 30 seconds
    }
  }, [isOnline]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.driverName}>Rajesh Kumar</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.statusButton,
            isOnline ? styles.onlineButton : styles.offlineButton,
          ]}
          onPress={toggleOnlineStatus}
        >
          <Power size={20} color="#ffffff" />
          <Text style={styles.statusText}>
            {isOnline ? "ONLINE" : "OFFLINE"}
          </Text>
        </TouchableOpacity>
      </View>

      {!isOnline && (
        <View style={styles.offlineNotice}>
          <Text style={styles.offlineText}>
            You're offline. Turn online to start receiving delivery requests.
          </Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Package size={24} color="#2563EB" />
            <Text style={styles.statNumber}>{todayStats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Clock size={24} color="#10B981" />
            <Text style={styles.statNumber}>{todayStats.completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <DollarSign size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>₹{todayStats.earnings}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>

          <View style={styles.statCard}>
            <Star size={24} color="#EF4444" />
            <Text style={styles.statNumber}>{todayStats.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/deliveries")}
          disabled={!isOnline}
        >
          <MapPin size={24} color={isOnline ? "#2563EB" : "#94A3B8"} />
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, !isOnline && styles.disableText]}>
              View Available Deliveries
            </Text>
            <Text
              style={[styles.actionSubtitle, !isOnline && styles.disableText]}
            >
              {isOnline
                ? "Find delivery requests near you"
                : "Go online to see deliveries"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/earnings")}
        >
          <DollarSign size={24} color="#10B981" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Earnings</Text>
            <Text style={styles.actionSubtitle}>
              Track your daily and weekly earnings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/verification?type=random")}
        >
          <Camera size={24} color="#F59E0B" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manual Verification</Text>
            <Text style={styles.actionSubtitle}>
              Verify your identity manually
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {isOnline && (
        <View style={styles.liveStatus}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveText}>
            You're live and ready for deliveries
          </Text>
        </View>
      )}
    </ScrollView>
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
  },
  greeting: {
    fontSize: 16,
    color: "#64748B",
  },
  driverName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  onlineButton: {
    backgroundColor: "#10B981",
  },
  offlineButton: {
    backgroundColor: "#64748B",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  offlineNotice: {
    backgroundColor: "#FEF3C7",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  offlineText: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  quickActions: {
    margin: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionContent: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  disableText: {
    color: "#94A3B8",
  },
  liveStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    margin: 20,
    backgroundColor: "#DCFCE7",
    borderRadius: 12,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 8,
  },
  liveText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "500",
  },
});
