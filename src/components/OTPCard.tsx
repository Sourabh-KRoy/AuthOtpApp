import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type OTPCardProps = {
  issuer: string;
  account: string;
  otp: string;
  remaining: number;
  period: number;
  onCopy: () => void;
  onDelete: () => void;
};

const OTPCard = ({
  issuer,
  account,
  otp,
  remaining,
  period,
  onCopy,
  onDelete,
}: OTPCardProps) => {
  const progressPercent = (remaining / period) * 100;
  const accentWidth = `${Math.max(6, progressPercent)}%` as `${number}%`;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.metaWrap}>
          <Text style={styles.issuer}>{issuer}</Text>
          <Text style={styles.account}>{account}</Text>
        </View>

        {/* <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={18}
            color="#CBD5E1"
          />
        </TouchableOpacity> */}
      </View>

      <TouchableOpacity
        style={styles.codeArea}
        onPress={onCopy}
        activeOpacity={0.8}
      >
        <Text style={styles.otp}>{otp}</Text>
        <View style={styles.copyRow}>
          <MaterialCommunityIcons
            name="content-copy"
            size={13}
            color="#93C5FD"
          />
          <Text style={styles.copyHint}>Tap to copy</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <View style={styles.timerPill}>
          <MaterialCommunityIcons
            name="timer-outline"
            size={14}
            color="#F8FAFC"
          />
          <Text style={styles.timer}>{remaining}s</Text>
        </View>
        <Text style={styles.periodText}>{period}s cycle</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: accentWidth }]} />
      </View>
    </View>
  );
};

export default OTPCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    marginHorizontal: 14,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaWrap: {
    flex: 1,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  codeArea: {
    marginTop: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  copyRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyHint: {
    color: '#BFDBFE',
    marginLeft: 4,
    fontSize: 12,
  },
  footerRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  issuer: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  account: {
    color: '#94A3B8',
    marginTop: 2,
    fontSize: 12,
  },
  otp: {
    fontSize: 38,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  timer: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  periodText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrack: {
    marginTop: 8,
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#1F2937',
  },
  progressFill: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
});
