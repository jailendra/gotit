import { router } from "expo-router";
import {
  Award,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Settings,
  Target,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";

// TypeScript interfaces
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
}

const staticNotifications: Notification[] = [
  {
    id: "1",
    title: "Daily Target Achieved! 🎉",
    message:
      "Congratulations! You've earned ₹850 today and exceeded your daily target by 15%.",
    time: "2 hours ago",
    read: false,
    icon: DollarSign,
    color: "#10B981",
  },
  {
    id: "2",
    title: "Premium Delivery Available",
    message:
      "High-value order (₹180) available 2.3 km away. Restaurant: The Food Court, Sector 62.",
    time: "4 hours ago",
    read: false,
    icon: MapPin,
    color: "#3B82F6",
  },
  {
    id: "3",
    title: "Elite Driver Status Unlocked! 👑",
    message:
      "Your consistent 4.8+ rating has earned you Elite status. Enjoy priority order access!",
    time: "1 day ago",
    read: true,
    icon: Award,
    color: "#8B5CF6",
  },
  {
    id: "4",
    title: "Peak Hours Starting Soon",
    message:
      "Lunch rush begins in 30 minutes. Position yourself in high-demand areas for maximum earnings.",
    time: "1 day ago",
    read: true,
    icon: Clock,
    color: "#F59E0B",
  },
  {
    id: "5",
    title: "Weekly Performance Summary",
    message:
      "This week: 67 deliveries completed, ₹5,240 earned, 4.9★ average rating. Great work!",
    time: "2 days ago",
    read: true,
    icon: Target,
    color: "#06B6D4",
  },
  {
    id: "6",
    title: "Bonus Earned: Efficiency Master",
    message:
      "Your 94% efficiency rate this week earned you a ₹200 bonus. Keep up the excellent work!",
    time: "3 days ago",
    read: true,
    icon: Zap,
    color: "#EF4444",
  },
  {
    id: "7",
    title: "App Update Available",
    message:
      "Version 2.1.0 includes improved navigation and better earnings tracking. Update now.",
    time: "5 days ago",
    read: true,
    icon: Settings,
    color: "#64748B",
  },
  {
    id: "8",
    title: "7-Day Streak Achievement! 🔥",
    message:
      "You've maintained consistent performance for 7 days straight. Streak bonus: ₹150",
    time: "1 week ago",
    read: true,
    icon: Calendar,
    color: "#F97316",
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>(staticNotifications);
  const [refreshing, setRefreshing] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onPress,
  }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !notification.read && styles.unreadCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: notification.color + "15" },
          ]}
        >
          <notification.icon size={24} color={notification.color} />
        </View>

        <View style={styles.textContent}>
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.notificationTitle,
                !notification.read && styles.unreadTitle,
              ]}
            >
              {notification.title}
            </Text>
            <Text style={styles.timeText}>{notification.time}</Text>
          </View>

          <Text style={styles.notificationMessage}>{notification.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#131e42" />

      {/* Header */}
      <Header title="Notifications" showBack onBack={() => router.back()} />

      {/* Notifications List */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
            colors={["#8B5CF6"]}
          />
        }
      >
        <Animated.View
          style={[
            styles.notificationsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={() => markAsRead(notification.id)}
            />
          ))}
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
  scrollContent: {
    flexGrow: 1,
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
  },
  headerBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  headerBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 44,
  },
  notificationsContainer: {
    padding: 20,
  },
  notificationCard: {
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  unreadCard: {
    shadowOpacity: 0.12,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    padding: 20,
    alignItems: "flex-start",
    gap: 16,
    position: "relative",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
    marginRight: 12,
  },
  unreadTitle: {
    fontWeight: "700",
    color: "#1E293B",
  },
  timeText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    fontWeight: "400",
  },
  unreadDot: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});
