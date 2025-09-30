import Header from "@/src/components/Header";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Camera,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Upload,
  X
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PickupConfirmationScreen() {
  const [orderDetails] = useState({
    id: "ORD-2024-001",
    merchantName: "Pizza Hut",
    pickupAddress: "DLF Mall, Gurgaon, Sector 28",
    items: ["Large Margherita Pizza", "Garlic Bread", "Pepsi 500ml"],
    orderValue: 780,
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPickedUp, setIsPickedUp] = useState(false);
  const [arrivalTime] = useState(new Date());

  const takePhoto = async () => {
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
      setPhoto(result.assets[0].uri);
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
      setPhoto(result.assets[0].uri);
    }
  };

  const retakePhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhoto(null);
  };

  const confirmPickup = async () => {
    if (!photo) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Photo Required",
        "Please take a photo of the package/receipt before confirming pickup"
      );
      return;
    }

    setIsUploading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Simulate upload delay
    setTimeout(async () => {
      setIsUploading(false);
      setIsPickedUp(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        router.push("/deliveryProgress");
      }, 1500);
    }, 2000);
  };

  if (isPickedUp) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color="#059669" />
          <Text style={styles.successTitle}>Pickup Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Now heading to delivery location...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Confirm Pickup"
        subtitle="Verify package collection"
        showBack
        onBack={() => router.back()}
        right={
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>AT PICKUP</Text>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Info */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#10B981" />
            <Text style={styles.locationTitle}>Pickup Location</Text>
            <View style={styles.arrivalTime}>
              <Clock size={14} color="#059669" />
              <Text style={styles.arrivalText}>
                Arrived: {arrivalTime.toLocaleTimeString()}
              </Text>
            </View>
          </View>

          <Text style={styles.merchantName}>{orderDetails.merchantName}</Text>
          <Text style={styles.locationAddress}>
            {orderDetails.pickupAddress}
          </Text>
        </View>

        {/* Order Items Checklist */}
        <View style={styles.itemsCard}>
          <Text style={styles.cardTitle}>📦 Order Items to Collect</Text>
          <Text style={styles.itemsSubtitle}>
            Verify all items before taking photo
          </Text>

          {orderDetails.items.map((item, index) => (
            <View key={index} style={styles.itemCheckRow}>
              <CheckCircle size={18} color="#10B981" />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}

          <View style={styles.orderValueRow}>
            <Text style={styles.orderValueLabel}>Total Order Value:</Text>
            <Text style={styles.orderValueAmount}>
              ₹{orderDetails.orderValue}
            </Text>
          </View>
        </View>

        {/* Photo Capture Section */}
        <View style={styles.photoCard}>
          <Text style={styles.cardTitle}>📸 Pickup Verification</Text>
          <Text style={styles.photoSubtitle}>
            Take a clear photo of the package/receipt as proof of pickup
          </Text>

          {!photo ? (
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                <Camera size={24} color="#ffffff" />
                <Text style={styles.cameraButtonText}>Take Photo</Text>
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
              <Image source={{ uri: photo }} style={styles.previewImage} />
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

        {/* Pickup Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.cardTitle}>✅ Pickup Guidelines</Text>
          <View style={styles.guideline}>
            <Text style={styles.guidelineNumber}>1.</Text>
            <Text style={styles.guidelineText}>
              Verify all items match the order list above
            </Text>
          </View>
          <View style={styles.guideline}>
            <Text style={styles.guidelineNumber}>2.</Text>
            <Text style={styles.guidelineText}>
              Take a clear photo of the package or receipt
            </Text>
          </View>
          <View style={styles.guideline}>
            <Text style={styles.guidelineNumber}>3.</Text>
            <Text style={styles.guidelineText}>
              Handle food items carefully during transport
            </Text>
          </View>
          <View style={styles.guideline}>
            <Text style={styles.guidelineNumber}>4.</Text>
            <Text style={styles.guidelineText}>
              Keep hot items hot and cold items cold
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !photo && styles.disabledButton,
            isUploading && styles.uploadingButton,
          ]}
          onPress={confirmPickup}
          disabled={!photo || isUploading}
        >
          {isUploading ? (
            <View style={styles.uploadingContent}>
              <Package size={20} color="#ffffff" />
              <Text style={styles.uploadingText}>Confirming Pickup...</Text>
            </View>
          ) : (
            <>
              <CheckCircle size={20} color="#ffffff" />
              <Text style={styles.confirmButtonText}>
                {photo ? "Confirm Pickup & Continue" : "Take Photo First"}
              </Text>
            </>
          )}
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
    borderLeftColor: "#10B981",
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
  arrivalTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  arrivalText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  merchantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  itemsCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  itemsSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  itemCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  itemText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  orderValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  orderValueLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  orderValueAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
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
  instructionsCard: {
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
  guideline: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  guidelineNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
    width: 20,
  },
  guidelineText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  confirmButton: {
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
  uploadingButton: {
    backgroundColor: "#F59E0B",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  uploadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#059669",
    marginTop: 20,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
