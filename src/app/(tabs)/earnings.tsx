import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Package,
  Star,
  Download
} from 'lucide-react-native';

interface EarningsData {
  period: 'day' | 'week' | 'month';
  totalEarnings: number;
  deliveries: number;
  tips: number;
  bonuses: number;
}

interface DeliveryHistory {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  earning: number;
  tip: number;
  status: 'completed' | 'cancelled';
  rating: number;
}

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  const earningsData: Record<string, EarningsData> = {
    day: {
      period: 'day',
      totalEarnings: 850,
      deliveries: 12,
      tips: 120,
      bonuses: 50,
    },
    week: {
      period: 'week',
      totalEarnings: 4250,
      deliveries: 68,
      tips: 680,
      bonuses: 200,
    },
    month: {
      period: 'month',
      totalEarnings: 18500,
      deliveries: 285,
      tips: 2850,
      bonuses: 750,
    },
  };

  const deliveryHistory: DeliveryHistory[] = [
    {
      id: '1',
      date: 'Today 2:30 PM',
      pickup: 'McDonald\'s, Sector 18',
      dropoff: 'Sector 15, Noida',
      earning: 65,
      tip: 15,
      status: 'completed',
      rating: 5,
    },
    {
      id: '2',
      date: 'Today 1:15 PM',
      pickup: 'KFC, DLF Mall',
      dropoff: 'Golf Course Road',
      earning: 75,
      tip: 0,
      status: 'completed',
      rating: 4,
    },
    {
      id: '3',
      date: 'Today 12:45 PM',
      pickup: 'Subway, CP',
      dropoff: 'India Gate',
      earning: 55,
      tip: 20,
      status: 'completed',
      rating: 5,
    },
    {
      id: '4',
      date: 'Today 11:30 AM',
      pickup: 'Domino\'s, Lajpat Nagar',
      dropoff: 'Greater Kailash',
      earning: 70,
      tip: 10,
      status: 'cancelled',
      rating: 0,
    },
  ];

  const currentData = earningsData[selectedPeriod];
  const baseEarnings = currentData.totalEarnings - currentData.tips - currentData.bonuses;

  const renderHistoryItem = ({ item }: { item: DeliveryHistory }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <View style={styles.earningsContainer}>
          <Text style={styles.earningAmount}>₹{item.earning + item.tip}</Text>
          {item.status === 'completed' && (
            <View style={styles.ratingContainer}>
              <Star size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>
          {item.pickup} → {item.dropoff}
        </Text>
      </View>
      
      <View style={styles.historyFooter}>
        <View style={[
          styles.statusBadge,
          item.status === 'completed' ? styles.completedBadge : styles.cancelledBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'completed' ? styles.completedText : styles.cancelledText
          ]}>
            {item.status}
          </Text>
        </View>
        
        {item.tip > 0 && (
          <Text style={styles.tipText}>Tip: ₹{item.tip}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        {(['day', 'week', 'month'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.activePeriodButtonText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.earningsOverview}>
          <View style={styles.totalEarningsCard}>
            <TrendingUp size={32} color="#10B981" />
            <Text style={styles.totalAmount}>₹{currentData.totalEarnings.toLocaleString()}</Text>
            <Text style={styles.totalLabel}>Total {selectedPeriod} earnings</Text>
          </View>

          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownCard}>
              <Package size={20} color="#2563EB" />
              <Text style={styles.breakdownNumber}>₹{baseEarnings}</Text>
              <Text style={styles.breakdownLabel}>Delivery Fees</Text>
            </View>

            <View style={styles.breakdownCard}>
              <DollarSign size={20} color="#F59E0B" />
              <Text style={styles.breakdownNumber}>₹{currentData.tips}</Text>
              <Text style={styles.breakdownLabel}>Tips</Text>
            </View>

            <View style={styles.breakdownCard}>
              <Star size={20} color="#8B5CF6" />
              <Text style={styles.breakdownNumber}>₹{currentData.bonuses}</Text>
              <Text style={styles.breakdownLabel}>Bonuses</Text>
            </View>

            <View style={styles.breakdownCard}>
              <Calendar size={20} color="#64748B" />
              <Text style={styles.breakdownNumber}>{currentData.deliveries}</Text>
              <Text style={styles.breakdownLabel}>Deliveries</Text>
            </View>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Delivery History</Text>
          
          <FlatList
            data={deliveryHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <TouchableOpacity style={styles.withdrawButton}>
          <DollarSign size={24} color="#ffffff" />
          <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  activePeriodButton: {
    backgroundColor: '#2563EB',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activePeriodButtonText: {
    color: '#ffffff',
  },
  earningsOverview: {
    padding: 20,
  },
  totalEarningsCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  breakdownCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  historySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  earningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  locationInfo: {
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
  },
  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  completedText: {
    color: '#166534',
  },
  cancelledText: {
    color: '#DC2626',
  },
  tipText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    gap: 12,
  },
  withdrawButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});