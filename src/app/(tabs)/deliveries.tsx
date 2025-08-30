import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Navigation,
  Package,
  Star,
  TrendingUp,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
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
  priority: "high" | "medium" | "low";
  rating: number;
  tips?: number;
  isUrgent?: boolean;
}

type SortOption = "earning" | "distance" | "time" | "rating";
type FilterOption = "all" | "high-pay" | "nearby" | "urgent";

const { width } = Dimensions.get("window");

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
      timeRemaining: 180,
      priority: "medium",
      rating: 4.2,
      tips: 15,
    },
    {
      id: "2",
      merchantName: "Pizza Hut",
      pickupAddress: "DLF Mall, Gurgaon",
      dropoffAddress: "Golf Course Road",
      estimatedEarning: 125,
      distance: 4.2,
      estimatedTime: 35,
      orderValue: 780,
      timeRemaining: 45,
      priority: "high",
      rating: 4.8,
      tips: 25,
      isUrgent: true,
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
      timeRemaining: 300,
      priority: "low",
      rating: 4.0,
    },
    {
      id: "4",
      merchantName: "KFC",
      pickupAddress: "Cyber Hub, Gurgaon",
      dropoffAddress: "MG Road Metro",
      estimatedEarning: 95,
      distance: 3.1,
      estimatedTime: 28,
      orderValue: 650,
      timeRemaining: 120,
      priority: "high",
      rating: 4.5,
      tips: 20,
    },
    {
      id: "5",
      merchantName: "Subway",
      pickupAddress: "Select City Walk",
      dropoffAddress: "Saket Metro",
      estimatedEarning: 55,
      distance: 2.0,
      estimatedTime: 22,
      orderValue: 380,
      timeRemaining: 240,
      priority: "medium",
      rating: 4.1,
    },
  ]);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("earning");
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");
  const [animatedValues] = useState(() =>
    availableOrders.reduce((acc, order) => {
      acc[order.id] = new Animated.Value(1);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  );

  // Update timer countdown
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

  // Remove expired orders
  useEffect(() => {
    const expiredOrders = availableOrders.filter(
      (order) => order.timeRemaining === 0
    );
    if (expiredOrders.length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setAvailableOrders((prev) =>
        prev.filter((order) => order.timeRemaining > 0)
      );
    }
  }, [availableOrders]);

  // Filter and sort orders
  const processedOrders = useMemo(() => {
    let filtered = [...availableOrders];

    // Apply filters
    switch (selectedFilter) {
      case "high-pay":
        filtered = filtered.filter((order) => order.estimatedEarning >= 80);
        break;
      case "nearby":
        filtered = filtered.filter((order) => order.distance <= 3);
        break;
      case "urgent":
        filtered = filtered.filter(
          (order) => order.isUrgent || order.timeRemaining <= 60
        );
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "earning":
          return b.estimatedEarning - a.estimatedEarning;
        case "distance":
          return a.distance - b.distance;
        case "time":
          return a.estimatedTime - b.estimatedTime;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableOrders, selectedFilter, selectedSort]);

  const acceptOrder = useCallback(
    async (orderId: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert(
        "🚀 Accept Delivery",
        "Ready to start earning? This order will be added to your active deliveries.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
          },
          {
            text: "Accept & Start",
            style: "default",
            onPress: async () => {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );

              // Animate out the accepted order
              if (animatedValues[orderId]) {
                Animated.timing(animatedValues[orderId], {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }

              setTimeout(() => {
                setAvailableOrders((prev) =>
                  prev.filter((order) => order.id !== orderId)
                );
                router.push(`/delivery/${orderId}`);
              }, 300);
            },
          },
        ]
      );
    },
    [animatedValues]
  );

  const rejectOrder = useCallback(
    async (orderId: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Animate out the rejected order
      if (animatedValues[orderId]) {
        Animated.timing(animatedValues[orderId], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }

      setTimeout(() => {
        setAvailableOrders((prev) =>
          prev.filter((order) => order.id !== orderId)
        );
      }, 200);
    },
    [animatedValues]
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#64748B";
    }
  };

  const getUrgencyStyle = (order: DeliveryOrder) => {
    if (order.isUrgent || order.timeRemaining <= 60) {
      return {
        borderLeftWidth: 4,
        borderLeftColor: "#EF4444",
        backgroundColor: "#FEF2F2",
      };
    }
    return {};
  };

  const handleFilterPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilterModalVisible(true);
  };

  const applyFilter = async (filter: FilterOption, sort: SortOption) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFilter(filter);
    setSelectedSort(sort);
    setFilterModalVisible(false);
  };

  const renderOrderCard = ({ item }: { item: DeliveryOrder }) => {
    if (!animatedValues[item.id]) {
      animatedValues[item.id] = new Animated.Value(1);
    }

    return (
      <Animated.View
        style={[
          {
            opacity: animatedValues[item.id],
            transform: [
              {
                scale: animatedValues[item.id],
              },
            ],
          },
        ]}
      >
        <View style={[styles.orderCard, getUrgencyStyle(item)]}>
          {/* Priority Badge */}
          <View style={styles.badges}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(item.priority) },
              ]}
            >
              <Text style={styles.priorityText}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
            {item.isUrgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
          </View>

          <View style={styles.orderHeader}>
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName}>{item.merchantName}</Text>
              <View style={styles.ratingRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <View
              style={[
                styles.timer,
                item.timeRemaining <= 60 && styles.urgentTimer,
              ]}
            >
              <Clock
                size={16}
                color={item.timeRemaining <= 60 ? "#FFFFFF" : "#EF4444"}
              />
              <Text
                style={[
                  styles.timerText,
                  item.timeRemaining <= 60 && styles.urgentTimerText,
                ]}
              >
                {formatTime(item.timeRemaining)}
              </Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <MapPin size={16} color="#10B981" />
              <Text style={styles.locationText}>
                Pickup: {item.pickupAddress}
              </Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationRow}>
              <MapPin size={16} color="#EF4444" />
              <Text style={styles.locationText}>
                Drop-off: {item.dropoffAddress}
              </Text>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.detailItem}>
              <DollarSign size={16} color="#10B981" />
              <View>
                <Text style={styles.earningText}>₹{item.estimatedEarning}</Text>
                {item.tips && (
                  <Text style={styles.tipsText}>+₹{item.tips} tips</Text>
                )}
              </View>
            </View>
            <View style={styles.detailItem}>
              <Navigation size={16} color="#2563EB" />
              <Text style={styles.detailText}>{item.distance} km</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.detailText}>{item.estimatedTime} min</Text>
            </View>
            <View style={styles.detailItem}>
              <TrendingUp size={16} color="#8B5CF6" />
              <Text style={styles.detailText}>
                ₹{Math.round(item.estimatedEarning / item.estimatedTime)}/min
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => rejectOrder(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.rejectButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.acceptButton,
                item.priority === "high" && styles.highPriorityButton,
              ]}
              onPress={() => acceptOrder(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.acceptButtonText}>Accept & Go</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort Orders</Text>
            <TouchableOpacity
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilterModalVisible(false);
              }}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Filter by</Text>
            <View style={styles.filterOptions}>
              {[
                {
                  value: "all",
                  label: "All Orders",
                  count: availableOrders.length,
                },
                {
                  value: "high-pay",
                  label: "High Pay (₹80+)",
                  count: availableOrders.filter((o) => o.estimatedEarning >= 80)
                    .length,
                },
                {
                  value: "nearby",
                  label: "Nearby (≤3km)",
                  count: availableOrders.filter((o) => o.distance <= 3).length,
                },
                {
                  value: "urgent",
                  label: "Urgent Orders",
                  count: availableOrders.filter(
                    (o) => o.isUrgent || o.timeRemaining <= 60
                  ).length,
                },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    selectedFilter === option.value &&
                      styles.activeFilterOption,
                  ]}
                  onPress={async () => {
                    await Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light
                    );
                    setSelectedFilter(option.value as FilterOption);
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === option.value &&
                        styles.activeFilterText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.filterCount,
                      selectedFilter === option.value &&
                        styles.activeFilterCount,
                    ]}
                  >
                    {option.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Sort by</Text>
            <View style={styles.filterOptions}>
              {[
                { value: "earning", label: "Highest Earning", icon: "💰" },
                { value: "distance", label: "Closest Distance", icon: "📍" },
                { value: "time", label: "Fastest Delivery", icon: "⚡" },
                { value: "rating", label: "Best Rating", icon: "⭐" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    selectedSort === option.value && styles.activeSortOption,
                  ]}
                  onPress={async () => {
                    await Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light
                    );
                    setSelectedSort(option.value as SortOption);
                  }}
                >
                  <Text style={styles.sortIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.sortOptionText,
                      selectedSort === option.value && styles.activeSortText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => applyFilter(selectedFilter, selectedSort)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilter !== "all") count++;
    if (selectedSort !== "earning") count++;
    return count;
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
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
          <Text style={styles.title}>Available Orders</Text>
          <Text style={styles.subtitle}>
            {processedOrders.length} orders • ₹
            {processedOrders.reduce(
              (sum, order) => sum + order.estimatedEarning,
              0
            )}{" "}
            total
          </Text>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Filter size={20} color="#2563EB" />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {getActiveFiltersCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters Indicator */}
      {(selectedFilter !== "all" || selectedSort !== "earning") && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersText}>
            {selectedFilter !== "all" && `Filter: ${selectedFilter} • `}
            Sort: {selectedSort}
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedFilter("all");
              setSelectedSort("earning");
            }}
          >
            <Text style={styles.clearFilters}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {processedOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Package size={64} color="#94A3B8" />
          <Text style={styles.emptyTitle}>
            {selectedFilter === "all"
              ? "No deliveries available"
              : "No orders match your filters"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {selectedFilter === "all"
              ? "New orders will appear here when customers place them"
              : "Try adjusting your filters to see more orders"}
          </Text>
          {selectedFilter !== "all" && (
            <TouchableOpacity
              style={styles.resetFiltersButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedFilter("all");
                setSelectedSort("earning");
              }}
            >
              <Text style={styles.resetFiltersText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={processedOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          onRefresh={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Simulate refresh - in real app, this would fetch new orders
          }}
          refreshing={false}
        />
      )}

      {renderFilterModal()}
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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  filterButton: {
    position: "relative",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  filterBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  activeFilters: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#EEF2FF",
    borderBottomWidth: 1,
    borderBottomColor: "#C7D2FE",
  },
  activeFiltersText: {
    fontSize: 14,
    color: "#3730A3",
    fontWeight: "500",
  },
  clearFilters: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
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
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  resetFiltersButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
  resetFiltersText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  ordersList: {
    padding: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#DC2626",
  },
  urgentText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  urgentTimer: {
    backgroundColor: "#EF4444",
    borderColor: "#DC2626",
  },
  timerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EF4444",
  },
  urgentTimerText: {
    color: "#ffffff",
  },
  locationInfo: {
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
    marginLeft: 28,
  },
  locationText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
    fontWeight: "500",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  detailItem: {
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  earningText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
    textAlign: "center",
  },
  tipsText: {
    fontSize: 11,
    color: "#059669",
    textAlign: "center",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  acceptButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  highPriorityButton: {
    backgroundColor: "#059669",
    shadowColor: "#059669",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeFilterOption: {
    backgroundColor: "#EEF2FF",
    borderColor: "#2563EB",
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#475569",
  },
  activeFilterText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  filterCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeFilterCount: {
    backgroundColor: "#2563EB",
    color: "#ffffff",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  activeSortOption: {
    backgroundColor: "#EEF2FF",
    borderColor: "#2563EB",
  },
  sortIcon: {
    fontSize: 18,
  },
  sortOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#475569",
    flex: 1,
  },
  activeSortText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
