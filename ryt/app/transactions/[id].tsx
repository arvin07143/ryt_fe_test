import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { AuthenticationGate } from '../../components/AuthenticationGate';
import { ThemedText } from '../../components/ThemedText';
import { ScreenLayout } from '../../components/ScreenLayout';
import { TransactionService } from '../../services/transactions';
import { Transaction } from '../../types/transaction';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  // Load initial transaction data
  useEffect(() => {
    const data = TransactionService.getInstance().getTransaction(String(id));
    if (data) {
      setTransaction(data);
    }
  }, [id]);

  if (!transaction) {
    return (
      <AuthenticationGate>
        <ScreenLayout style={styles.container}>
          <ThemedText>Transaction not found</ThemedText>
        </ScreenLayout>
      </AuthenticationGate>
    );
  }

  const formatAmount = (amount: number, isMasked: boolean) => {
    if (isMasked) {
      return '****';
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleToggleMask = async () => {
    const updatedTransaction = TransactionService.getInstance().toggleMask(transaction.id);
    if (updatedTransaction) {
      setTransaction(updatedTransaction);
    }
  };

  return (
    <AuthenticationGate>
      <ScreenLayout>
        <View style={styles.header}>
          <ThemedText style={styles.merchant}>{transaction.merchant}</ThemedText>          <Pressable 
            onPress={handleToggleMask}
            style={({pressed}) => pressed ? { opacity: 0.7 } : undefined}
          >
            <ThemedText 
              style={[
                styles.amount,
                { color: transaction.type === 'credit' ? '#34C759' : '#FF3B30' }
              ]}
            >
              {transaction.type === 'debit' ? '-' : '+'}
              {formatAmount(transaction.amount, transaction.isMasked)}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.detailSection}>
          <DetailRow label="Status" value={transaction.status.toUpperCase()} />
          <DetailRow label="Category" value={transaction.category} />
          <DetailRow label="Date" value={formatDate(transaction.date)} />
          <DetailRow label="Reference" value={transaction.reference} />
          <DetailRow label="Description" value={transaction.description} />
        </View>

        <ThemedText style={styles.securityNote}>
          Tap on the amount to reveal/hide sensitive information
        </ThemedText>
      </ScreenLayout>
    </AuthenticationGate>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  merchant: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  securityNote: {
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.5,
    fontSize: 14,
  },
});
