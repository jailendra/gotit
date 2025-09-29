import { router } from "expo-router";
import { ArrowRight, Phone, Shield } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { saveAuthToken } from "../hooks/useAuthStorage";

type Stage = "phone" | "otp";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<Stage>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  const isValidOTP = (code: string): boolean => /^\d{6}$/.test(code);

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "").slice(0, 10);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  };

  const handlePhoneChange = useCallback((text: string) => {
    if (error) setError("");
    setPhoneNumber(formatPhoneNumber(text));
  }, [error]);

  const handleOTPChange = useCallback((text: string) => {
    if (error) setError("");
    setOtp(text.replace(/[^0-9]/g, "").slice(0, 6));
  }, [error]);

  const sendOTP = async () => {
    if (!isValidPhone(phoneNumber)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setStage("otp");
      setOtp("");
      setError("");
      Alert.alert("Code sent", `We texted a code to ${phoneNumber}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!isValidOTP(otp)) {
      setError("Enter the 6-digit code");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (otp !== "123456") {
        setError("Invalid code. Try again.");
        return;
      }
      await saveAuthToken("demo-token");
      Alert.alert("Success", "You're in!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onPrimaryPress = () => {
    if (stage === "phone") sendOTP();
    else verifyOTP();
  };

  const disablePrimary = () => {
    if (isLoading) return true;
    return stage === "phone" ? !isValidPhone(phoneNumber) : !isValidOTP(otp);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentWrapper}>
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.logo}
              />
            </View>
            <Text style={styles.title}>
              {stage === "phone" ? "Welcome Back" : "Verify Your Identity"}
            </Text>
            <Text style={styles.subtitle}>
              {stage === "phone" 
                ? "Enter your phone number to continue" 
                : "We sent a code to your phone"}
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Main Card */}
          <View style={styles.card}>
            {stage === "phone" ? (
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Phone size={16} color="#64748B" />
                    <Text style={styles.label}>Phone Number</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="123-456-7890"
                      value={phoneNumber}
                      onChangeText={handlePhoneChange}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#94A3B8"
                      maxLength={12}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, disablePrimary() && styles.primaryBtnDisabled]}
                  onPress={onPrimaryPress}
                  disabled={disablePrimary()}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.primaryText}>Continue</Text>
                      <ArrowRight size={20} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Shield size={16} color="#64748B" />
                    <Text style={styles.label}>Verification Code</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="000000"
                      value={otp}
                      onChangeText={handleOTPChange}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={styles.helperContainer}>
                    <Text style={styles.helper}>Code sent to {phoneNumber}</Text>
                    <Text style={styles.helperDemo}>Demo: 123456</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, disablePrimary() && styles.primaryBtnDisabled]}
                  onPress={onPrimaryPress}
                  disabled={disablePrimary()}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.primaryText}>Verify & Continue</Text>
                      <ArrowRight size={20} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => { setStage("phone"); setOtp(""); setError(""); }}
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryText}>Use different number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Support Link */}
          <TouchableOpacity 
            onPress={() => router.push("/support")}
            style={styles.supportButton}
          >
            <Text style={styles.supportLink}>Need help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  contentWrapper: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "500",
  },
  otpInput: {
    textAlign: "center",
    letterSpacing: 8,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  helperContainer: {
    marginTop: 10,
    gap: 4,
  },
  helper: {
    fontSize: 13,
    color: "#64748B",
  },
  helperDemo: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: "#93C5FD",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
  supportButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  supportLink: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
});