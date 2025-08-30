import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, Camera, Phone, Mail, Car, FileText, Shield, Settings, CircleHelp as HelpCircle, LogOut, Star, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const [driverInfo] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@gmail.com',
    rating: 4.8,
    totalDeliveries: 1250,
    vehicleType: 'Motorcycle',
    vehicleNumber: 'DL 01 AB 1234',
    licenseNumber: 'DL1420110012345',
  });

  const updatePhoto = () => {
    router.push('/verification?type=photo&mode=update');
  };

  const viewDocuments = () => {
    Alert.alert('Documents', 'Navigate to documents management screen');
  };

  const openSettings = () => {
    Alert.alert('Settings', 'App settings would open here');
  };

  const getHelp = () => {
    Alert.alert('Help & Support', 'Contact support or view FAQs');
  };

  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => router.replace('/login') }
      ]
    );
  };

  const triggerManualVerification = () => {
    router.push('/verification?type=random&mode=manual');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }}
            style={styles.profilePhoto}
          />
          <TouchableOpacity style={styles.cameraButton} onPress={updatePhoto}>
            <Camera size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.driverName}>{driverInfo.name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color="#F59E0B" />
          <Text style={styles.rating}>{driverInfo.rating}</Text>
          <Text style={styles.deliveryCount}>({driverInfo.totalDeliveries} deliveries)</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Phone size={20} color="#64748B" />
            <Text style={styles.infoText}>{driverInfo.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={20} color="#64748B" />
            <Text style={styles.infoText}>{driverInfo.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Car size={20} color="#64748B" />
            <Text style={styles.infoText}>
              {driverInfo.vehicleType} • {driverInfo.vehicleNumber}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <FileText size={20} color="#64748B" />
            <Text style={styles.infoText}>License: {driverInfo.licenseNumber}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Account & Security</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={viewDocuments}>
          <View style={styles.actionLeft}>
            <FileText size={20} color="#2563EB" />
            <Text style={styles.actionText}>Manage Documents</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={triggerManualVerification}>
          <View style={styles.actionLeft}>
            <Shield size={20} color="#10B981" />
            <Text style={styles.actionText}>Manual Verification</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={openSettings}>
          <View style={styles.actionLeft}>
            <Settings size={20} color="#64748B" />
            <Text style={styles.actionText}>App Settings</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={getHelp}>
          <View style={styles.actionLeft}>
            <HelpCircle size={20} color="#F59E0B" />
            <Text style={styles.actionText}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  profileSection: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 8,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  driverName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  deliveryCount: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#475569',
  },
  actionsSection: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});