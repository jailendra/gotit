import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Filter,
  Gift,
  MapPin,
  Package,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EarningsData {
  period: "day" | "week" | "month";
  totalEarnings: number;
  deliveries: number;
  tips: number;
  bonuses: number;
  baseEarnings: number;
  averagePerDelivery: number;
  previousPeriodEarnings: number;
  peakHours: string;
  topLocation: string;
}

interface DeliveryHistory {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  distance: string;
  duration: string;
  baseEarning: number;
  tip: number;
  bonus: number;
  total: number;
  status: "completed" | "cancelled";
  rating: number;
  paymentMethod: "cash" | "online";
}

interface WeeklyChart {
  day: string;
  earnings: number;
}

export default function EarningsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month"
  >("day");
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const earningsData: Record<string, EarningsData> = {
    day: {
      period: "day",
      totalEarnings: 1240,
      deliveries: 15,
      tips: 180,
      bonuses: 80,
      baseEarnings: 980,
      averagePerDelivery: 82.7,
      previousPeriodEarnings: 950,
      peakHours: "12:00 PM - 2:00 PM",
      topLocation: "Gurgaon Sector 28",
    },
    week: {
      period: "week",
      totalEarnings: 6850,
      deliveries: 89,
      tips: 920,
      bonuses: 450,
      baseEarnings: 5480,
      averagePerDelivery: 77.0,
      previousPeriodEarnings: 6200,
      peakHours: "7:00 PM - 9:00 PM",
      topLocation: "DLF Cyber City",
    },
    month: {
      period: "month",
      totalEarnings: 28500,
      deliveries: 385,
      tips: 3800,
      bonuses: 1950,
      baseEarnings: 22750,
      averagePerDelivery: 74.0,
      previousPeriodEarnings: 26800,
      peakHours: "Weekend Evenings",
      topLocation: "Connaught Place",
    },
  };

  const weeklyChartData: WeeklyChart[] = [
    { day: "Mon", earnings: 890 },
    { day: "Tue", earnings: 1120 },
    { day: "Wed", earnings: 980 },
    { day: "Thu", earnings: 1340 },
    { day: "Fri", earnings: 1580 },
    { day: "Sat", earnings: 1890 },
    { day: "Sun", earnings: 1650 },
  ];

  const deliveryHistory: DeliveryHistory[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-1847",
      date: "Today",
      time: "2:30 PM",
      pickup: "McDonald's, Sector 18",
      dropoff: "Sector 15, Noida",
      distance: "4.2 km",
      duration: "28 min",
      baseEarning: 65,
      tip: 25,
      bonus: 10,
      total: 100,
      status: "completed",
      rating: 5,
      paymentMethod: "online",
    },
    {
      id: "2",
      orderNumber: "ORD-2024-1846",
      date: "Today",
      time: "1:15 PM",
      pickup: "KFC, DLF Mall",
      dropoff: "Golf Course Road",
      distance: "6.8 km",
      duration: "35 min",
      baseEarning: 85,
      tip: 0,
      bonus: 15,
      total: 100,
      status: "completed",
      rating: 4,
      paymentMethod: "cash",
    },
    {
      id: "3",
      orderNumber: "ORD-2024-1845",
      date: "Today",
      time: "12:45 PM",
      pickup: "Subway, CP",
      dropoff: "India Gate",
      distance: "3.5 km",
      duration: "22 min",
      baseEarning: 55,
      tip: 30,
      bonus: 0,
      total: 85,
      status: "completed",
      rating: 5,
      paymentMethod: "online",
    },
    {
      id: "4",
      orderNumber: "ORD-2024-1844",
      date: "Today",
      time: "11:30 AM",
      pickup: "Domino's, Lajpat Nagar",
      dropoff: "Greater Kailash",
      distance: "5.1 km",
      duration: "0 min",
      baseEarning: 70,
      tip: 0,
      bonus: 0,
      total: 0,
      status: "cancelled",
      rating: 0,
      paymentMethod: "online",
    },
  ];

  const currentData = earningsData[selectedPeriod];
  const growthPercentage = (
    ((currentData.totalEarnings - currentData.previousPeriodEarnings) /
      currentData.previousPeriodEarnings) *
    100
  ).toFixed(1);
  const isPositiveGrowth =
    currentData.totalEarnings > currentData.previousPeriodEarnings;

  const handlePeriodChange = async (period: "day" | "week" | "month") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPeriod(period);

    // Animate the transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRefresh = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleWithdraw = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Request Withdrawal",
      `Withdraw ₹${currentData.totalEarnings.toLocaleString()} to your registered bank account?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Withdraw",
          style: "default",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
              "Success",
              "Withdrawal request submitted successfully!"
            );
          },
        },
      ]
    );
  };

  const handleDownloadStatement = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Download Statement",
      "Your earnings statement will be downloaded shortly.",
      [{ text: "OK", style: "default" }]
    );
  };

  const toggleBalanceVisibility = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowBalance(!showBalance);
  };

  const maxChartValue = Math.max(...weeklyChartData.map((d) => d.earnings));

  const renderHistoryItem = ({ item }: { item: DeliveryHistory }) => (
    <TouchableOpacity
      style={styles.historyCard}
      activeOpacity={0.8}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Navigate to delivery details
      }}
    >
      <View style={styles.historyHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.historyDateTime}>
            {item.date} • {item.time}
          </Text>
        </View>
        <View style={styles.earningsContainer}>
          <Text style={styles.earningAmount}>
            {showBalance ? `₹${item.total}` : "••••"}
          </Text>
          {item.status === "completed" && (
            <View style={styles.ratingContainer}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.locationInfo}>
        <MapPin size={14} color="#64748B" />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.pickup} → {item.dropoff}
        </Text>
      </View>

      <View style={styles.deliveryMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Distance</Text>
          <Text style={styles.metricValue}>{item.distance}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Duration</Text>
          <Text style={styles.metricValue}>{item.duration}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Payment</Text>
          <Text style={styles.metricValue}>{item.paymentMethod}</Text>
        </View>
      </View>

      <View style={styles.historyFooter}>
        <View
          style={[
            styles.statusBadge,
            item.status === "completed"
              ? styles.completedBadge
              : styles.cancelledBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === "completed"
                ? styles.completedText
                : styles.cancelledText,
            ]}
          >
            {item.status}
          </Text>
        </View>

        <View style={styles.earningsBreakdown}>
          {showBalance && (
            <>
              <Text style={styles.earningsDetail}>
                Base: ₹{item.baseEarning}
              </Text>
              {item.tip > 0 && (
                <Text style={styles.tipDetail}>Tip: ₹{item.tip}</Text>
              )}
              {item.bonus > 0 && (
                <Text style={styles.bonusDetail}>Bonus: ₹{item.bonus}</Text>
              )}
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChartBar = ({
    item,
    index,
  }: {
    item: WeeklyChart;
    index: number;
  }) => {
    const heightPercentage = (item.earnings / maxChartValue) * 100;
    const barHeight = Math.max((heightPercentage / 100) * 80, 10);
    const isToday = index === 6; // Assuming Sunday is today for demo

    return (
      <TouchableOpacity
        key={item.day}
        style={styles.chartBarContainer}
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.chartAmount}>
          {showBalance ? `₹${Math.round(item.earnings / 100)}k` : "••"}
        </Text>
        <View
          style={[
            styles.chartBar,
            { height: barHeight },
            isToday && styles.todayBar,
          ]}
        />
        <Text style={[styles.chartDay, isToday && styles.todayText]}>
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Earnings</Text>
          <Text style={styles.subtitle}>Track your delivery income</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleBalanceVisibility}
          >
            {showBalance ? (
              <Eye size={20} color="#64748B" />
            ) : (
              <EyeOff size={20} color="#64748B" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleDownloadStatement}
          >
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(["day", "week", "month"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton,
              ]}
              onPress={() => handlePeriodChange(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.activePeriodButtonText,
                ]}
              >
                {period === "day"
                  ? "Today"
                  : period === "week"
                  ? "This Week"
                  : "This Month"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Earnings Card */}
        <Animated.View style={[styles.mainEarningsCard, { opacity: fadeAnim }]}>
          <View style={styles.earningsHeader}>
            <View style={styles.earningsIconContainer}>
              <TrendingUp size={28} color="#10B981" />
            </View>
            <View style={styles.growthIndicator}>
              {isPositiveGrowth ? (
                <TrendingUp size={16} color="#10B981" />
              ) : (
                <TrendingDown size={16} color="#EF4444" />
              )}
              <Text
                style={[
                  styles.growthText,
                  { color: isPositiveGrowth ? "#10B981" : "#EF4444" },
                ]}
              >
                {isPositiveGrowth ? "+" : ""}
                {growthPercentage}%
              </Text>
            </View>
          </View>

          <Text style={styles.totalAmount}>
            {showBalance
              ? `₹${currentData.totalEarnings.toLocaleString()}`
              : "₹••,•••"}
          </Text>
          <Text style={styles.totalLabel}>
            Total {selectedPeriod === "day" ? "today" : selectedPeriod} earnings
          </Text>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>
                {showBalance ? currentData.deliveries : "••"}
              </Text>
              <Text style={styles.quickStatLabel}>Deliveries</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>
                {showBalance
                  ? `₹${Math.round(currentData.averagePerDelivery)}`
                  : "₹••"}
              </Text>
              <Text style={styles.quickStatLabel}>Avg/Delivery</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>
                {showBalance
                  ? `${
                      Math.round(
                        (currentData.deliveries /
                          (selectedPeriod === "day"
                            ? 12
                            : selectedPeriod === "week"
                            ? 7
                            : 30)) *
                          10
                      ) / 10
                    }`
                  : "•.•"}
              </Text>
              <Text style={styles.quickStatLabel}>
                {selectedPeriod === "day" ? "Per Hour" : "Per Day"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Weekly Chart (only show for week period) */}
        {selectedPeriod === "week" && (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <BarChart3 size={20} color="#2563EB" />
              <Text style={styles.chartTitle}>Daily Breakdown</Text>
            </View>
            <View style={styles.chart}>
              <FlatList
                data={weeklyChartData}
                renderItem={renderChartBar}
                keyExtractor={(item) => item.day}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chartContainer}
              />
            </View>
          </View>
        )}

        {/* Earnings Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>

          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownIcon}>
                <Package size={20} color="#2563EB" />
              </View>
              <Text style={styles.breakdownNumber}>
                {showBalance
                  ? `₹${currentData.baseEarnings.toLocaleString()}`
                  : "₹••,•••"}
              </Text>
              <Text style={styles.breakdownLabel}>Base Earnings</Text>
              <Text style={styles.breakdownPercentage}>
                {Math.round(
                  (currentData.baseEarnings / currentData.totalEarnings) * 100
                )}
                %
              </Text>
            </View>

            <View style={styles.breakdownCard}>
              <View style={styles.breakdownIcon}>
                <DollarSign size={20} color="#F59E0B" />
              </View>
              <Text style={styles.breakdownNumber}>
                {showBalance
                  ? `₹${currentData.tips.toLocaleString()}`
                  : "₹••,•••"}
              </Text>
              <Text style={styles.breakdownLabel}>Customer Tips</Text>
              <Text style={styles.breakdownPercentage}>
                {Math.round(
                  (currentData.tips / currentData.totalEarnings) * 100
                )}
                %
              </Text>
            </View>

            <View style={styles.breakdownCard}>
              <View style={styles.breakdownIcon}>
                <Gift size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.breakdownNumber}>
                {showBalance
                  ? `₹${currentData.bonuses.toLocaleString()}`
                  : "₹••,•••"}
              </Text>
              <Text style={styles.breakdownLabel}>Bonuses</Text>
              <Text style={styles.breakdownPercentage}>
                {Math.round(
                  (currentData.bonuses / currentData.totalEarnings) * 100
                )}
                %
              </Text>
            </View>

            <View style={styles.breakdownCard}>
              <View style={styles.breakdownIcon}>
                <Wallet size={20} color="#059669" />
              </View>
              <Text style={styles.breakdownNumber}>
                {showBalance
                  ? `₹${Math.round(
                      currentData.totalEarnings * 0.92
                    ).toLocaleString()}`
                  : "₹••,•••"}
              </Text>
              <Text style={styles.breakdownLabel}>After Commission</Text>
              <Text style={styles.breakdownPercentage}>92%</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>📊 Earnings Insights</Text>
          <View style={styles.insightItem}>
            <Clock size={16} color="#F59E0B" />
            <Text style={styles.insightText}>
              Peak earning hours:{" "}
              <Text style={styles.insightHighlight}>
                {currentData.peakHours}
              </Text>
            </Text>
          </View>
          <View style={styles.insightItem}>
            <MapPin size={16} color="#2563EB" />
            <Text style={styles.insightText}>
              Top location:{" "}
              <Text style={styles.insightHighlight}>
                {currentData.topLocation}
              </Text>
            </Text>
          </View>
          <View style={styles.insightItem}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.insightText}>
              {isPositiveGrowth ? "Earnings increased" : "Earnings decreased"}{" "}
              by{" "}
              <Text
                style={[
                  styles.insightHighlight,
                  { color: isPositiveGrowth ? "#10B981" : "#EF4444" },
                ]}
              >
                {Math.abs(parseFloat(growthPercentage))}%
              </Text>{" "}
              vs last {selectedPeriod}
            </Text>
          </View>
        </View>

        {/* Delivery History */}
        <View style={styles.historySection}>
          <View style={styles.historySectionHeader}>
            <Text style={styles.sectionTitle}>Recent Deliveries</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Filter size={16} color="#64748B" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={deliveryHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Withdraw Button */}
        <View style={styles.withdrawSection}>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={handleWithdraw}
            activeOpacity={0.9}
          >
            <Wallet size={24} color="#ffffff" />
            <Text style={styles.withdrawButtonText}>
              Withdraw ₹
              {showBalance
                ? currentData.totalEarnings.toLocaleString()
                : "••,•••"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.withdrawNote}>
            💡 Withdrawals are processed within 24 hours on business days
          </Text>
        </View>
      </ScrollView>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activePeriodButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  activePeriodButtonText: {
    color: "#ffffff",
  },
  mainEarningsCard: {
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  earningsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  earningsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  growthIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  growthText: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 24,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  quickStat: {
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  chart: {
    height: 120,
  },
  chartContainer: {
    paddingHorizontal: 10,
    alignItems: "flex-end",
  },
  chartBarContainer: {
    alignItems: "center",
    marginHorizontal: 8,
    minWidth: 40,
  },
  chartAmount: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 4,
    fontWeight: "600",
  },
  chartBar: {
    width: 24,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginBottom: 8,
  },
  todayBar: {
    backgroundColor: "#2563EB",
  },
  chartDay: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  todayText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  breakdownSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  breakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  breakdownCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  breakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  breakdownNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 4,
  },
  breakdownPercentage: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  insightsCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  insightText: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
    lineHeight: 20,
  },
  insightHighlight: {
    fontWeight: "600",
    color: "#1E293B",
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  historySectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  historyCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  historyDateTime: {
    fontSize: 12,
    color: "#64748B",
  },
  earningsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  deliveryMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: "#DCFCE7",
  },
  cancelledBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  completedText: {
    color: "#166534",
  },
  cancelledText: {
    color: "#DC2626",
  },
  earningsBreakdown: {
    flexDirection: "row",
    gap: 8,
  },
  earningsDetail: {
    fontSize: 10,
    color: "#64748B",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tipDetail: {
    fontSize: 10,
    color: "#059669",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bonusDetail: {
    fontSize: 10,
    color: "#8B5CF6",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  withdrawSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  withdrawButton: {
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  withdrawButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  withdrawNote: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 16,
  },
});
