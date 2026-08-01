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

  return (
    <View style={styles.card}>
      <View style={styles.metaWrap}>
        <Text style={styles.issuer}>{issuer}</Text>
        <Text style={styles.account}>{account}</Text>
      </View>

      {/* subtle background shapes behind the OTP to mimic an image/gradient */}
      <View style={styles.otpBackground} pointerEvents="none" />
      <View style={styles.otpBackgroundCircle} pointerEvents="none" />
      <View style={styles.otpFade} pointerEvents="none" />

      <TouchableOpacity
        style={styles.codeArea}
        onPress={onCopy}
        activeOpacity={0.8}
      >
        <Text style={styles.otp}>
          {otp.slice(0, 3)}
          {'\n'}
          {otp.slice(3)}
        </Text>
      </TouchableOpacity>

      <View style={styles.timerWrap}>
        <View style={styles.timerPill}>
          <MaterialCommunityIcons
            name="timer-outline"
            size={14}
            color="#0F766E"
          />
          <Text style={styles.timer}>{remaining}s</Text>
        </View>
      </View>
    </View>
  );
};

export default OTPCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE6F2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  leftCol: {
    position: 'absolute',
    left: 12,
    top: 12,
    bottom: 12,
    justifyContent: 'center',
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerCol: {
    marginLeft: 140,
    marginRight: 92,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightCol: {
    position: 'absolute',
    right: 12,
    top: 12,
    bottom: 12,
    width: 72,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metaWrap: {
    position: 'absolute',
    left: 16,
    top: 12,
    bottom: 12,
    justifyContent: 'center',
    width: 140,
  },
  codeArea: {
    marginLeft: 140,
    marginRight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  otpBackground: {
    position: 'absolute',
    left: 120,
    top: 6,
    bottom: 6,
    right: 96,
    borderRadius: 12,
    backgroundColor: '#EAF6FF',
    opacity: 0.9,
  },
  otpBackgroundCircle: {
    position: 'absolute',
    left: 100,
    width: 120,
    height: 120,
    top: 0,
    borderRadius: 60,
    backgroundColor: '#D7F0FF',
    opacity: 0.7,
  },
  otpFade: {
    position: 'absolute',
    right: 96,
    top: 6,
    bottom: 6,
    width: 120,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  timerWrap: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0ECFF',
    borderWidth: 1,
    borderColor: '#CADDFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#1D4ED8',
    fontSize: 18,
    fontWeight: '700',
  },
  textMetaWrap: {
    marginLeft: 10,
    flexShrink: 1,
  },
  issuer: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  account: {
    color: '#64748B',
    marginTop: 2,
    fontSize: 13,
  },
  moreButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeWrap: {
    alignItems: 'center',
  },
  otp: {
    fontSize: 52,
    color: '#0E2A44',
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 54,
  },
  copyHintWrap: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyHint: {
    color: '#0284C7',
    fontSize: 12,
    marginLeft: 5,
  },
  footerRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  timer: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '700',
  },
  percentLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    marginTop: 8,
    width: '100%',
    height: 6,
    borderRadius: 999,
    backgroundColor: '#D8E6F8',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#0EA5E9',
  },
});
