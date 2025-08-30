import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Check,
  FileImage,
  RotateCcw,
  Shield,
  User,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type VerificationType = "photo" | "facial" | "random" | "manual" | "identity";
type VerificationMode = "update" | "camera" | "gallery" | "manual";

interface StepInstructions {
  [key: number]: string;
}

const { width, height } = Dimensions.get("window");

export default function VerificationScreen() {
  const { type, mode } = useLocalSearchParams<{
    type: VerificationType;
    mode?: VerificationMode;
  }>();

  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [maxSteps] = useState(type === "manual" ? 3 : 1);
  const [capturedPhotos, setCapturedPhotos] = useState<CameraCapturedPicture[]>(
    []
  );

  const cameraRef = useRef<CameraView>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [guideAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animated guide effect
    const pulseGuide = () => {
      Animated.sequence([
        Animated.timing(guideAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(guideAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulseGuide());
    };
    pulseGuide();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Camera Permission</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.permissionContent}>
          <View style={styles.permissionIcon}>
            <Camera size={48} color="#64748B" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need camera access to verify your identity and ensure platform
            security. Your photos are processed securely and never shared.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !verifying) {
      try {
        setVerifying(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9,
          base64: false,
          skipProcessing: false,
        });

        setCapturedPhotos((prev: CameraCapturedPicture[]) => [...prev, photo]);
        setPhotoTaken(true);

        // Simulate AI verification process
        await simulateVerification();
      } catch (error) {
        Alert.alert("Error", "Failed to capture photo. Please try again.");
        setVerifying(false);
      }
    }
  };

  const simulateVerification = async () => {
    // Simulate different verification times based on type
    const verificationTime: Record<VerificationType, number> = {
      photo: 2500,
      facial: 3000,
      random: 2000,
      manual: 1500,
      identity: 4000,
    };

    await new Promise((resolve) =>
      setTimeout(resolve, verificationTime[type] || 2500)
    );

    if (type === "manual" && verificationStep < maxSteps) {
      setVerificationStep((prev) => prev + 1);
      setPhotoTaken(false);
      setVerifying(false);
      return;
    }

    setVerifying(false);
    handleVerificationComplete();
  };

  const handleVerificationComplete = () => {
    const successMessages: Record<VerificationType, string> = {
      photo: "Profile photo updated successfully!",
      facial: "Facial recognition login successful!",
      random: "Security check completed successfully.",
      manual: "Manual verification completed successfully.",
      identity: "Identity verification completed successfully.",
    };

    const successActions: Record<VerificationType, () => void> = {
      photo: () => router.back(),
      facial: () => router.replace("/(tabs)"),
      random: () => router.back(),
      manual: () => router.back(),
      identity: () => router.back(),
    };

    Alert.alert(
      "Verification Complete",
      successMessages[type] || "Verification successful!",
      [
        {
          text: "Continue",
          onPress: successActions[type] || (() => router.back()),
        },
      ]
    );
  };

  const retake = () => {
    setPhotoTaken(false);
    setVerifying(false);
  };

  const skipStep = () => {
    if (type === "manual" && verificationStep < maxSteps) {
      setVerificationStep((prev) => prev + 1);
      setPhotoTaken(false);
    }
  };

  const getTitle = () => {
    const titles: Record<VerificationType, string> = {
      photo: "Update Profile Photo",
      facial: "Facial Recognition",
      random: "Security Verification",
      manual: "Manual Verification",
      identity: "Identity Verification",
    };
    return titles[type] || "Verification";
  };

  const getInstructions = () => {
    if (type === "manual") {
      const stepInstructions: any = {
        1: "Step 1: Take a clear front-facing photo",
        2: "Step 2: Hold your ID document next to your face",
        3: "Step 3: Take a photo with your ID visible",
      };
      return (
        stepInstructions[verificationStep] || "Follow the verification steps"
      );
    }

    const instructions = {
      photo: "Position yourself clearly in the frame and take a photo",
      facial: "Look directly at the camera for facial recognition",
      random: "Security check required. Take a clear selfie to continue",
      identity: "Take a clear photo for identity verification",
    };
    return instructions[type] || "Position yourself in the frame and capture";
  };

  const getIcon = () => {
    const icons: Record<VerificationType, React.ReactElement> = {
      photo: <User size={24} color="#2563EB" />,
      facial: <Shield size={24} color="#10B981" />,
      random: <Zap size={24} color="#F59E0B" />,
      manual: <FileImage size={24} color="#8B5CF6" />,
      identity: <Shield size={24} color="#2563EB" />,
    };
    return icons[type] || <Camera size={24} color="#64748B" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          {type === "manual" && (
            <Text style={styles.stepIndicator}>
              Step {verificationStep} of {maxSteps}
            </Text>
          )}
        </View>
        <View style={styles.headerIcon}>{getIcon()}</View>
      </View>

      {/* Progress Bar for Manual Verification */}
      {type === "manual" && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${(verificationStep / maxSteps) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Instructions */}
      <Animated.View
        style={[
          styles.instructionsContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.instructions}>{getInstructions()}</Text>
        {type === "facial" && (
          <Text style={styles.subInstructions}>
            Keep your face centered and well-lit for best results
          </Text>
        )}
      </Animated.View>

      {/* Camera Container */}
      <Animated.View
        style={[
          styles.cameraContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

        {/* Face Guide with Animation */}
        <View style={styles.faceGuide}>
          <Animated.View
            style={[
              styles.faceFrame,
              {
                transform: [{ scale: guideAnim }],
                borderColor: verifying ? "#10B981" : "#ffffff",
              },
            ]}
          />

          {/* Corner Guides */}
          <View style={styles.cornerGuides}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Verification Overlay */}
        {verifying && (
          <Animated.View style={styles.verifyingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.verifyingText}>
              {type === "facial"
                ? "Analyzing facial features..."
                : "Processing verification..."}
            </Text>
            <Text style={styles.verifyingSubtext}>Please wait a moment</Text>
          </Animated.View>
        )}

        {/* Success Overlay */}
        {photoTaken && !verifying && (
          <View style={styles.successOverlay}>
            <View style={styles.successIcon}>
              <Check size={32} color="#ffffff" />
            </View>
            <Text style={styles.successText}>Photo Captured!</Text>
          </View>
        )}
      </Animated.View>

      {/* Enhanced Controls */}
      <View style={styles.controls}>
        {/* Flip Camera Button */}
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() =>
            setFacing((current) => (current === "back" ? "front" : "back"))
          }
          disabled={verifying}
        >
          <RotateCcw size={24} color={verifying ? "#64748B" : "#ffffff"} />
        </TouchableOpacity>

        {/* Main Capture Button */}
        <TouchableOpacity
          style={[
            styles.captureButton,
            verifying && styles.captureButtonVerifying,
            photoTaken && !verifying && styles.captureButtonSuccess,
          ]}
          onPress={photoTaken && !verifying ? retake : takePicture}
          disabled={verifying}
        >
          {verifying ? (
            <ActivityIndicator size={32} color="#ffffff" />
          ) : photoTaken ? (
            <RotateCcw size={32} color="#ffffff" />
          ) : (
            <Camera size={32} color="#ffffff" />
          )}
        </TouchableOpacity>

        {/* Confirm/Skip Button */}
        {photoTaken && !verifying ? (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleVerificationComplete}
          >
            <Check size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : type === "manual" && verificationStep < maxSteps ? (
          <TouchableOpacity style={styles.skipButton} onPress={skipStep}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton} />
        )}
      </View>

      {/* Tips Section */}
      {!photoTaken && !verifying && (
        <Animated.View style={[styles.tipsContainer, { opacity: fadeAnim }]}>
          <View style={styles.tipItem}>
            <AlertCircle size={16} color="#F59E0B" />
            <Text style={styles.tipText}>
              {type === "facial"
                ? "Look directly at camera"
                : "Ensure good lighting"}
            </Text>
          </View>
          <View style={styles.tipItem}>
            <AlertCircle size={16} color="#F59E0B" />
            <Text style={styles.tipText}>
              {type === "manual"
                ? "Hold ID clearly visible"
                : "Remove glasses if needed"}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  stepIndicator: {
    fontSize: 12,
    color: "#CBD5E1",
    marginTop: 2,
    fontWeight: "500",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  instructions: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  subInstructions: {
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#1F2937",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  camera: {
    flex: 1,
  },
  faceGuide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  faceFrame: {
    width: width * 0.6,
    height: width * 0.75,
    borderRadius: width * 0.3,
    borderWidth: 3,
    borderStyle: "dashed",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  cornerGuides: {
    position: "absolute",
    top: "25%",
    left: "20%",
    right: "20%",
    bottom: "25%",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#ffffff",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  verifyingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  verifyingText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    letterSpacing: -0.3,
  },
  verifyingSubtext: {
    color: "#CBD5E1",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(16,185,129,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    letterSpacing: -0.2,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 32,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  captureButtonVerifying: {
    backgroundColor: "#F59E0B",
    shadowColor: "#F59E0B",
  },
  captureButtonSuccess: {
    backgroundColor: "#64748B",
    shadowColor: "#64748B",
  },
  confirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  skipText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  placeholderButton: {
    width: 56,
    height: 56,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  tipText: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  permissionMessage: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  permissionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.2,
  },
});
