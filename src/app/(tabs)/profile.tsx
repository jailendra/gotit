import { router } from "expo-router";
import {
  Award,
  Bell,
  Camera,
  Car,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  CircleHelp as HelpCircle,
  LogOut,
  Mail,
  Phone,
  Settings,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { removeAuthToken } from "../../hooks/useAuthStorage";

export default function ProfileScreen() {
  const [driverInfo, setDriverInfo] = useState({
    name: "Vishal Pandey",
    phone: "+91 98765 43210",
    email: "vishal.pandey@gmail.com",
    rating: 4.9,
    totalDeliveries: 2850,
    vehicleType: "Motorcycle",
    vehicleNumber: "UP 32 AB 5678",
    licenseNumber: "UP1420110098765",
    joinedDate: "March 2022",
    currentStreak: 15,
    monthlyEarnings: "₹45,250",
    todayDeliveries: 12,
    isOnline: false,
    profileCompleteness: 95,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh driver data
    setTimeout(() => {
      setDriverInfo((prev) => ({
        ...prev,
        todayDeliveries: prev.todayDeliveries + Math.floor(Math.random() * 3),
        rating: Math.min(5, prev.rating + Math.random() * 0.1),
      }));
      setRefreshing(false);
    }, 1500);
  };

  const updatePhoto = () => {
    Alert.alert("Update Profile Photo", "Choose an option", [
      {
        text: "Camera",
        onPress: () => router.push("/verification?type=photo&mode=camera"),
      },
      {
        text: "Gallery",
        onPress: () => router.push("/verification?type=photo&mode=gallery"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // const editProfile = () => {
  //   router.push("/edit-profile");
  // };

  const viewDocuments = () => {
    // router.push("/documents");
    Alert.alert("Comming soon !!!");
  };

  const viewEarnings = () => {
    router.push("/earnings");
  };

  const openSettings = () => {
    // router.push("/settings");
    Alert.alert("Comming soon !!!");
  };

  const openNotifications = () => {
    router.push("/notification");
  };

  const managePayments = () => {
    // router.push("/payments");
    Alert.alert("Comming soon !!!");
  };

  const getHelp = () => {
    router.push("/support");
  };

  const logout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout? You'll need to sign in again to continue delivering.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await removeAuthToken();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const triggerManualVerification = () => {
    Alert.alert(
      "Manual Verification",
      "This will start a manual identity verification process. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () => router.push("/verification?type=manual&mode=identity"),
        },
      ]
    );
  };

  const getCompletionColor = (percentage: any) => {
    if (percentage >= 90) return "#10B981";
    if (percentage >= 70) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            {/* <TouchableOpacity style={styles.editButton} onPress={editProfile}>
              <Edit3 size={20} color="#2563EB" />
            </TouchableOpacity> */}
          </View>

          {/* Status Banner */}
          {/* <View
            style={[
              styles.statusBanner,
              driverInfo.isOnline ? styles.onlineBanner : styles.offlineBanner,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                driverInfo.isOnline ? styles.onlineDot : styles.offlineDot,
              ]}
            />
            <Text style={styles.statusText}>
              {driverInfo.isOnline
                ? "You're Online & Ready for Deliveries"
                : "You're Currently Offline"}
            </Text>
          </View> */}

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.photoContainer}>
                <Image
                  source={{
                    uri: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
                  }}
                  style={styles.profilePhoto}
                />
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={updatePhoto}
                >
                  <Camera size={14} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileDetails}>
                <Text style={styles.driverName}>{driverInfo.name}</Text>
                <Text style={styles.joinedDate}>
                  Member since {driverInfo.joinedDate}
                </Text>

                <View style={styles.ratingContainer}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{driverInfo.rating}</Text>
                  <Text style={styles.deliveryCount}>
                    • {driverInfo.totalDeliveries.toLocaleString()} deliveries
                  </Text>
                </View>
              </View>
            </View>

            {/* Profile Completion */}
            <View style={styles.completionCard}>
              <View style={styles.completionHeader}>
                <Text style={styles.completionTitle}>Profile Completion</Text>
                <Text
                  style={[
                    styles.completionPercentage,
                    {
                      color: getCompletionColor(driverInfo.profileCompleteness),
                    },
                  ]}
                >
                  {driverInfo.profileCompleteness}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${driverInfo.profileCompleteness}%`,
                      backgroundColor: getCompletionColor(
                        driverInfo.profileCompleteness
                      ),
                    },
                  ]}
                />
              </View>
              {driverInfo.profileCompleteness < 100 && (
                <Text style={styles.completionHint}>
                  Complete your profile to unlock premium features
                </Text>
              )}
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.statValue}>{driverInfo.monthlyEarnings}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>

            <View style={styles.statCard}>
              <Clock size={20} color="#2563EB" />
              <Text style={styles.statValue}>{driverInfo.todayDeliveries}</Text>
              <Text style={styles.statLabel}>Today's Trips</Text>
            </View>

            <View style={styles.statCard}>
              <Award size={20} color="#F59E0B" />
              <Text style={styles.statValue}>{driverInfo.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoCard}>
              <TouchableOpacity style={styles.infoItem}>
                <Phone size={20} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoText}>{driverInfo.phone}</Text>
                  <Text style={styles.infoSubtext}>Primary contact number</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.infoItem}>
                <Mail size={20} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoText}>{driverInfo.email}</Text>
                  <Text style={styles.infoSubtext}>
                    For account notifications
                  </Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Vehicle Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Car size={20} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoText}>{driverInfo.vehicleType}</Text>
                  <Text style={styles.infoSubtext}>
                    {driverInfo.vehicleNumber}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <FileText size={20} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoText}>Driving License</Text>
                  <Text style={styles.infoSubtext}>
                    {driverInfo.licenseNumber}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={viewEarnings}
              >
                <TrendingUp size={24} color="#10B981" />
                <Text style={styles.quickActionText}>Earnings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={viewDocuments}
              >
                <FileText size={24} color="#2563EB" />
                <Text style={styles.quickActionText}>Documents</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={openNotifications}
              >
                <Bell size={24} color="#F59E0B" />
                <Text style={styles.quickActionText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={managePayments}
              >
                <CreditCard size={24} color="#8B5CF6" />
                <Text style={styles.quickActionText}>Payments</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Account & Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account & Security</Text>

            <View style={styles.actionsList}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={triggerManualVerification}
              >
                <View style={styles.actionLeft}>
                  <View style={styles.iconContainer}>
                    <Shield size={20} color="#10B981" />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionText}>Identity Verification</Text>
                    <Text style={styles.actionSubtext}>
                      Enhance account security
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={openSettings}
              >
                <View style={styles.actionLeft}>
                  <View style={styles.iconContainer}>
                    <Settings size={20} color="#64748B" />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionText}>App Settings</Text>
                    <Text style={styles.actionSubtext}>
                      Preferences & notifications
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={getHelp}>
                <View style={styles.actionLeft}>
                  <View style={styles.iconContainer}>
                    <HelpCircle size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionText}>Help & Support</Text>
                    <Text style={styles.actionSubtext}>
                      Get assistance 24/7
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  content: {
    flex: 1,
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  statusBanner: {
    margin: 20,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  onlineBanner: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  offlineBanner: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  onlineDot: {
    backgroundColor: "#10B981",
  },
  offlineDot: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  profileSection: {
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 10,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  photoContainer: {
    position: "relative",
    marginRight: 20,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#E2E8F0",
  },
  cameraButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  joinedDate: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F59E0B",
  },
  deliveryCount: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  completionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  completionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  completionPercentage: {
    fontSize: 16,
    fontWeight: "700",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  completionHint: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
  },
  statsGrid: {
    flexDirection: "row",
    margin: 20,
    marginTop: 0,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    textAlign: "center",
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 13,
    color: "#64748B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    minHeight: 100,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 8,
    textAlign: "center",
  },
  actionsList: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  actionSubtext: {
    fontSize: 13,
    color: "#64748B",
  },
  logoutButton: {
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
});
