import { Power } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StatusToggleProps {
  isOnline: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function StatusToggle({
  isOnline,
  onToggle,
  disabled = false,
}: StatusToggleProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOnline ? styles.online : styles.offline,
        disabled && styles.disabled,
      ]}
      onPress={onToggle}
      disabled={disabled}
    >
      <Power size={20} color="#ffffff" />
      <Text style={styles.text}>{isOnline ? "ONLINE" : "OFFLINE"}</Text>
      {isOnline && <View style={styles.indicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    position: "relative",
  },
  online: {
    backgroundColor: "#10B981",
  },
  offline: {
    backgroundColor: "#64748B",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    position: "absolute",
    top: 4,
    right: 4,
  },
});
