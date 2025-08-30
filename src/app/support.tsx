import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Headset,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SupportPage = () => {
  const router = useRouter();

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleEmailPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const email = "support@delivery.com";
    const subject = "Support Request - Delivery App";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to open email client");
    }
  };

  const handlePhonePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const phoneNumber = "+919876543210";
    const url = `tel:${phoneNumber}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to make phone call");
    }
  };

  const handleChatPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Live Chat",
      "Live chat feature will be available soon. For now, please use email or phone support.",
      [{ text: "OK", style: "default" }]
    );
  };

  const handleFAQPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "FAQ",
      "FAQ section will be available soon. Please contact support for immediate assistance.",
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconWrapper}>
            <Headset size={64} color="#2563EB" />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            Our support team is available 24/7 to assist you with any questions
            or issues
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleEmailPress}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Mail size={24} color="#2563EB" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Email Support</Text>
              <Text style={styles.actionSubtitle}>support@delivery.com</Text>
              <Text style={styles.actionDescription}>
                Get detailed help via email. We typically respond within 2-4
                hours.
              </Text>
            </View>
            <ExternalLink size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handlePhonePress}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Phone size={24} color="#059669" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Phone Support</Text>
              <Text style={styles.actionSubtitle}>+91 98765 43210</Text>
              <Text style={styles.actionDescription}>
                Speak directly with our support team for urgent issues.
              </Text>
            </View>
            <ExternalLink size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleChatPress}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <MessageCircle size={24} color="#7C3AED" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Live Chat</Text>
              <Text style={styles.actionSubtitle}>Available 24/7</Text>
              <Text style={styles.actionDescription}>
                Chat with our support agents in real-time.
              </Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Hours */}
        <View style={styles.hoursCard}>
          <View style={styles.hoursHeader}>
            <Clock size={20} color="#F59E0B" />
            <Text style={styles.hoursTitle}>Support Hours</Text>
          </View>
          <View style={styles.hoursContent}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Monday - Friday</Text>
              <Text style={styles.hoursTime}>9:00 AM - 11:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Saturday - Sunday</Text>
              <Text style={styles.hoursTime}>10:00 AM - 10:00 PM</Text>
            </View>
            <Text style={styles.hoursNote}>
              Emergency support available 24/7 via phone
            </Text>
          </View>
        </View>

        {/* Additional Help */}
        <View style={styles.additionalHelp}>
          <Text style={styles.sectionTitle}>More Help</Text>

          <TouchableOpacity
            style={styles.helpOption}
            onPress={handleFAQPress}
            activeOpacity={0.8}
          >
            <HelpCircle size={20} color="#64748B" />
            <Text style={styles.helpOptionText}>
              Frequently Asked Questions
            </Text>
            <ArrowLeft
              size={16}
              color="#94A3B8"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
        </View>

        {/* Emergency Notice */}
        <View style={styles.emergencyNotice}>
          <Text style={styles.emergencyTitle}>
            🚨 Emergency Delivery Issues?
          </Text>
          <Text style={styles.emergencyText}>
            For urgent delivery problems (lost orders, safety concerns, etc.),
            please call our emergency hotline immediately.
          </Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              Linking.openURL("tel:+919876543210");
            }}
          >
            <Phone size={18} color="#ffffff" />
            <Text style={styles.emergencyButtonText}>Emergency Hotline</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SupportPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  comingSoonBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D97706",
  },
  hoursCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  hoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  hoursContent: {
    gap: 8,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  hoursDay: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  hoursTime: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
  },
  hoursNote: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  additionalHelp: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  helpOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  helpOptionText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  emergencyNotice: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 8,
    textAlign: "center",
  },
  emergencyText: {
    fontSize: 14,
    color: "#7F1D1D",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
