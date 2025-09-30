import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  AlertCircle,
  ArrowRight,
  Check,
  RefreshCw,
  Shield,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import PhoneInput from "react-native-phone-number-input";
import { saveAuthToken } from "../hooks/useAuthStorage";

// Types
type Stage = "phone" | "otp";
type ErrorType = "validation" | "network" | "verification" | "success" | null;

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validatePhone = (
  phone: string,
  phoneInput: React.RefObject<PhoneInput>
): ValidationResult => {
  if (!phone || phone.length < 10) {
    return { isValid: false, error: "Phone number must be at least 10 digits" };
  }

  const isValid = phoneInput.current?.isValidNumber(phone) ?? false;

  if (!isValid) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }

  return { isValid: true };
};

const validateOTP = (otp: string): ValidationResult => {
  if (otp.length !== 6) {
    return { isValid: false, error: "Please enter the complete 6-digit code" };
  }

  if (!/^\d{6}$/.test(otp)) {
    return { isValid: false, error: "Code must contain only numbers" };
  }

  return { isValid: true };
};

export default function ProfessionalLoginScreen() {
  // State management
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<Stage>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  const phoneInput = useRef<PhoneInput>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Initial entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Resend timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendTimer]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Animation helpers
  const animateStageTransition = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  const animateError = useCallback(() => {
    Vibration.vibrate([0, 50, 50, 50]);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  // Error management
  const clearError = useCallback(() => {
    setError("");
    setErrorType(null);
  }, []);

  const setErrorMessage = useCallback(
    (message: string, type: ErrorType = "validation") => {
      setError(message);
      setErrorType(type);
      if (type !== "success") {
        animateError();
      }
    },
    [animateError]
  );

  // Event handlers
  const handlePhoneChange = useCallback(
    (text: string) => {
      if (error) clearError();
      setPhoneNumber(text);
    },
    [error, clearError]
  );

  const handleOTPChange = useCallback(
    (text: string) => {
      if (error) clearError();
      setOtp(text);
    },
    [error, clearError]
  );

  // Main logic functions
  const sendOTP = async () => {
    const validation = validatePhone(phoneNumber, phoneInput);

    if (!validation.isValid) {
      setErrorMessage(validation.error!, "validation");
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const formatted = phoneNumber;
      console.log(validation, "lp", formatted);
      setFormattedPhoneNumber(formatted);
      setStage("otp");
      setOtp("");
      setResendTimer(60);
      setAttemptCount(0);
      clearError();
      animateStageTransition();

      // Show success message
      setErrorMessage(`Verification code sent to ${formatted}`, "success");
      setTimeout(clearError, 3000);
    } catch (err) {
      setErrorMessage(
        "Unable to send code. Please check your connection and try again.",
        "network"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    const validation = validateOTP(otp);

    if (!validation.isValid) {
      setErrorMessage(validation.error!, "validation");
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      // Demo: Accept 123456 or 000000
      if (otp !== "123456" && otp !== "000000") {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= 3) {
          setErrorMessage(
            "Too many failed attempts. Requesting new code...",
            "verification"
          );
          setTimeout(() => {
            resetToPhone();
          }, 2500);
        } else {
          setErrorMessage(
            `Invalid code. ${3 - newAttemptCount} attempt${
              3 - newAttemptCount !== 1 ? "s" : ""
            } remaining.`,
            "verification"
          );
          setOtp("");
        }
        return;
      }

      // Success flow
      setSuccess(true);
      setErrorMessage("Verification successful!", "success");

      // Success animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Save token and navigate
      await saveAuthToken("auth_token");

      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 1500);
    } catch (err) {
      setErrorMessage("Verification failed. Please try again.", "network");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendTimer > 0 || isLoading) return;

    setIsLoading(true);
    clearError();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResendTimer(60);
      setOtp("");
      setAttemptCount(0);

      setErrorMessage("New verification code sent successfully", "success");
      setTimeout(clearError, 3000);
    } catch (err) {
      setErrorMessage("Failed to resend code. Please try again.", "network");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToPhone = () => {
    setStage("phone");
    setOtp("");
    clearError();
    setSuccess(false);
    setResendTimer(0);
    setAttemptCount(0);
    animateStageTransition();
  };

  // Validation checks
  const isPhoneValid = validatePhone(phoneNumber, phoneInput).isValid;
  const isOTPValid = validateOTP(otp).isValid;
  const canProceed = stage === "phone" ? isPhoneValid : isOTPValid;

  return (
    <View style={styles.container}>
      {/* Professional gradient background */}
      <LinearGradient
        // colors={["#141d45", "#3a2e8c", "#6a4fbf"]}
        // colors={["#0f2027", "#203a43", "#2c5364"]}
        // colors={["#0f3443", "#34e89e", "#00c6ff"]}
        colors={["#141e30", "#243b55", "#141e30"]}

        style={styles.backgroundGradient}
      />

      {/* Subtle pattern overlay */}
      <View style={styles.patternOverlay} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.contentWrapper,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                  { translateX: shakeAnim },
                ],
              },
            ]}
          >
            {/* Professional Header */}
            <View style={styles.header}>
              <Image
                source={require("../assets/images/adaptive-icon.png")}
                style={{ height: 100, width: 100, marginBottom: 20 }}
              />

              <Text style={styles.title}>
                {stage === "phone" ? "Welcome Back" : "Verify Identity"}
              </Text>
              <Text style={styles.subtitle}>
                {stage === "phone"
                  ? "Enter your phone number to receive a secure verification code"
                  : `We've sent a 6-digit code to\n${formattedPhoneNumber}`}
              </Text>
            </View>

            {/* Status Messages */}
            {error && (
              <View
                style={[
                  styles.messageBox,
                  errorType === "network" && styles.messageWarning,
                  errorType === "verification" && styles.messageError,
                  errorType === "success" && styles.messageSuccess,
                  errorType === "validation" && styles.messageInfo,
                ]}
              >
                <View style={styles.messageIconContainer}>
                  {errorType === "success" ? (
                    <Check size={20} color="#059669" strokeWidth={3} />
                  ) : (
                    <AlertCircle
                      size={20}
                      color={
                        errorType === "network"
                          ? "#D97706"
                          : errorType === "verification"
                          ? "#DC2626"
                          : "#174777"
                      }
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.messageText,
                    errorType === "success" && styles.messageTextSuccess,
                    errorType === "network" && styles.messageTextWarning,
                    errorType === "verification" && styles.messageTextError,
                  ]}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Main Card */}
            <View style={styles.card}>
              {stage === "phone" ? (
                <>
                  {/* Phone Input Section */}
                  <View style={styles.inputSection}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>Phone Number</Text>
                    </View>

                    <View style={styles.phoneInputContainer}>
                      <PhoneInput
                        ref={phoneInput}
                        defaultValue={phoneNumber}
                        defaultCode="IN"
                        layout="second"
                        onChangeText={handlePhoneChange}
                        onChangeFormattedText={(text) =>
                          setFormattedPhoneNumber(text)
                        }
                        placeholder="(555) 123-4567"
                        textInputProps={{ placeholderTextColor: "#94A3B8" }}
                        containerStyle={styles.phoneContainer}
                        textContainerStyle={styles.phoneTextContainer}
                        textInputStyle={styles.phoneTextInput}
                        codeTextStyle={styles.phoneCodeText}
                        flagButtonStyle={styles.phoneFlagButton}
                        countryPickerButtonStyle={styles.countryPickerButton}
                        withDarkTheme={true}
                        withShadow={false}
                        autoFocus={false}
                        disabled={isLoading}
                      />
                    </View>
                  </View>

                  {/* Send Code Button */}
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      (!canProceed || isLoading) && styles.buttonDisabled,
                    ]}
                    onPress={sendOTP}
                    disabled={!canProceed || isLoading}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={
                        !canProceed || isLoading
                          ? ["#CBD5E1", "#94A3B8"]
                          : ["#174777", "#0f2027"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>
                            Send Verification Code
                          </Text>
                          <ArrowRight
                            size={20}
                            color="#fff"
                            strokeWidth={2.5}
                          />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* OTP Input Section */}
                  <View style={styles.inputSection}>
                    <View style={styles.labelRow}>
                      <Shield size={16} color="#174777" strokeWidth={2.5} />
                      <Text style={styles.label}>Verification Code</Text>
                    </View>

                    <View style={styles.otpContainer}>
                      <OtpInput
                        numberOfDigits={6}
                        onTextChange={handleOTPChange}
                        focusColor="#174777"
                        focusStickBlinkingDuration={400}
                        disabled={isLoading || success}
                        theme={{
                          containerStyle: styles.otpInputContainer,
                          pinCodeContainerStyle: styles.otpBox,
                          pinCodeTextStyle: styles.otpText,
                          focusStickStyle: styles.otpFocusStick,
                          focusedPinCodeContainerStyle: styles.otpBoxFocused,
                        }}
                        autoFocus={true}
                      />
                    </View>

                    {/* OTP Helper Section */}
                    <View style={styles.otpHelperSection}>
                      <Text style={styles.demoCodeText}>
                        Demo codes: <Text style={styles.demoCode}>123456</Text>{" "}
                        or <Text style={styles.demoCode}>000000</Text>
                      </Text>

                      <View style={styles.resendSection}>
                        {resendTimer > 0 ? (
                          <Text style={styles.timerText}>
                            Resend code in{" "}
                            <Text style={styles.timerHighlight}>
                              {resendTimer}s
                            </Text>
                          </Text>
                        ) : (
                          <TouchableOpacity
                            onPress={resendOTP}
                            disabled={isLoading}
                            style={styles.resendButton}
                            activeOpacity={0.7}
                          >
                            <RefreshCw size={14} color="#174777" />
                            <Text style={styles.resendText}>Resend Code</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Verify Button */}
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      (!canProceed || isLoading) && styles.buttonDisabled,
                    ]}
                    onPress={verifyOTP}
                    disabled={!canProceed || isLoading}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={
                        !canProceed || isLoading
                          ? ["#CBD5E1", "#94A3B8"]
                          : success
                          ? ["#059669", "#047857"]
                          : ["#174777", "#0d3a5f"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : success ? (
                        <View style={styles.buttonContent}>
                          <Check size={20} color="#fff" strokeWidth={3} />
                          <Text style={styles.buttonText}>Verified</Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <Text style={styles.buttonText}>
                            Verify & Continue
                          </Text>
                          <ArrowRight
                            size={20}
                            color="#fff"
                            strokeWidth={2.5}
                          />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Secondary Button */}
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={resetToPhone}
                    disabled={isLoading || success}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Use Different Number
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => router.push("/support")}
                style={styles.supportButton}
                activeOpacity={0.7}
              >
                <Text style={styles.supportText}>
                  Need help? Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141d45",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  patternOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: "transparent",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  contentWrapper: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  messageBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  messageInfo: {
    backgroundColor: "rgba(23, 71, 119, 0.15)",
    borderColor: "rgba(23, 71, 119, 0.3)",
  },
  messageWarning: {
    backgroundColor: "rgba(217, 119, 6, 0.15)",
    borderColor: "rgba(217, 119, 6, 0.3)",
  },
  messageError: {
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    borderColor: "rgba(220, 38, 38, 0.3)",
  },
  messageSuccess: {
    backgroundColor: "rgba(5, 150, 105, 0.15)",
    borderColor: "rgba(5, 150, 105, 0.3)",
  },
  messageIconContainer: {
    marginRight: 10,
    marginTop: 1,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 18,
  },
  messageTextSuccess: {
    color: "#FFFFFF",
  },
  messageTextWarning: {
    color: "#FFFFFF",
  },
  messageTextError: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  inputSection: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  phoneInputContainer: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
    marginBottom: 8,
  },
  phoneContainer: {
    backgroundColor: "transparent",
    height: 56,
  },
  phoneTextContainer: {
    backgroundColor: "transparent",
    paddingVertical: 0,
  },
  phoneTextInput: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "600",
  },
  phoneCodeText: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "600",
  },
  phoneFlagButton: {
    backgroundColor: "transparent",
  },
  countryPickerButton: {
    backgroundColor: "transparent",
    width: 70,
  },
  helperText: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  otpContainer: {
    marginBottom: 16,
  },
  otpInputContainer: {
    gap: 10,
  },
  otpBox: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    width: 48,
    height: 56,
  },
  otpBoxFocused: {
    borderColor: "#174777",
    backgroundColor: "#FFFFFF",
    shadowColor: "#174777",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  otpText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  otpFocusStick: {
    backgroundColor: "#174777",
    height: 2,
  },
  otpHelperSection: {
    gap: 10,
    alignItems: "center",
  },
  demoCodeText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  demoCode: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: "600",
  },
  resendSection: {
    marginTop: 4,
  },
  timerText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },
  timerHighlight: {
    fontWeight: "700",
    color: "#174777",
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 13,
    color: "#174777",
    fontWeight: "700",
  },
  primaryButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#174777",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#174777",
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    gap: 12,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  securityText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  supportButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  supportText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    textAlign: "center",
  },
});
