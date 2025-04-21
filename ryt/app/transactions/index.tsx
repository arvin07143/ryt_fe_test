import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, FlatList, View, RefreshControl } from 'react-native';
import { Transaction } from '../../types/transaction';
import { useRouter } from 'expo-router';
import { AuthenticationGate } from '../../components/AuthenticationGate';
import { ThemedText } from '../../components/ThemedText';
import { ScreenLayout } from '../../components/ScreenLayout';
import { TransactionService } from '../../services/transactions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function TransactionsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = useCallback(async () => {
    const transactionService = TransactionService.getInstance();
    const data = transactionService.getTransactions();
    setTransactions(data);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, [loadTransactions]);

  // Load transactions when component mounts
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const formatAmount = (amount: number, isMasked: boolean) => {
    if (isMasked) {
      return '****';
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderTransaction = ({ item: transaction }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => {
        router.push({
          pathname: "/transactions/[id]",
          params: { id: transaction.id }
        });
      }}
    >
      <View style={styles.transactionHeader}>
        <ThemedText style={styles.merchant}>{transaction.merchant}</ThemedText>
        <ThemedText 
          style={[
            styles.amount,
            { color: transaction.type === 'credit' ? '#34C759' : '#FF3B30' }
          ]}
        >
          {transaction.type === 'debit' ? '-' : '+'}
          {formatAmount(transaction.amount, transaction.isMasked)}
        </ThemedText>
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <ThemedText style={styles.category}>{transaction.category}</ThemedText>
          <ThemedText style={styles.description} numberOfLines={1}>{transaction.description}</ThemedText>
        </View>
        <ThemedText style={styles.date}>{formatDate(transaction.date)}</ThemedText>
      </View>
    </TouchableOpacity>
  );
  return (
    <AuthenticationGate>
      <ScreenLayout>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'text')}
            />
          }
        />
      </ScreenLayout>
    </AuthenticationGate>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    paddingVertical: 12,
  },
  transactionItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  merchant: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  category: {
    fontSize: 14,
    opacity: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
});