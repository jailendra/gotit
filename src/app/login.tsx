import { router } from "expo-router";
import { Phone } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

interface LoginState {
  phoneNumber: string;
  otp: string;
  otpSent: boolean;
  isLoading: boolean;
  otpTimer: number;
  error: string;
  otpAttempts: number;
  isBlocked: boolean;
  blockTimer: number;
}

export default function LoginScreen() {
  const [state, setState] = useState<LoginState>({
    phoneNumber: "",
    otp: "",
    otpSent: false,
    isLoading: false,
    otpTimer: 0,
    error: "",
    otpAttempts: 0,
    isBlocked: false,
    blockTimer: 0,
  });

  // Validation functions
  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    // Indian numbers: 10 digits, US numbers: 10 digits
    return cleaned.length === 10;
  };

  const isValidOTP = (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  };

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.otpTimer > 0) {
      interval = setInterval(() => {
        setState((prev) => ({ ...prev, otpTimer: prev.otpTimer - 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.otpTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.blockTimer > 0) {
      interval = setInterval(() => {
        setState((prev) => {
          const newBlockTimer = prev.blockTimer - 1;
          return {
            ...prev,
            blockTimer: newBlockTimer,
            isBlocked: newBlockTimer > 0,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.blockTimer]);

  // Update helper
  const updateState = useCallback((updates: Partial<LoginState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Clear error when user starts typing
  const clearError = useCallback(() => {
    if (state.error) {
      updateState({ error: "" });
    }
  }, [state.error, updateState]);

  // Rate limiting
  const checkRateLimit = (): boolean => {
    if (state.isBlocked) {
      Alert.alert(
        "Too Many Attempts",
        `Please wait ${Math.ceil(
          state.blockTimer / 60
        )} minutes before trying again.`
      );
      return false;
    }
    return true;
  };

  const handleFailedAttempt = () => {
    const newAttempts = state.otpAttempts + 1;
    if (newAttempts >= 3) {
      updateState({
        otpAttempts: newAttempts,
        isBlocked: true,
        blockTimer: 300, // 5 minutes
        otpSent: false,
        otp: "",
        error: "Too many failed attempts. Account blocked for 5 minutes.",
      });
    } else {
      updateState({
        otpAttempts: newAttempts,
        error: `Invalid verification code. ${
          3 - newAttempts
        } attempts remaining.`,
      });
    }
  };

  // Phone number formatting for different regions
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");

    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);

    // Format based on length
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(
        6
      )}`;
    }
  };

  // API Functions
  const sendOTP = async () => {
    if (!checkRateLimit()) return;

    if (!isValidPhone(state.phoneNumber)) {
      updateState({
        error: "Please enter a valid 10-digit phone number",
      });
      return;
    }

    updateState({ isLoading: true, error: "" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      updateState({
        otpSent: true,
        isLoading: false,
        otpTimer: 60,
        otp: "",
        otpAttempts: 0,
      });

      Alert.alert(
        "Code Sent",
        `A 6-digit verification code has been sent to ${state.phoneNumber}`
      );
    } catch (error) {
      updateState({
        isLoading: false,
        error: "Failed to send verification code. Please try again.",
      });
    }
  };

  const resendOTP = async () => {
    if (!checkRateLimit()) return;

    updateState({ isLoading: true, error: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateState({
        isLoading: false,
        otpTimer: 60,
        otp: "",
        otpAttempts: 0,
      });
      Alert.alert("Code Sent", "New verification code sent successfully.");
    } catch (error) {
      updateState({
        isLoading: false,
        error: "Failed to resend code. Please try again.",
      });
    }
  };

  const verifyOTP = async () => {
    if (!checkRateLimit()) return;

    if (!isValidOTP(state.otp)) {
      updateState({ error: "Please enter a valid 6-digit verification code" });
      return;
    }

    updateState({ isLoading: true, error: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if OTP is correct (static code: 123456)
      if (state.otp === "123456") {
        updateState({ otpAttempts: 0 });
        Alert.alert("Success", "Login successful!", [
          { text: "OK", onPress: () => router.replace("/(tabs)") },
        ]);
      } else {
        updateState({ isLoading: false });
        handleFailedAttempt();
      }
    } catch (error) {
      updateState({
        isLoading: false,
        error: "Verification failed. Please try again.",
      });
    }
  };

  const handlePhoneChange = (text: string) => {
    clearError();
    const formattedPhone = formatPhoneNumber(text);
    updateState({ phoneNumber: formattedPhone });
  };

  const handleOTPChange = (text: string) => {
    clearError();
    const numericText = text.replace(/[^0-9]/g, "");
    updateState({ otp: numericText });
  };

  const handleLogin = () => {
    if (state.otpSent) {
      verifyOTP();
    } else {
      sendOTP();
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = (): boolean => {
    if (state.isLoading || state.isBlocked) return true;

    if (state.otpSent) {
      return !isValidOTP(state.otp);
    } else {
      return !isValidPhone(state.phoneNumber);
    }
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
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Got-It Driver</Text>
          <Text style={styles.subtitle}>
            {state.otpSent
              ? "Enter verification code"
              : "Enter your phone number"}
          </Text>
        </View>

        {/* Error Message */}
        {state.error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{state.error}</Text>
          </View>
        ) : null}

        {/* Block Notice */}
        {state.isBlocked && (
          <View style={styles.blockNotice}>
            <Text style={styles.blockText}>
              Account temporarily blocked. Try again in{" "}
              {Math.ceil(state.blockTimer / 60)} minutes.
            </Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Phone Number Input */}
          {!state.otpSent && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Phone size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="123-456-7890"
                  value={state.phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9CA3AF"
                  editable={!state.isLoading}
                  maxLength={12} // Formatted length: 123-456-7890
                />
              </View>
            </View>
          )}

          {/* OTP Input */}
          {state.otpSent && (
            <View style={styles.inputContainer}>
              <View style={styles.otpHeader}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                {state.otpTimer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend in {state.otpTimer}s
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={resendOTP}
                    disabled={state.isLoading || state.isBlocked}
                  >
                    <Text style={styles.resendText}>Resend Code</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  placeholder="000000"
                  value={state.otp}
                  onChangeText={handleOTPChange}
                  keyboardType="numeric"
                  maxLength={6}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9CA3AF"
                  editable={!state.isLoading && !state.isBlocked}
                />
              </View>
              <Text style={styles.helperText}>
                Enter the 6-digit code sent to {state.phoneNumber}
              </Text>
              <Text style={styles.demoText}>Demo code: 123456</Text>
            </View>
          )}

          {/* Login/Verify Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isButtonDisabled() && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isButtonDisabled()}
          >
            {state.isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                {state.otpSent ? "Verify Code" : "Send Code"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Phone Input */}
          {state.otpSent && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                updateState({
                  otpSent: false,
                  otp: "",
                  otpTimer: 0,
                  error: "",
                  otpAttempts: 0,
                })
              }
              disabled={state.isLoading}
            >
              <Text style={styles.backButtonText}>Change Phone Number</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => router.push("/support")}>
          <Text style={styles.helpText}>Need help? Contact support</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },
  blockNotice: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  blockText: {
    color: "#D97706",
    fontSize: 14,
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "transparent",
  },
  otpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timerText: {
    fontSize: 12,
    color: "#6B7280",
  },
  resendText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
  otpInput: {
    textAlign: "center",
    letterSpacing: 4,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  demoText: {
    fontSize: 12,
    color: "#059669",
    marginTop: 4,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  backButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "500",
  },
  helpText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    marginTop: 32,
  },
});
