import React, { useEffect, useMemo, useState } from 'react';
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
import Header from '../components/Header';
import OTPCard from '../components/OTPCard';
import {
  loadAccountsSecurely,
  saveAccountsSecurely,
} from '../services/secureStore';
import { generateTOTP, getRemainingSeconds } from '../services/totp';
import type { AuthAccount } from '../types/authenticator';

const DEFAULT_PERIOD = 30;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accounts, setAccounts] = useState<AuthAccount[]>([]);
  const [now, setNow] = useState(Date.now());
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
              color="#FDE68A"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search issuer or account"
              placeholderTextColor="#FECACA"
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
                  color="#FCE7F3"
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
            style={[styles.actionItem, { bottom: 140 }]}
            onPress={() => {
              navigation.navigate('Scan');
              setShowFabMenu(false);
            }}
          >
            <View style={styles.actionLabel}>
              <Text style={styles.actionLabelText}>Scan a QR code</Text>
            </View>
            <View style={styles.smallFab}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={20}
                color="#FFF7ED"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { bottom: 90 }]}
            onPress={() => {
              navigation.navigate('ManualEntry');
              setShowFabMenu(false);
            }}
          >
            <View style={styles.actionLabel}>
              <Text style={styles.actionLabelText}>Enter a setup key</Text>
            </View>
            <View style={styles.smallFab}>
              <MaterialCommunityIcons name="keyboard" size={20} color="#FFF7ED" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fabClose}
            onPress={() => {
              setShowFabMenu(false);
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={30}
              color="#E2E8F0"
            />
          </TouchableOpacity>
        </>
      )}

      {!isDrawerOpen && !showFabMenu && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setShowFabMenu(prev => !prev);
          }}
        >
          <MaterialCommunityIcons
            name={'plus'}
            size={32}
            color="#FFF7ED"
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111318',
  },
  listContainer: {
    paddingBottom: 130,
    paddingTop: 2,
  },
  searchWrap: {
    marginHorizontal: 14,
    marginTop: 2,
    marginBottom: 8,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C0848C',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#8F5F6A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFF1F2',
    fontSize: 15,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.24)',
  },
  searchHint: {
    marginTop: 8,
    marginLeft: 4,
    color: '#94A3B8',
    fontSize: 12,
  },
  emptyState: {
    marginTop: 70,
    marginHorizontal: 24,
    backgroundColor: '#1A1F2B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2B3448',
    padding: 22,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyBody: {
    color: '#94A3B8',
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
    backgroundColor: '#9A5E1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
  },
  actionItem: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionLabel: {
    backgroundColor: '#8F5F6A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5B6BE',
    paddingHorizontal: 14,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabelText: {
    color: '#FFF1F2',
    fontSize: 14,
    fontWeight: '700',
  },
  smallFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#9A5E1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 6,
  },
  fabClose: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#636B7F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default HomeScreen;
