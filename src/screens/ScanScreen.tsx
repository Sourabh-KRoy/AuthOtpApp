import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// A simple full-screen scan placeholder. In a real app, integrate camera scanning here.
export default function ScanScreen() {
  const navigation = useNavigation<any>();

  const handleFakeScan = () => {
    // Simulate a scanned otpauth URL. In production replace with real scanner result.
    const fake =
      'otpauth://totp/Acme:john@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Acme';

    // Navigate to manual entry with parsed values prefilled.
    navigation.navigate('ManualEntry', { scanned: fake });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topIconButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#F8FAFC" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Scan code</Text>

        <TouchableOpacity style={styles.topIconButton}>
          <MaterialCommunityIcons name="flash-outline" size={22} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <View style={styles.scanArea}>
        <View style={styles.glowBlue} />
        <View style={styles.glowYellow} />
        <View style={styles.glowGreen} />
        <View style={styles.glowRed} />

        <View style={styles.frameWrap}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        <Text style={styles.scanHint}>
          Position the QR code inside the frame to scan automatically
        </Text>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomInfoWrap}>
          <MaterialCommunityIcons name="shield-check-outline" size={18} color="#E2E8F0" />
          <Text style={styles.bottomInfoText}>Secured by Authenticator</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('ManualEntry')}>
            <MaterialCommunityIcons name="keyboard" size={18} color="#F8FAFC" />
            <Text style={styles.secondaryButtonText}>Enter key</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleFakeScan}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#FFF7ED" />
            <Text style={styles.primaryButtonText}>Simulate scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F1117',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1B2130',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
  },
  scanArea: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0C1019',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBlue: {
    position: 'absolute',
    left: -70,
    top: 160,
    width: 240,
    height: 110,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(59, 130, 246, 0.22)',
  },
  glowYellow: {
    position: 'absolute',
    right: -90,
    top: 160,
    width: 260,
    height: 110,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
  },
  glowGreen: {
    position: 'absolute',
    left: -90,
    top: 360,
    width: 260,
    height: 110,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  glowRed: {
    position: 'absolute',
    right: -60,
    top: 380,
    width: 240,
    height: 100,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
  },
  frameWrap: {
    width: 248,
    height: 248,
    borderRadius: 22,
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
  },
  corner: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 14,
    borderWidth: 5,
  },
  cornerTopLeft: {
    left: -2,
    top: -2,
    borderColor: '#60A5FA',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    right: -2,
    top: -2,
    borderColor: '#FACC15',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    left: -2,
    bottom: -2,
    borderColor: '#34D399',
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    right: -2,
    bottom: -2,
    borderColor: '#FB7185',
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanHint: {
    marginTop: 24,
    paddingHorizontal: 30,
    color: '#CBD5E1',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bottomInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 6,
  },
  bottomInfoText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3A4459',
    backgroundColor: '#1B2130',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButton: {
    flex: 1.2,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9A5E1A',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  primaryButtonText: {
    color: '#FFF7ED',
    fontWeight: '700',
    fontSize: 14,
  },
});
