import * as Haptics from "expo-haptics";
import { Tabs, useRouter } from "expo-router";
import { DollarSign, Home, Package, User } from "lucide-react-native";
import React from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Simplified and optimized tab bar icon
type TabBarIconProps = {
  focused: boolean;
  children: React.ReactNode;
  color: string;
  onPress: () => void;
};

function TabBarIcon({ focused, children, color, onPress }: TabBarIconProps) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(0.7)).current;

  const handlePress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Quick press animation
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: focused ? 1.1 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  React.useEffect(() => {
    // Simple, smooth focus animation
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Pressable onPress={handlePress} style={styles.tabButton}>
      <View style={styles.tabIconWrapper}>
        {/* Simple background indicator */}
        {focused && (
          <Animated.View
            style={[styles.activeIndicator, { backgroundColor: color + "20" }]}
          />
        )}

        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
}

// Main tab bar icon component
function MainTabBarIcon({
  focused,
  color,
  size = 24,
  route,
  onPress,
}: {
  focused: boolean;
  color: string;
  size?: number;
  route: { name: string };
  onPress: () => void;
}) {
  const iconProps = { size, color };

  let icon;
  switch (route.name) {
    case "home":
      icon = <Home {...iconProps} />;
      break;
    case "deliveries":
      icon = <Package {...iconProps} />;
      break;
    case "earnings":
      icon = <DollarSign {...iconProps} />;
      break;
    case "profile":
      icon = <User {...iconProps} />;
      break;
    default:
      icon = <Home {...iconProps} />;
  }

  return (
    <TabBarIcon focused={focused} color={color} onPress={onPress}>
      {icon}
    </TabBarIcon>
  );
}

const TabLayout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleTabPress = (routeName: string) => {
    const path =
      routeName === "home"
        ? "/(tabs)/home"
        : routeName === "deliveries"
        ? "/(tabs)/deliveries"
        : routeName === "earnings"
        ? "/(tabs)/earnings"
        : "/(tabs)/profile";
    router.push(path);
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: Platform.select({ ios: 60 + insets.bottom, android: 60 + Math.max(insets.bottom, 8) }),
            paddingBottom: Platform.select({ ios: insets.bottom || 16, android: Math.max(insets.bottom, 10) }),
          },
        ],
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#64748B",
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => (
          <MainTabBarIcon
            focused={focused}
            color={color}
            size={size}
            route={route}
            onPress={() => handleTabPress(route.name)}
          />
        ),
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: Platform.OS === "android",
        tabBarAccessibilityLabel: route.name,
      })}
      screenListeners={{
        tabPress: (e) => {
          e.preventDefault();
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarAccessibilityLabel: "Home Dashboard",
        }}
      />
      <Tabs.Screen
        name="deliveries"
        options={{
          title: "Deliveries",
          tabBarAccessibilityLabel: "Delivery Management",
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarAccessibilityLabel: "Earnings Overview",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarAccessibilityLabel: "User Profile",
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    paddingHorizontal: 16,
    // Clean shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  tabIconWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 32,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  activeIndicator: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    top: -4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0.1,
    textAlign: "center",
  },
});

export default TabLayout;
