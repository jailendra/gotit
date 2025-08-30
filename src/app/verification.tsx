import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { Camera, Check, RotateCcw, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VerificationScreen() {
  const { type } = useLocalSearchParams<{
    type: "photo" | "facial" | "random";
  }>();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Camera access is required for verification
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setPhotoTaken(true);

      // Simulate verification process
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        if (type === "random") {
          Alert.alert(
            "Verification Complete",
            "Identity verified successfully",
            [{ text: "Continue", onPress: () => router.back() }]
          );
        } else {
          Alert.alert("Login Successful", "Welcome back!", [
            { text: "Continue", onPress: () => router.replace("/(tabs)") },
          ]);
        }
      }, 2000);
    }
  };

  const retake = () => {
    setPhotoTaken(false);
    setVerifying(false);
  };

  const getTitle = () => {
    switch (type) {
      case "photo":
        return "Photo ID Verification";
      case "facial":
        return "Facial Recognition Login";
      case "random":
        return "Random Security Check";
      default:
        return "Identity Verification";
    }
  };

  const getInstructions = () => {
    switch (type) {
      case "photo":
        return "Take a clear photo of yourself to verify your identity";
      case "facial":
        return "Position your face in the frame for facial recognition";
      case "random":
        return "Security check required. Please take a selfie to continue";
      default:
        return "Please take a clear photo for verification";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.title}>{getTitle()}</Text>
      </View>

      <Text style={styles.instructions}>{getInstructions()}</Text>

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

        <View style={styles.faceGuide}>
          <View style={styles.faceFrame} />
        </View>

        {verifying && (
          <View style={styles.verifyingOverlay}>
            <Text style={styles.verifyingText}>Verifying...</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() =>
            setFacing((current) => (current === "back" ? "front" : "back"))
          }
        >
          <RotateCcw size={24} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.captureButton,
            photoTaken && styles.captureButtonDisabled,
          ]}
          onPress={photoTaken ? retake : takePicture}
          disabled={verifying}
        >
          {photoTaken ? (
            <RotateCcw size={32} color="#ffffff" />
          ) : (
            <Camera size={32} color="#ffffff" />
          )}
        </TouchableOpacity>

        {photoTaken && !verifying && (
          <TouchableOpacity style={styles.confirmButton} onPress={takePicture}>
            <Check size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  closeButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
  },
  instructions: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    margin: 20,
    lineHeight: 24,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
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
    width: 200,
    height: 250,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#ffffff",
    borderStyle: "dashed",
  },
  verifyingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 24,
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonDisabled: {
    backgroundColor: "#64748B",
  },
  confirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#64748B",
  },
  permissionButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  permissionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
