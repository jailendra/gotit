import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const requestCameraPermissions = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Camera Permission Required",
      "Camera access is needed for identity verification and delivery photos"
    );
    return false;
  }
  return true;
};

export const capturePhoto = async (options: {
  quality?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}) => {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: "images",
    allowsEditing: options.allowsEditing || false,
    aspect: options.aspect || [4, 3],
    quality: options.quality || 0.8,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  return null;
};

export const validateSelfiePhoto = async (photoUri: string) => {
  // Simulate face detection/verification
  // In a real app, this would use ML services like AWS Rekognition or Google Vision

  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const isValid = Math.random() > 0.1;
      resolve(isValid);
    }, 2000);
  });
};

export const compareFaces = async (
  storedPhotoUri: string,
  newPhotoUri: string
) => {
  // Simulate face matching
  // In production, integrate with face recognition services

  return new Promise<{ match: boolean; confidence: number }>((resolve) => {
    setTimeout(() => {
      const confidence = 0.85 + Math.random() * 0.1; // 85-95% confidence
      const match = confidence > 0.8;
      resolve({ match, confidence });
    }, 3000);
  });
};
