import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Activity,
  Award,
  Bell,
  Calendar,
  Camera,
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  Package,
  Power,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// TypeScript interfaces
interface TodayStats {
  totalOrders: number;
  completedOrders: number;
  earnings: number;
  rating: number;
  efficiency: number;
  streak: number;
}

interface PerformanceLevel {
  level: string;
  color: string;
  icon: string;
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

const { width, height } = Dimensions.get("window");

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

  // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const onlineAnim = useRef(new Animated.Value(0)).current;

  // Smart greeting based on time
  const getGreeting = () => {
    if (currentHour < 6) return "Working late";
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    if (currentHour < 21) return "Good evening";
    return "Working late";
  };

  // Performance level calculation
  const getPerformanceLevel = (): PerformanceLevel => {
    const score =
      todayStats.rating * 20 +
      todayStats.efficiency * 0.5 +
      todayStats.streak * 2;
    if (score >= 140) return { level: "Elite", color: "#8B5CF6", icon: "👑" };
    if (score >= 120) return { level: "Expert", color: "#10B981", icon: "⚡" };
    if (score >= 100) return { level: "Pro", color: "#F59E0B", icon: "🔥" };
    return { level: "Rising", color: "#3B82F6", icon: "🚀" };
  };

  const performance = getPerformanceLevel();

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    // Animated feedback
    Animated.sequence([
      Animated.timing(onlineAnim, {
        toValue: newStatus ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(onlineAnim, {
        toValue: newStatus ? 1 : 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();

    // Haptic feedback simulation
    if (newStatus) {
      startPulseAnimation();
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const triggerRandomVerification = () => {
    Alert.alert(
      "🔐 Security Verification",
      "Quick identity check required. This keeps your account secure and maintains platform trust.",
      [
        { text: "Later", style: "cancel" },
        {
          text: "Verify Now",
          style: "default",
          onPress: () =>
            router.push({
              pathname: "/verification",
              params: { type: "random" },
            }),
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
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
    // Enhanced entrance animation
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

    // Smart verification logic
    if (isOnline) {
      const verificationTimer = setTimeout(() => {
        const shouldVerify = Math.random() > 0.85; // 15% chance
        if (shouldVerify && todayStats.totalOrders > 5) {
          triggerRandomVerification();
        }
      }, 45000);

      return () => clearTimeout(verificationTimer);
    }
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
    <TouchableOpacity
      style={[styles.actionButton, disabled && styles.disabledAction]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
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
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Glassmorphic Header */}
        <LinearGradient
          colors={["#1E293B", "#334155", "#475569"]}
          style={styles.headerGradient}
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
                  colors={["#8B5CF6", "#EC4899"]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>VP</Text>
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.greeting}>{getGreeting()},</Text>
                <Text style={styles.driverName}>Vishal Pandey</Text>
                <View style={styles.performanceBadge}>
                  <Text style={styles.performanceEmoji}>
                    {performance.icon}
                  </Text>
                  <Text style={styles.performanceText}>
                    {performance.level} Driver
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => router.push("/notification")}
              >
                <Bell size={20} color="#ffffff" />
              </TouchableOpacity>
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: onlineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    isOnline ? styles.onlineButton : styles.offlineButton,
                  ]}
                  onPress={toggleOnlineStatus}
                >
                  <Power size={18} color="#ffffff" />
                  <Text style={styles.statusText}>
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </Text>
                  {isOnline && <View style={styles.liveIndicator} />}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </LinearGradient>

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
            <TouchableOpacity style={styles.sectionAction}>
              <Activity size={16} color="#8B5CF6" />
              <Text style={styles.sectionActionText}>Details</Text>
            </TouchableOpacity>
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

          <ActionButton
            icon={Calendar}
            title="Schedule Manager"
            subtitle="Plan your driving hours"
            onPress={() => router.push("/schedule")}
            gradient={["#8B5CF6", "#7C3AED"]}
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

        {/* Performance Insights */}
        <Animated.View
          style={[
            styles.insightsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Performance Insights</Text>

          <View style={styles.insightCard}>
            <LinearGradient
              colors={[performance.color + "15", performance.color + "05"]}
              style={styles.insightGradient}
            >
              <View style={styles.insightHeader}>
                <Text style={styles.insightEmoji}>{performance.icon}</Text>
                <View>
                  <Text style={styles.insightTitle}>
                    {performance.level} Performance
                  </Text>
                  <Text style={styles.insightSubtitle}>
                    Top {performance.level === "Elite" ? "5" : "15"}% of drivers
                  </Text>
                </View>
              </View>

              <View style={styles.insightStats}>
                <View style={styles.insightStat}>
                  <Text style={styles.insightStatValue}>
                    {todayStats.efficiency}%
                  </Text>
                  <Text style={styles.insightStatLabel}>Efficiency</Text>
                </View>
                <View style={styles.insightStat}>
                  <Text style={styles.insightStatValue}>
                    {todayStats.streak}
                  </Text>
                  <Text style={styles.insightStatLabel}>Day Streak</Text>
                </View>
                <View style={styles.insightStat}>
                  <Text style={styles.insightStatValue}>
                    ₹
                    {Math.round(
                      todayStats.earnings / todayStats.completedOrders
                    )}
                  </Text>
                  <Text style={styles.insightStatLabel}>Avg/Order</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Smart Tips */}
        <Animated.View
          style={[
            styles.tipsContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Smart Tips</Text>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={["#EDE9FE", "#DDD6FE"]}
              style={styles.tipGradient}
            >
              <Zap size={20} color="#8B5CF6" />
              <Text style={styles.tipText}>
                Peak hours 12-2 PM & 7-9 PM. Earnings potential +40% during
                these times!
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    position: "relative",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
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
