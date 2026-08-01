import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
//   useCodeScanner,
// } from 'react-native-vision-camera';
import Header from '../components/Header';
import OTPCard from '../components/OTPCard';
import {
  loadAccountsSecurely,
  saveAccountsSecurely,
} from '../services/secureStore';
import { generateTOTP, getRemainingSeconds } from '../services/totp';
import type { AuthAccount } from '../types/authenticator';

const DEFAULT_PERIOD = 30;

const parseOtpAuthUri = (rawValue: string) => {
  if (!rawValue.toLowerCase().startsWith('otpauth://totp/')) {
    return null;
  }

  const payload = rawValue.replace(/^otpauth:\/\/totp\//i, '');
  const [encodedLabel, query = ''] = payload.split('?');
  const queryParams = query
    .split('&')
    .reduce<Record<string, string>>((acc, pair) => {
      if (!pair) {
        return acc;
      }

      const [key, ...valueParts] = pair.split('=');
      if (!key) {
        return acc;
      }

      const paramKey = decodeURIComponent(key).toLowerCase();
      const paramValue = decodeURIComponent(valueParts.join('=') || '');
      acc[paramKey] = paramValue;
      return acc;
    }, {});

  const normalizedSecret = (queryParams.secret || '')
    .replace(/\s+/g, '')
    .replace(new RegExp('=', 'g'), '')
    .toUpperCase();

  if (!normalizedSecret) {
    return null;
  }

  const decodedLabel = decodeURIComponent(encodedLabel || '');
  const separatorIndex = decodedLabel.indexOf(':');

  const issuerFromLabel =
    separatorIndex >= 0
      ? decodedLabel.slice(0, separatorIndex).trim()
      : decodedLabel.trim();
  const accountFromLabel =
    separatorIndex >= 0 ? decodedLabel.slice(separatorIndex + 1).trim() : '';

  const issuer = (queryParams.issuer || issuerFromLabel || 'Unknown').trim();
  const account = accountFromLabel || issuerFromLabel || 'Account';

  return {
    issuer,
    account,
    secret: normalizedSecret,
  };
};

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accounts, setAccounts] = useState<AuthAccount[]>([]);
  const [now, setNow] = useState(Date.now());
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [entryMode, setEntryMode] = useState<'manual' | 'scan'>('manual');
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const hasScannedRef = useRef(false);
  // const device = useCameraDevice('back');
  // const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    const loadData = async () => {
      const saved = await loadAccountsSecurely();
      setAccounts(saved);
    };

    loadData();
  }, []);

  useEffect(() => {
    const unsubOpen = navigation.addListener('drawerOpen', () =>
      setIsDrawerOpen(true),
    );
    const unsubClose = navigation.addListener('drawerClose', () =>
      setIsDrawerOpen(false),
    );
    return () => {
      unsubOpen();
      unsubClose();
    };
  }, [navigation]);

  useEffect(() => {
    const ticker = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(ticker);
  }, []);

  const remaining = useMemo(
    () => getRemainingSeconds(DEFAULT_PERIOD, now),
    [now],
  );

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return accounts;
    }

    return accounts.filter(account =>
      `${account.issuer} ${account.account}`.toLowerCase().includes(query),
    );
  }, [accounts, searchQuery]);

  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr'],
  //   onCodeScanned: (codes: string | any[]) => {
  //     if (hasScannedRef.current || codes.length === 0) {
  //       return;
  //     }

  //     const firstCode = codes[0]?.value;

  //     if (!firstCode) {
  //       return;
  //     }

  //     const parsed = parseOtpAuthUri(firstCode);

  //     if (!parsed) {
  //       setErrorText('This QR is not a valid otpauth TOTP code.');
  //       return;
  //     }

  //     hasScannedRef.current = true;
  //     setIssuer(parsed.issuer);
  //     setAccount(parsed.account);
  //     setSecret(parsed.secret);
  //     setErrorText('');
  //     setScanMessage('QR scanned. Review details and save.');
  //     setEntryMode('manual');
  //   },
  // });

  const resetAndCloseModal = () => {
    setEntryMode('manual');
    hasScannedRef.current = false;
  };

  const handleDelete = async (id: string) => {
    const updated = accounts.filter(item => item.id !== id);
    await saveAccountsSecurely(updated);
    setAccounts(updated);
  };

  const handleCopyCode = (otp: string) => {
    Clipboard.setString(otp.replace(/\s+/g, ''));
    Alert.alert('Copied', 'Verification code copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        onMenuPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        onSearchPress={() => {
          setSearchOpen(prev => !prev);
          setSearchQuery('');
        }}
      />

      {searchOpen && (
        <View style={styles.searchWrap}>
          <View style={styles.searchCard}>
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color="#64748B"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search issuer or account"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.searchHint}>
            {searchQuery.trim()
              ? `Showing ${filteredAccounts.length} result${
                  filteredAccounts.length === 1 ? '' : 's'
                }`
              : 'Find your saved OTP codes quickly'}
          </Text>
        </View>
      )}

      {/* hide FAB when drawer is open */}
      {isDrawerOpen && <View style={{ height: 1 }} />}

      <FlatList
        data={filteredAccounts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No accounts added yet</Text>
            <Text style={styles.emptyBody}>
              Tap Add Account to scan a QR code or enter a base32 key manually.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          let otp = '------';

          try {
            otp = generateTOTP(item.secret, now, item.digits, item.period);
          } catch {
            otp = 'ERROR!';
          }

          return (
            <OTPCard
              issuer={item.issuer}
              account={item.account}
              otp={otp}
              remaining={remaining}
              period={item.period}
              onCopy={() => handleCopyCode(otp)}
              onDelete={() => handleDelete(item.id)}
            />
          );
        }}
      />

      {/* Floating action button: toggles two small actions (scan / manual) */}
      {!isDrawerOpen && showFabMenu && (
        <>
          <TouchableOpacity
            style={styles.smallFab}
            onPress={() => {
              navigation.navigate('Scan');
              setShowFabMenu(false);
            }}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallFab, { right: 16, bottom: 146 }]}
            onPress={() => {
              navigation.navigate('ManualEntry');
              setShowFabMenu(false);
            }}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}

      {!isDrawerOpen && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setShowFabMenu(prev => !prev);
          }}
        >
          <MaterialCommunityIcons
            name={showFabMenu ? 'close' : 'plus'}
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F8FF',
  },
  listContainer: {
    paddingBottom: 130,
    paddingTop: 6,
  },
  searchWrap: {
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE8F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#0F172A',
    fontSize: 14,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  searchHint: {
    marginTop: 8,
    marginLeft: 4,
    color: '#64748B',
    fontSize: 12,
  },
  emptyState: {
    marginTop: 70,
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE8F5',
    padding: 22,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyBody: {
    color: '#475569',
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 66,
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 7,
  },
  smallFab: {
    position: 'absolute',
    right: 16,
    bottom: 116,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#172554',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 6,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#DCE6F2',
  },
  modalTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
  modeToggleWrap: {
    flexDirection: 'row',
    marginBottom: 14,
    backgroundColor: '#EEF4FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5E5F7',
    padding: 4,
    gap: 8,
  },
  modeToggleButton: {
    flex: 1,
    height: 40,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggleButtonActive: {
    backgroundColor: '#1D9BF0',
  },
  modeToggleText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  cameraFrame: {
    height: 220,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D0E2F6',
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },
  permissionState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  permissionTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionBody: {
    color: '#475569',
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  allowButton: {
    marginTop: 12,
    backgroundColor: '#1D9BF0',
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scanHelperText: {
    color: '#475569',
    marginBottom: 4,
    lineHeight: 19,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D5E5F7',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 6,
  },
  modalActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    height: 46,
  },
  cancelText: {
    color: '#334155',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 46,
    backgroundColor: '#1D9BF0',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default HomeScreen;
