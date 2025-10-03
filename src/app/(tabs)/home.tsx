import StatusToggle from "@/src/components/StatusToggle";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Award,
  Bell,
  Camera,
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  Package,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TodayStats {
  totalOrders: number;
  completedOrders: number;
  earnings: number;
  rating: number;
  efficiency: number;
  streak: number;
}

interface StatCardProps {
  icon: React.ComponentType<any>;
  value: string | number;
  label: string;
  color: string;
  trend?: number;
}

interface ActionButtonProps {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
  gradient: any;
}

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentHour] = useState(new Date().getHours());
  const [todayStats, setTodayStats] = useState<TodayStats>({
    totalOrders: 12,
    completedOrders: 10,
    earnings: 850,
    rating: 4.8,
    efficiency: 94,
    streak: 7,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const onlineAnim = useRef(new Animated.Value(0)).current;

  const inset = useSafeAreaInsets();

  const getGreeting = () => {
    if (currentHour < 6) return "Working late";
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    if (currentHour < 21) return "Good evening";
    return "Working late";
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setTodayStats((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 3),
        earnings: prev.earnings + Math.floor(Math.random() * 50),
      }));
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOnline]);

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    value,
    label,
    color,
    trend,
  }) => (
    <Animated.View
      style={[styles.statCard, { transform: [{ scale: pulseAnim }] }]}
    >
      <LinearGradient
        colors={[color + "15", color + "05"]}
        style={styles.statGradient}
      >
        <View style={styles.statHeader}>
          <Icon size={28} color={color} />
          {trend && (
            <View
              style={[styles.trendBadge, { backgroundColor: color + "20" }]}
            >
              <TrendingUp size={14} color={color} />
              <Text style={[styles.trendText, { color }]}>+{trend}%</Text>
            </View>
          )}
        </View>
        <Text style={styles.statNumber}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const ActionButton: React.FC<ActionButtonProps> = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    disabled = false,
    gradient,
  }) => (
    <Pressable
      style={[styles.actionButton, disabled && styles.disabledAction]}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={disabled ? ["#F1F5F9", "#E2E8F0"] : gradient}
        style={styles.actionGradient}
      >
        <View style={styles.actionIcon}>
          <Icon size={24} color={disabled ? "#94A3B8" : "#ffffff"} />
        </View>
        <View style={styles.actionContent}>
          <Text style={[styles.actionTitle, disabled && styles.disabledText]}>
            {title}
          </Text>
          <Text
            style={[styles.actionSubtitle, disabled && styles.disabledText]}
          >
            {subtitle}
          </Text>
        </View>
        <View style={styles.actionArrow}>
          <Navigation size={16} color={disabled ? "#94A3B8" : "#ffffff"} />
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <>
      {/* <StatusBar barStyle="light-content" backgroundColor="#131e42" /> */}
      {/* Glassmorphic Header */}
      <LinearGradient
        colors={["#141e30", "#243b55", "#141e30"]}
        style={[styles.headerGradient,{paddingTop: inset.top}]}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#2563eb", "#7c3aed"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>VP</Text>
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.greeting}>{getGreeting()} !!</Text>
              <Text style={styles.driverName}>Vishal Pandey</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/notification")}
          >
            <Bell size={20} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>

        <StatusToggle isOnline={isOnline} onToggle={toggleOnlineStatus} />
      </LinearGradient>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Smart Status Notice */}
        {!isOnline && (
          <Animated.View style={[styles.statusNotice, { opacity: fadeAnim }]}>
            <BlurView intensity={20} style={styles.noticeBlur}>
              <LinearGradient
                colors={["#FEF3C7", "#FDE68A"]}
                style={styles.noticeGradient}
              >
                <Zap size={20} color="#D97706" />
                <Text style={styles.noticeText}>
                  Ready to earn? Go online to start receiving premium delivery
                  requests
                </Text>
              </LinearGradient>
            </BlurView>
          </Animated.View>
        )}

        {/* Enhanced Stats with Glassmorphism */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Performance</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              icon={Package}
              value={todayStats.totalOrders}
              label="Orders"
              color="#3B82F6"
            />
            <StatCard
              icon={Clock}
              value={todayStats.completedOrders}
              label="Completed"
              color="#10B981"
            />
            <StatCard
              icon={DollarSign}
              value={`₹${todayStats.earnings}`}
              label="Earnings"
              color="#F59E0B"
            />
            <StatCard
              icon={Star}
              value={todayStats.rating}
              label="Rating"
              color="#EF4444"
            />
            <StatCard
              icon={Target}
              value={`${todayStats.efficiency}%`}
              label="Efficiency"
              color="#8B5CF6"
            />
            <StatCard
              icon={Award}
              value={`${todayStats.streak} days`}
              label="Streak"
              color="#06B6D4"
            />
          </View>
        </Animated.View>

        {/* Premium Quick Actions */}
        <Animated.View
          style={[
            styles.quickActions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <ActionButton
            icon={MapPin}
            title="Find Deliveries"
            subtitle={
              isOnline
                ? "3 high-value orders nearby"
                : "Go online to see opportunities"
            }
            onPress={() => router.push("/(tabs)/deliveries")}
            disabled={!isOnline}
            gradient={["#3B82F6", "#1D4ED8"]}
          />

          <ActionButton
            icon={DollarSign}
            title="Earnings Hub"
            subtitle="Track income, bonuses"
            onPress={() => router.push("/(tabs)/earnings")}
            gradient={["#10B981", "#059669"]}
          />

          <ActionButton
            icon={Camera}
            title="Quick Verification"
            subtitle="Stay verified, stay trusted"
            onPress={() => router.push("/verification?type=manual")}
            gradient={["#F59E0B", "#D97706"]}
          />
        </Animated.View>

        {/* Live Status with Enhanced Design */}
        {isOnline && (
          <Animated.View
            style={[
              styles.liveStatus,
              {
                opacity: fadeAnim,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["#DCFCE7", "#BBF7D0"]}
              style={styles.liveGradient}
            >
              <View style={styles.liveContent}>
                <Animated.View
                  style={[
                    styles.liveIndicator,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
                <Text style={styles.liveText}>
                  🚀 You're live and optimized for premium deliveries
                </Text>
                <Text style={styles.liveSubtext}>
                  Earning potential: ₹120-180/hour
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    shadowColor: "#131e42",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toggleContainer: {
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#131e42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  greeting: {
    fontSize: 16,
    color: "#CBD5E1",
    fontWeight: "500",
  },
  driverName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 2,
  },
  performanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  performanceEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  headerActions: {
    alignItems: "flex-end",
    gap: 12,
  },
  notificationButton: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    fontWeight: "700",
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    marginLeft: 4,
  },
  statusNotice: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  noticeBlur: {
    borderRadius: 20,
  },
  noticeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  noticeText: {
    color: "#92400E",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  statsContainer: {
    margin: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    borderRadius: 20,
    overflow: "hidden",
  },
  statGradient: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: "700",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  quickActions: {
    margin: 20,
  },
  actionButton: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledAction: {
    shadowOpacity: 0.05,
    elevation: 2,
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  disabledText: {
    color: "#94A3B8",
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  liveStatus: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  liveGradient: {
    padding: 20,
  },
  liveContent: {
    alignItems: "center",
  },
  liveText: {
    color: "#065F46",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  liveSubtext: {
    color: "#047857",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  insightsContainer: {
    margin: 20,
  },
  insightCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  insightGradient: {
    padding: 24,
    backgroundColor: "#ffffff",
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  insightEmoji: {
    fontSize: 32,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
  },
  insightSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 2,
  },
  insightStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  insightStat: {
    alignItems: "center",
  },
  insightStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
  },
  insightStatLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 4,
  },
  tipsContainer: {
    margin: 20,
  },
  tipCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tipGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  tipText: {
    color: "#5B21B6",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  bottomSpacer: {
    height: 40,
  },
});
