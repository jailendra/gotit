import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Notification Permission",
      "Enable notifications to receive delivery requests and important updates"
    );
    return false;
  }
  return true;
};

export const scheduleNewOrderNotification = (orderDetails: any) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "New Delivery Request!",
      body: `${orderDetails.merchantName} - ₹${orderDetails.estimatedEarning}`,
      data: { orderId: orderDetails.id, type: "new_order" },
      sound: "default",
    },
    trigger: null, // Show immediately
  });
};

export const scheduleRandomVerificationNotification = () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Security Check Required",
      body: "Random verification needed to continue driving",
      data: { type: "verification_required" },
      sound: "default",
    },
    trigger: null,
  });
};

export const scheduleDeliveryReminderNotification = (
  customerAddress: string
) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Delivery in Progress",
      body: `Don't forget to deliver to ${customerAddress}`,
      data: { type: "delivery_reminder" },
    },
    trigger: {
      seconds: 300, // 5 minutes
    },
  });
};
