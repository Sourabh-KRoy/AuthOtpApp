import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useBarcodeScannerOutput } from 'react-native-vision-camera-barcode-scanner';
import PageHeader from '../components/PageHeader';

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [scanLocked, setScanLocked] = useState(false);
  const scanLockedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      scanLockedRef.current = false;
      setScanLocked(false);
    }, []),
  );

  useEffect(() => {
    const ensurePermission = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    };

    ensurePermission();
  }, [hasPermission, requestPermission]);

  const openManualEntry = useCallback(
    (rawValue: string) => {
      if (scanLockedRef.current) {
        return;
      }

      scanLockedRef.current = true;
      setScanLocked(true);
      navigation.navigate('ManualEntry', { scanned: rawValue });
    },
    [navigation],
  );

  const barcodeOutput = useBarcodeScannerOutput({
    barcodeFormats: ['qr-code'],
    onBarcodeScanned(
      barcodes: Array<{ displayValue?: string; rawValue?: string }>,
    ) {
      if (scanLockedRef.current || barcodes.length === 0) {
        return;
      }

      const firstBarcode = barcodes[0];
      const scannedValue =
        firstBarcode.displayValue || firstBarcode.rawValue || '';

      if (!scannedValue.toLowerCase().startsWith('otpauth://totp/')) {
        return;
      }

      openManualEntry(scannedValue);
    },
    onError(error) {
      console.error('Barcode scanner error:', error);
    },
  });

  const handleDemoScan = () => {
    const fake =
      'otpauth://totp/Acme:john@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Acme';

    openManualEntry(fake);
  };

  const cameraReady = Boolean(device && hasPermission);

  return (
    <SafeAreaView style={styles.screen}>
      <PageHeader
        title="Scan code"
        rightIconName="flash-outline"
        onRightPress={() => {}}
      />

      <View style={styles.scanArea}>
        {cameraReady ? (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device!}
            isActive={!scanLocked}
            outputs={[barcodeOutput]}
          />
        ) : (
          <View style={styles.permissionState}>
            <Text style={styles.permissionTitle}>
              {hasPermission
                ? 'Loading camera...'
                : 'Camera permission required'}
            </Text>
            <Text style={styles.permissionBody}>
              Allow camera access so QR codes can be scanned directly.
            </Text>
            {!hasPermission ? (
              <TouchableOpacity
                style={styles.allowButton}
                onPress={requestPermission}
              >
                <Text style={styles.allowButtonText}>Allow camera</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.glowBlue} />
          <View style={styles.glowYellow} />
          <View style={styles.glowGreen} />
          <View style={styles.glowRed} />

          <View style={styles.frameWrap}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
            <View style={styles.scanLine} />
          </View>

          <Text style={styles.scanHint}>
            Position the QR code inside the frame to scan automatically
          </Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomInfoWrap}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={18}
            color="#E2E8F0"
          />
          <Text style={styles.bottomInfoText}>Secured by Authenticator</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('ManualEntry')}
          >
            <MaterialCommunityIcons name="keyboard" size={18} color="#F8FAFC" />
            <Text style={styles.secondaryButtonText}>Enter key</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleDemoScan}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={20}
              color="#FFF7ED"
            />
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
    backgroundColor: '#0B1220',
    marginTop: 30,
  },
  scanArea: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBlue: {
    position: 'absolute',
    left: -70,
    top: 150,
    width: 240,
    height: 110,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(59, 130, 246, 0.16)',
  },
  glowYellow: {
    position: 'absolute',
    right: -90,
    top: 150,
    width: 260,
    height: 110,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(96, 165, 250, 0.14)',
  },
  glowGreen: {
    position: 'absolute',
    left: -90,
    top: 350,
    width: 260,
    height: 110,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
  },
  glowRed: {
    position: 'absolute',
    right: -60,
    top: 370,
    width: 240,
    height: 100,
    transform: [{ rotate: '-22deg' }],
    backgroundColor: 'rgba(14, 165, 233, 0.14)',
  },
  frameWrap: {
    width: 248,
    height: 248,
    borderRadius: 22,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
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
    borderColor: '#38BDF8',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    left: -2,
    bottom: -2,
    borderColor: '#60A5FA',
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    right: -2,
    bottom: -2,
    borderColor: '#3B82F6',
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '50%',
    height: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(96, 165, 250, 0.8)',
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
  permissionState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  permissionTitle: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionBody: {
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  allowButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1E293B',
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
    backgroundColor: '#2563EB',
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
