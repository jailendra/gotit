import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Clock,
  Coffee,
  DollarSign,
  Edit3,
  Moon,
  Plus,
  Settings,
  Sun,
  Target,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
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
interface ScheduleSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  earnings: number;
  hours: number;
  type: "peak" | "regular" | "late";
}

interface WeeklyStats {
  totalHours: number;
  projectedEarnings: number;
  peakHours: number;
  efficiency: number;
}

const { width, height } = Dimensions.get("window");

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SchedulePage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([
    {
      id: "1",
      day: "Mon",
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
      earnings: 680,
      hours: 8,
      type: "regular",
    },
    {
      id: "2",
      day: "Tue",
      startTime: "12:00",
      endTime: "21:00",
      isActive: true,
      earnings: 810,
      hours: 9,
      type: "peak",
    },
    {
      id: "3",
      day: "Wed",
      startTime: "08:00",
      endTime: "16:00",
      isActive: true,
      earnings: 640,
      hours: 8,
      type: "regular",
    },
    {
      id: "4",
      day: "Thu",
      startTime: "18:00",
      endTime: "23:00",
      isActive: false,
      earnings: 450,
      hours: 5,
      type: "late",
    },
    {
      id: "5",
      day: "Fri",
      startTime: "11:00",
      endTime: "20:00",
      isActive: true,
      earnings: 900,
      hours: 9,
      type: "peak",
    },
    {
      id: "6",
      day: "Sat",
      startTime: "10:00",
      endTime: "22:00",
      isActive: true,
      earnings: 1200,
      hours: 12,
      type: "peak",
    },
    {
      id: "7",
      day: "Sun",
      startTime: "14:00",
      endTime: "20:00",
      isActive: false,
      earnings: 480,
      hours: 6,
      type: "regular",
    },
  ]);

  // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Calculate weekly stats
  const calculateWeeklyStats = (): WeeklyStats => {
    const activeSlots = scheduleSlots.filter((slot) => slot.isActive);
    const totalHours = activeSlots.reduce((sum, slot) => sum + slot.hours, 0);
    const projectedEarnings = activeSlots.reduce(
      (sum, slot) => sum + slot.earnings,
      0
    );
    const peakHours = activeSlots
      .filter((slot) => slot.type === "peak")
      .reduce((sum, slot) => sum + slot.hours, 0);
    const efficiency = Math.round((peakHours / totalHours) * 100) || 0;

    return { totalHours, projectedEarnings, peakHours, efficiency };
  };

  const weeklyStats = calculateWeeklyStats();

  const getTimeIcon = (type: string) => {
    switch (type) {
      case "peak":
        return Sun;
      case "late":
        return Moon;
      default:
        return Coffee;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "peak":
        return "#F59E0B";
      case "late":
        return "#8B5CF6";
      default:
        return "#06B6D4";
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleSlotStatus = (id: string) => {
    setScheduleSlots((prev) =>
      prev.map((slot) =>
        slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
      )
    );
  };

  const deleteSlot = (id: string) => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure you want to remove this time slot?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setScheduleSlots((prev) => prev.filter((slot) => slot.id !== id));
          },
        },
      ]
    );
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const ScheduleSlotCard = ({ slot }: { slot: ScheduleSlot }) => {
    const TimeIcon = getTimeIcon(slot.type);
    const typeColor = getTypeColor(slot.type);

    return (
      <Animated.View
        style={[
          styles.slotCard,
          {
            opacity: slot.isActive ? 1 : 0.6,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={
            slot.isActive ? ["#ffffff", "#f8fafc"] : ["#f1f5f9", "#e2e8f0"]
          }
          style={styles.slotGradient}
        >
          <View style={styles.slotHeader}>
            <View style={styles.slotInfo}>
              <View style={styles.slotDay}>
                <Calendar size={18} color={typeColor} />
                <Text style={styles.slotDayText}>
                  {FULL_DAYS[DAYS.indexOf(slot.day)]}
                </Text>
              </View>
              <View style={styles.slotTime}>
                <TimeIcon size={16} color={typeColor} />
                <Text style={styles.slotTimeText}>
                  {slot.startTime} - {slot.endTime}
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: typeColor + "20" },
                  ]}
                >
                  <Text style={[styles.typeText, { color: typeColor }]}>
                    {slot.type.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.slotActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => toggleSlotStatus(slot.id)}
              >
                <Target
                  size={16}
                  color={slot.isActive ? "#10B981" : "#64748B"}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Edit3 size={16} color="#8B5CF6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => deleteSlot(slot.id)}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.slotStats}>
            <View style={styles.slotStat}>
              <DollarSign size={16} color="#10B981" />
              <Text style={styles.slotStatValue}>₹{slot.earnings}</Text>
              <Text style={styles.slotStatLabel}>Projected</Text>
            </View>
            <View style={styles.slotStat}>
              <Clock size={16} color="#3B82F6" />
              <Text style={styles.slotStatValue}>{slot.hours}h</Text>
              <Text style={styles.slotStatLabel}>Duration</Text>
            </View>
            <View style={styles.slotStat}>
              <Activity size={16} color="#F59E0B" />
              <Text style={styles.slotStatValue}>
                ₹{Math.round(slot.earnings / slot.hours)}
              </Text>
              <Text style={styles.slotStatLabel}>Per Hour</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.container}>
        {/* Ultra Premium Header */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={["#0F172A", "#1E293B", "#334155"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative Background */}
            <View style={styles.headerDecoration}>
              <View style={[styles.floatingCircle, styles.circle1]} />
              <View style={[styles.floatingCircle, styles.circle2]} />
            </View>

            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header Navigation */}
              <View style={styles.headerNav}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[
                      "rgba(255, 255, 255, 0.2)",
                      "rgba(255, 255, 255, 0.1)",
                    ]}
                    style={styles.backGradient}
                  >
                    <ArrowLeft size={20} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.headerTitle}>
                  <Text style={styles.pageTitle}>Schedule Manager</Text>
                  <Text style={styles.pageSubtitle}>
                    Plan your optimal driving hours
                  </Text>
                </View>

                <TouchableOpacity style={styles.settingsButton}>
                  <Settings size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {/* Weekly Overview Stats */}
              <View style={styles.weeklyOverview}>
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.15)",
                    "rgba(255, 255, 255, 0.05)",
                  ]}
                  style={styles.overviewGradient}
                >
                  <View style={styles.overviewStats}>
                    <View style={styles.overviewStat}>
                      <Clock size={20} color="#06B6D4" />
                      <Text style={styles.overviewValue}>
                        {weeklyStats.totalHours}h
                      </Text>
                      <Text style={styles.overviewLabel}>This Week</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.overviewStat}>
                      <DollarSign size={20} color="#10B981" />
                      <Text style={styles.overviewValue}>
                        ₹{weeklyStats.projectedEarnings}
                      </Text>
                      <Text style={styles.overviewLabel}>Projected</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.overviewStat}>
                      <TrendingUp size={20} color="#F59E0B" />
                      <Text style={styles.overviewValue}>
                        {weeklyStats.efficiency}%
                      </Text>
                      <Text style={styles.overviewLabel}>Efficiency</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </Animated.View>
          </LinearGradient>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Day Filter Tabs */}
          <Animated.View
            style={[
              styles.dayTabs,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
            >
              {DAYS.map((day, index) => {
                const isSelected = day === selectedDay;
                const daySlots = scheduleSlots.filter(
                  (slot) => slot.day === day && slot.isActive
                );
                const dayEarnings = daySlots.reduce(
                  (sum, slot) => sum + slot.earnings,
                  0
                );

                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayTab, isSelected && styles.selectedDayTab]}
                    onPress={() => setSelectedDay(day)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={
                        isSelected
                          ? ["#8B5CF6", "#6366F1"]
                          : ["#ffffff", "#f8fafc"]
                      }
                      style={styles.tabGradient}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </Text>
                      <Text
                        style={[
                          styles.dayEarnings,
                          isSelected && styles.selectedDayEarnings,
                        ]}
                      >
                        ₹{dayEarnings}
                      </Text>
                      {daySlots.length > 0 && (
                        <View
                          style={[
                            styles.dayIndicator,
                            {
                              backgroundColor: isSelected
                                ? "#ffffff"
                                : "#10B981",
                            },
                          ]}
                        />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Schedule Slots */}
          <Animated.View
            style={[
              styles.scheduleSlotsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {FULL_DAYS[DAYS.indexOf(selectedDay)]} Schedule
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#8B5CF6", "#6366F1"]}
                  style={styles.addGradient}
                >
                  <Plus size={18} color="#ffffff" />
                  <Text style={styles.addText}>Add Slot</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {scheduleSlots
              .filter((slot) => slot.day === selectedDay)
              .map((slot) => (
                <ScheduleSlotCard key={slot.id} slot={slot} />
              ))}

            {scheduleSlots.filter((slot) => slot.day === selectedDay).length ===
              0 && (
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={["#F8FAFC", "#E2E8F0"]}
                  style={styles.emptyGradient}
                >
                  <Calendar size={48} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>No Schedule Set</Text>
                  <Text style={styles.emptySubtitle}>
                    Add your first time slot for{" "}
                    {FULL_DAYS[DAYS.indexOf(selectedDay)]}
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyAction}
                    onPress={() => setModalVisible(true)}
                  >
                    <LinearGradient
                      colors={["#8B5CF6", "#6366F1"]}
                      style={styles.emptyActionGradient}
                    >
                      <Plus size={20} color="#ffffff" />
                      <Text style={styles.emptyActionText}>
                        Create Schedule
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
          </Animated.View>

          {/* Smart Insights */}
          <Animated.View
            style={[
              styles.insightsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Smart Insights</Text>

            <View style={styles.insightCard}>
              <LinearGradient
                colors={["#EDE9FE", "#DDD6FE"]}
                style={styles.insightGradient}
              >
                <Zap size={24} color="#8B5CF6" />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>
                    Peak Hour Optimization
                  </Text>
                  <Text style={styles.insightText}>
                    Schedule more hours during 12-2 PM & 7-9 PM for +40%
                    earnings boost
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.insightCard}>
              <LinearGradient
                colors={["#DCFCE7", "#BBF7D0"]}
                style={styles.insightGradient}
              >
                <Target size={24} color="#10B981" />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Weekly Goal Progress</Text>
                  <Text style={styles.insightText}>
                    You're {Math.round((weeklyStats.totalHours / 40) * 100)}%
                    towards your 40-hour weekly target
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Add Schedule Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={20} style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={["#ffffff", "#f8fafc"]}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Schedule</Text>
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSubtitle}>
                  Create a new time slot for{" "}
                  {FULL_DAYS[DAYS.indexOf(selectedDay)]}
                </Text>

                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => {
                    // Add logic to create new schedule slot
                    setModalVisible(false);
                    Alert.alert("Success", "Schedule slot created!");
                  }}
                >
                  <LinearGradient
                    colors={["#8B5CF6", "#6366F1"]}
                    style={styles.modalActionGradient}
                  >
                    <Plus size={20} color="#ffffff" />
                    <Text style={styles.modalActionText}>Create Schedule</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </BlurView>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // ULTRA PREMIUM HEADER STYLES
  headerWrapper: {
    position: "relative",
    overflow: "hidden",
  },
  headerGradient: {
    paddingBottom: 24,
    position: "relative",
  },
  headerDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  floatingCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.08,
  },
  circle1: {
    width: 250,
    height: 250,
    backgroundColor: "#8B5CF6",
    top: -125,
    right: -75,
  },
  circle2: {
    width: 180,
    height: 180,
    backgroundColor: "#06B6D4",
    top: 50,
    left: -90,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    position: "relative",
    zIndex: 10,
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backGradient: {
    padding: 12,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 4,
    opacity: 0.9,
  },
  settingsButton: {
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  weeklyOverview: {
    marginTop: 8,
  },
  overviewGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  overviewStat: {
    alignItems: "center",
    flex: 1,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  overviewLabel: {
    fontSize: 12,
    color: "#CBD5E1",
    fontWeight: "600",
    marginTop: 4,
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 16,
  },

  // CONTENT STYLES
  content: {
    flex: 1,
  },
  dayTabs: {
    marginVertical: 20,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayTab: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedDayTab: {
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  tabGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    minWidth: 80,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  selectedDayText: {
    color: "#ffffff",
  },
  dayEarnings: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
  selectedDayEarnings: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  dayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },

  // SCHEDULE SLOTS
  scheduleSlotsContainer: {
    paddingHorizontal: 20,
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
  addButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  addText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  slotCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  slotGradient: {
    padding: 20,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  slotInfo: {
    flex: 1,
  },
  slotDay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  slotDayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  slotTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slotTimeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  slotActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  slotStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 16,
  },
  slotStat: {
    alignItems: "center",
    flex: 1,
  },
  slotStatValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 4,
  },
  slotStatLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
  },

  // EMPTY STATE
  emptyState: {
    marginTop: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  emptyGradient: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#475569",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  emptyActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  // INSIGHTS
  insightsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  insightCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  insightGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
    lineHeight: 20,
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalGradient: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 18,
    color: "#64748B",
    fontWeight: "600",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalAction: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  modalActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  bottomSpacer: {
    height: 100,
  },
});
