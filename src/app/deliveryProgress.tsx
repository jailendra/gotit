import Header from "@/src/components/Header";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Camera,
  CheckCircle,
  Key,
  MapPin,
  Navigation,
  Package,
  Phone,
  Upload,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function DeliveryProgressScreen() {
  const [orderDetails] = useState({
    id: "ORD-2024-001",
    customerName: "Priya Sharma",
    customerPhone: "+91 87654 32109",
    dropoffAddress: "Golf Course Road, Block A, Gurgaon",
    dropoffLat: 28.4543,
    dropoffLng: 77.0458,
    specialInstructions: "Ring the bell twice. Apartment 401, 4th floor.",
    deliveryCode: "ABCD",
    estimatedEarning: 125,
    tips: 25,
  });

  const [deliveryCode, setDeliveryCode] = useState("");
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inset = useSafeAreaInsets();

  useEffect(() => {
    setIsCodeValid(deliveryCode.toUpperCase() === orderDetails.deliveryCode);
  }, [deliveryCode]);

  const markArrived = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setArrivalTime(new Date());
  };

  const startNavigation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const url = `https://www.google.com/maps/dir/?api=1&destination=${orderDetails.dropoffLat},${orderDetails.dropoffLng}&travelmode=driving`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Navigation Error", "Unable to open maps application");
    }
  };

  const callCustomer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Linking.openURL(`tel:${orderDetails.customerPhone}`);
    } catch (error) {
      Alert.alert("Call Error", "Unable to make phone call");
    }
  };

  const takeDeliveryPhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDeliveryPhoto(result.assets[0].uri);
    }
  };

  const uploadFromGallery = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDeliveryPhoto(result.assets[0].uri);
    }
  };

  const retakePhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDeliveryPhoto(null);
  };

  const completeDelivery = async () => {
    if (!isCodeValid) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Invalid Code",
        "Please enter the correct 4-letter delivery code"
      );
      return;
    }

    if (!deliveryPhoto) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Photo Required", "Please take a photo as proof of delivery");
      return;
    }

    setIsSubmitting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Simulate API call
    setTimeout(async () => {
      setIsSubmitting(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push("/deliveryComplete");
    }, 2500);
  };

  return (
    <View style={[styles.container, { paddingBottom: inset.bottom }]}>
      <Header
        title="Deliver Order"
        subtitle="Complete the delivery process"
        showBack
        style={{ paddingTop: inset.top }}
        onBack={() => router.back()}
        right={
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {arrivalTime ? "AT DROPOFF" : "EN ROUTE"}
            </Text>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#EF4444" />
            <Text style={styles.locationTitle}>Delivery Address</Text>
            <TouchableOpacity style={styles.callButton} onPress={callCustomer}>
              <Phone size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <Text style={styles.locationAddress}>
            {orderDetails.dropoffAddress}
          </Text>

          {!arrivalTime ? (
            <View style={styles.navigationSection}>
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={startNavigation}
              >
                <Navigation size={20} color="#ffffff" />
                <Text style={styles.navigationText}>Start Navigation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.arrivedButton}
                onPress={markArrived}
              >
                <CheckCircle size={18} color="#059669" />
                <Text style={styles.arrivedText}>Mark as Arrived</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.arrivedIndicator}>
              <CheckCircle size={18} color="#059669" />
              <Text style={styles.arrivedTime}>
                Arrived at {arrivalTime.toLocaleTimeString()}
              </Text>
            </View>
          )}
        </View>

        {/* Customer Information */}
        <View style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <User size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Customer Details</Text>
          </View>

          <Text style={styles.customerName}>{orderDetails.customerName}</Text>
          <Text style={styles.customerPhone}>
            📞 {orderDetails.customerPhone}
          </Text>

          {orderDetails.specialInstructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsLabel}>
                Special Instructions:
              </Text>
              <Text style={styles.instructionsText}>
                {orderDetails.specialInstructions}
              </Text>
            </View>
          )}
        </View>

        {/* Delivery Verification */}
        {arrivalTime && (
          <>
            {/* Delivery Code Input */}
            <View style={styles.codeCard}>
              <Text style={styles.cardTitle}>🔑 Enter Delivery Code</Text>
              <Text style={styles.codeSubtitle}>
                Ask customer for their 4-letter delivery code
              </Text>
              <View style={styles.codeInputContainer}>
                <Key size={20} color="#64748B" />
                <TextInput
                  style={[
                    styles.codeInput,
                    isCodeValid && styles.validCodeInput,
                    deliveryCode.length === 4 &&
                      !isCodeValid &&
                      styles.invalidCodeInput,
                  ]}
                  value={deliveryCode}
                  onChangeText={setDeliveryCode}
                  placeholder="Enter 4-letter code"
                  placeholderTextColor="#94A3B8"
                  maxLength={4}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {isCodeValid && <CheckCircle size={20} color="#059669" />}
              </View>

              {deliveryCode.length === 4 && !isCodeValid && (
                <Text style={styles.errorText}>
                  ❌ Incorrect code. Please verify with customer.
                </Text>
              )}

              {isCodeValid && (
                <Text style={styles.successText}>
                  ✅ Code verified! Proceed to take delivery photo.
                </Text>
              )}
            </View>
            <View style={styles.photoCard}>
              <Text style={styles.cardTitle}>📸 Delivery Proof</Text>
              <Text style={styles.photoSubtitle}>
                Take a photo of the delivered package or customer receiving it
              </Text>

              {!deliveryPhoto ? (
                <View style={styles.photoActions}>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={takeDeliveryPhoto}
                  >
                    <Camera size={24} color="#ffffff" />
                    <Text style={styles.cameraButtonText}>
                      Take Delivery Photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.galleryButton}
                    onPress={uploadFromGallery}
                  >
                    <Upload size={20} color="#2563EB" />
                    <Text style={styles.galleryButtonText}>
                      Upload from Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoPreview}>
                  <Image
                    source={{ uri: deliveryPhoto }}
                    style={styles.previewImage}
                  />
                  <View style={styles.photoActions}>
                    <TouchableOpacity
                      style={styles.retakeButton}
                      onPress={retakePhoto}
                    >
                      <X size={18} color="#EF4444" />
                      <Text style={styles.retakeText}>Retake</Text>
                    </TouchableOpacity>
                    <View style={styles.photoSuccess}>
                      <CheckCircle size={18} color="#059669" />
                      <Text style={styles.photoSuccessText}>Photo Ready</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* Delivery Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.cardTitle}>💡 Delivery Tips</Text>
          <Text style={styles.tipText}>• Be polite and professional</Text>
          <Text style={styles.tipText}>
            • Verify customer identity before handover
          </Text>
          <Text style={styles.tipText}>• Take clear photo evidence</Text>
          <Text style={styles.tipText}>
            • Follow special instructions carefully
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        {!arrivalTime ? (
          <TouchableOpacity
            style={styles.navigationMainButton}
            onPress={startNavigation}
          >
            <Navigation size={20} color="#ffffff" />
            <Text style={styles.navigationMainText}>Navigate to Customer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.completeButton,
              (!isCodeValid || !deliveryPhoto) && styles.disabledButton,
              isSubmitting && styles.submittingButton,
            ]}
            onPress={completeDelivery}
            disabled={!isCodeValid || !deliveryPhoto || isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.submittingContent}>
                <Package size={20} color="#ffffff" />
                <Text style={styles.submittingText}>
                  Completing Delivery...
                </Text>
              </View>
            ) : (
              <>
                <CheckCircle size={20} color="#ffffff" />
                <Text style={styles.completeButtonText}>Complete Delivery</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  statusBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  locationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  callButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  locationAddress: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 16,
    lineHeight: 22,
  },
  navigationSection: {
    gap: 12,
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  navigationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  arrivedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 6,
  },
  arrivedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  arrivedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  arrivedTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  customerCard: {
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
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  instructionsContainer: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 18,
  },
  codeCard: {
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
  codeSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  codeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  codeInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
    paddingVertical: 12,
    color: "#1E293B",
  },
  validCodeInput: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  invalidCodeInput: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 8,
    textAlign: "center",
  },
  successText: {
    fontSize: 14,
    color: "#059669",
    marginTop: 8,
    textAlign: "center",
  },
  photoCard: {
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
  photoSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
    lineHeight: 20,
  },
  photoActions: {
    gap: 12,
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  galleryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
  },
  photoPreview: {
    alignItems: "center",
  },
  previewImage: {
    width: width - 80,
    height: (width - 80) * 0.75,
    borderRadius: 12,
    marginBottom: 16,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 6,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  photoSuccess: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 6,
  },
  photoSuccessText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  tipsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 60,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  navigationMainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navigationMainText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  completeButton: {
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
  disabledButton: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  submittingButton: {
    backgroundColor: "#F59E0B",
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  submittingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submittingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
