import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0B3558" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Camera view would appear here.
        </Text>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={handleFakeScan}>
        <MaterialCommunityIcons name="qrcode-scan" size={22} color="#FFFFFF" />
        <Text style={styles.scanButtonText}>Simulate Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7FBFF', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#0B3558', marginLeft: 8 },
  placeholder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5E5F7',
    backgroundColor: '#EAF2FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: '#475569' },
  scanButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1D9BF0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  scanButtonText: { color: '#FFFFFF', marginLeft: 8, fontWeight: '700' },
});
