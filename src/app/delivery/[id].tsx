import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  MapPin, 
  Phone, 
  Camera,
  Navigation,
  Check,
  Clock,
  ArrowLeft
} from 'lucide-react-native';

type DeliveryStep = 'pickup' | 'transit' | 'delivery' | 'completed';

export default function DeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState<DeliveryStep>('pickup');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);

  const orderDetails = {
    id: id,
    merchantName: 'McDonald\'s',
    pickupAddress: 'Sector 18, Noida, Uttar Pradesh',
    dropoffAddress: 'Sector 15, Noida, Uttar Pradesh',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    merchantPhone: '+91 87654 32109',
    orderValue: 450,
    deliveryCode: 'ABCD',
    estimatedEarning: 65,
  };

  const markArrivedAtPickup = () => {
    Alert.alert(
      'Arrived at Pickup',
      'Have you arrived at the merchant location?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => setCurrentStep('transit') }
      ]
    );
  };

  const markPickedUp = () => {
    if (!photoTaken) {
      Alert.alert('Photo Required', 'Please take a photo of the package before marking as picked up');
      return;
    }
    setCurrentStep('delivery');
  };

  const markArrivedAtDelivery = () => {
    Alert.alert(
      'Arrived at Delivery Location',
      'Have you arrived at the customer location?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => {} }
      ]
    );
  };

  const completeDelivery = () => {
    if (deliveryCode !== orderDetails.deliveryCode) {
      Alert.alert('Invalid Code', 'Please enter the correct delivery code');
      return;
    }
    if (!photoTaken) {
      Alert.alert('Photo Required', 'Please take a photo proof of delivery');
      return;
    }
    
    setCurrentStep('completed');
    setTimeout(() => {
      Alert.alert(
        'Delivery Completed!',
        `You've earned ₹${orderDetails.estimatedEarning} for this delivery`,
        [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]
      );
    }, 1000);
  };

  const takePhoto = () => {
    // Simulate photo capture
    Alert.alert(
      'Photo Captured',
      'Package photo has been saved successfully',
      [
        { text: 'OK', onPress: () => setPhotoTaken(true) }
      ]
    );
  };

  const callContact = (phone: string) => {
    Alert.alert('Call', `Would you like to call ${phone}?`);
  };

  const openNavigation = (address: string) => {
    Alert.alert('Navigation', `Opening navigation to: ${address}`);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'pickup':
        return 'Going to Pickup';
      case 'transit':
        return 'Order Picked Up';
      case 'delivery':
        return 'Delivering to Customer';
      case 'completed':
        return 'Delivery Completed';
      default:
        return 'Delivery';
    }
  };

  const getCurrentAddress = () => {
    return currentStep === 'pickup' ? orderDetails.pickupAddress : orderDetails.dropoffAddress;
  };

  const getCurrentContact = () => {
    return currentStep === 'pickup' 
      ? { name: orderDetails.merchantName, phone: orderDetails.merchantPhone }
      : { name: orderDetails.customerName, phone: orderDetails.customerPhone };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.title}>{getStepTitle()}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressStep, currentStep !== 'pickup' && styles.completedStep]}>
          <Text style={[styles.progressText, currentStep !== 'pickup' && styles.completedText]}>1</Text>
        </View>
        <View style={[styles.progressLine, currentStep === 'delivery' || currentStep === 'completed' ? styles.completedLine : null]} />
        <View style={[styles.progressStep, (currentStep === 'delivery' || currentStep === 'completed') && styles.completedStep]}>
          <Text style={[styles.progressText, (currentStep === 'delivery' || currentStep === 'completed') && styles.completedText]}>2</Text>
        </View>
        <View style={[styles.progressLine, currentStep === 'completed' ? styles.completedLine : null]} />
        <View style={[styles.progressStep, currentStep === 'completed' && styles.completedStep]}>
          <Text style={[styles.progressText, currentStep === 'completed' && styles.completedText]}>3</Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.orderTitle}>Order #{orderDetails.id}</Text>
        <Text style={styles.merchantName}>{orderDetails.merchantName}</Text>
        <Text style={styles.orderValue}>Order Value: ₹{orderDetails.orderValue}</Text>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color="#2563EB" />
          <Text style={styles.locationTitle}>
            {currentStep === 'pickup' ? 'Pickup Location' : 'Delivery Location'}
          </Text>
        </View>
        <Text style={styles.address}>{getCurrentAddress()}</Text>
        
        <View style={styles.locationActions}>
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => openNavigation(getCurrentAddress())}
          >
            <Navigation size={20} color="#ffffff" />
            <Text style={styles.navigationText}>Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => callContact(getCurrentContact().phone)}
          >
            <Phone size={20} color="#2563EB" />
            <Text style={styles.callText}>Call {getCurrentContact().name}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentStep === 'pickup' && (
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={markArrivedAtPickup}>
            <Text style={styles.primaryButtonText}>Mark as Arrived at Pickup</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 'transit' && (
        <View style={styles.actionSection}>
          <Text style={styles.instructionText}>
            Please take a photo of the package before confirming pickup
          </Text>
          
          <TouchableOpacity 
            style={[styles.photoButton, photoTaken && styles.photoButtonTaken]} 
            onPress={takePhoto}
          >
            <Camera size={24} color="#ffffff" />
            <Text style={styles.photoButtonText}>
              {photoTaken ? 'Photo Taken ✓' : 'Take Package Photo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.primaryButton, !photoTaken && styles.disabledButton]} 
            onPress={markPickedUp}
            disabled={!photoTaken}
          >
            <Text style={styles.primaryButtonText}>Mark as Picked Up</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 'delivery' && (
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.arrivedButton} onPress={markArrivedAtDelivery}>
            <Text style={styles.arrivedButtonText}>Mark as Arrived at Drop-off</Text>
          </TouchableOpacity>

          <Text style={styles.instructionText}>
            Enter the 4-letter delivery code from customer
          </Text>
          
          <TextInput
            style={styles.codeInput}
            placeholder="Enter delivery code (e.g. ABCD)"
            value={deliveryCode}
            onChangeText={setDeliveryCode}
            maxLength={4}
            autoCapitalize="characters"
          />

          <TouchableOpacity 
            style={[styles.photoButton, photoTaken && styles.photoButtonTaken]} 
            onPress={takePhoto}
          >
            <Camera size={24} color="#ffffff" />
            <Text style={styles.photoButtonText}>
              {photoTaken ? 'Delivery Photo Taken ✓' : 'Take Delivery Photo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.primaryButton, 
              (deliveryCode !== orderDetails.deliveryCode || !photoTaken) && styles.disabledButton
            ]} 
            onPress={completeDelivery}
            disabled={deliveryCode !== orderDetails.deliveryCode || !photoTaken}
          >
            <Check size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Complete Delivery</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 'completed' && (
        <View style={styles.completedSection}>
          <View style={styles.successIcon}>
            <Check size={48} color="#ffffff" />
          </View>
          <Text style={styles.completedTitle}>Delivery Completed!</Text>
          <Text style={styles.completedSubtitle}>
            You've earned ₹{orderDetails.estimatedEarning}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  completedText: {
    color: '#ffffff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  completedLine: {
    backgroundColor: '#10B981',
  },
  orderInfo: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  merchantName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginVertical: 4,
  },
  orderValue: {
    fontSize: 14,
    color: '#64748B',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  address: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 20,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  navigationButton: {
    flex: 2,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  navigationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  callText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  actionSection: {
    padding: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  photoButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  photoButtonTaken: {
    backgroundColor: '#10B981',
  },
  photoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  codeInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  arrivedButton: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  arrivedButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  completedSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
});