import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  Clock,
  Home,
  Star,
  TrendingUp,
  User
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DeliveryCompleteScreen() {
  const [deliveryData] = useState({
    orderId: "ORD-2024-001",
    customerName: "Priya Sharma",
    merchantName: "Pizza Hut",
    baseEarning: 100,
    tips: 25,
    bonus: 0,
    totalEarning: 125,
    deliveryTime: 32, // minutes
    distance: 4.2,
    completedAt: new Date(),
    customerRating: 0,
    driverRating: 0,
  });

  const [customerRating, setCustomerRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));
  const [showCelebration, setShowCelebration] = useState(true);
  const inset = useSafeAreaInsets();  

  useEffect(() => {
    // Celebration animation
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  }, []);

  const submitCustomerRating = async (rating: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCustomerRating(rating);
  };

  const submitDriverRating = async (rating: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDriverRating(rating);
  };

  const finishDelivery = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/deliveries");
  };

  const goToEarnings = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/earnings");
  };

  const renderStarRating = (
    currentRating: number,
    onRate: (rating: number) => void,
    title: string
  ) => (
    <View style={styles.ratingSection}>
      <Text style={styles.ratingTitle}>{title}</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRate(star)}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={star <= currentRating ? "#F59E0B" : "#E5E7EB"}
              fill={star <= currentRating ? "#F59E0B" : "transparent"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (showCelebration) {
    return (
      <View style={styles.celebrationContainer}>
        <Animated.View
          style={[
            styles.celebrationContent,
            {
              transform: [{ scale: animatedValue }],
              opacity: animatedValue,
            },
          ]}
        >
          <Text style={styles.celebrationTitle}>🎉 Delivery Complete!</Text>
          <Text style={styles.celebrationSubtitle}>
            Great job! You've successfully completed this delivery.
          </Text>
          <View style={styles.quickStats}>
            <Text style={styles.quickEarning}>
              +₹{deliveryData.totalEarning}
            </Text>
            <Text style={styles.quickTime}>
              {deliveryData.deliveryTime} min
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#141e30", "#243b55", "#141e30"]}
        style={[styles.header,{paddingTop: inset.top}]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Delivery Successful!</Text>
            <Text style={styles.subtitle}>Order #{deliveryData.orderId}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.cardTitle}>💰 Your Earnings</Text>

          <View style={styles.earningsBreakdown}>
            <View style={styles.earningRow}>
              <Text style={styles.earningLabel}>Base Delivery Fee</Text>
              <Text style={styles.earningAmount}>
                ₹{deliveryData.baseEarning}
              </Text>
            </View>

            {deliveryData.tips > 0 && (
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>Customer Tips</Text>
                <Text style={styles.tipAmount}>+₹{deliveryData.tips}</Text>
              </View>
            )}

            {deliveryData.bonus > 0 && (
              <View style={styles.earningRow}>
                <Text style={styles.earningLabel}>Performance Bonus</Text>
                <Text style={styles.bonusAmount}>+₹{deliveryData.bonus}</Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Earned</Text>
              <Text style={styles.totalAmount}>
                ₹{deliveryData.totalEarning}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewEarningsButton}
            onPress={goToEarnings}
          >
            <TrendingUp size={18} color="#2563EB" />
            <Text style={styles.viewEarningsText}>View All Earnings</Text>
            <ArrowRight size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Delivery Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>📊 Delivery Performance</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Clock size={20} color="#2563EB" />
              <Text style={styles.statValue}>
                {deliveryData.deliveryTime} min
              </Text>
              <Text style={styles.statLabel}>Delivery Time</Text>
            </View>

            <View style={styles.statItem}>
              <TrendingUp size={20} color="#059669" />
              <Text style={styles.statValue}>
                ₹
                {Math.round(
                  deliveryData.totalEarning / deliveryData.deliveryTime
                )}
              </Text>
              <Text style={styles.statLabel}>Per Minute</Text>
            </View>

            <View style={styles.statItem}>
              <Star size={20} color="#F59E0B" />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Your Rating</Text>
            </View>
          </View>
        </View>

        {/* Customer Rating */}
        <View style={styles.ratingCard}>
          {renderStarRating(
            customerRating,
            submitCustomerRating,
            "Rate Your Customer Experience"
          )}
          <Text style={styles.ratingNote}>
            Help other drivers by rating this customer
          </Text>
        </View>

        {/* Optional: Driver Rating from Customer */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Customer's Rating for You</Text>
          <View style={styles.pendingRating}>
            <User size={24} color="#64748B" />
            <Text style={styles.pendingText}>
              {customerRating > 0
                ? "Customer will rate your service soon"
                : "Rate the customer first to see their rating"}
            </Text>
          </View>
        </View>

        {/* Delivery Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>📋 Delivery Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customer:</Text>
            <Text style={styles.summaryValue}>{deliveryData.customerName}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Restaurant:</Text>
            <Text style={styles.summaryValue}>{deliveryData.merchantName}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distance:</Text>
            <Text style={styles.summaryValue}>{deliveryData.distance} km</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completed:</Text>
            <Text style={styles.summaryValue}>
              {deliveryData.completedAt.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Achievement/Milestone */}
        <View style={styles.achievementCard}>
          <Text style={styles.achievementTitle}>🏆 Well Done!</Text>
          <Text style={styles.achievementText}>
            You've completed 47 deliveries this month. Keep up the great work!
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={finishDelivery}
        >
          <Home size={20} color="#ffffff" />
          <Text style={styles.newOrderText}>Find Next Delivery</Text>
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
  celebrationContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  celebrationContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#059669",
    marginTop: 20,
    textAlign: "center",
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  quickStats: {
    flexDirection: "row",
    gap: 20,
    marginTop: 24,
  },
  quickEarning: {
    fontSize: 24,
    fontWeight: "700",
    color: "#059669",
  },
  quickTime: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  earningsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#ECFDF5",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
  },
  earningsBreakdown: {
    marginBottom: 20,
  },
  earningRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  earningLabel: {
    fontSize: 15,
    color: "#64748B",
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  tipAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  bonusAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: "#E2E8F0",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#059669",
  },
  viewEarningsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewEarningsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  ratingCard: {
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
  ratingSection: {
    alignItems: "center",
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingNote: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
  },
  pendingRating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  pendingText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    flex: 1,
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#64748B",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  achievementCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  newOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059669",
    padding: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newOrderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
});
