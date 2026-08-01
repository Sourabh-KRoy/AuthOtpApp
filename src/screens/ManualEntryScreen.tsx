import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateTOTP } from '../services/totp';
import {
  loadAccountsSecurely,
  saveAccountsSecurely,
} from '../services/secureStore';

const parseOtpAuthUri = (rawValue: string) => {
  if (!rawValue.toLowerCase().startsWith('otpauth://totp/')) {
    return null;
  }

  const payload = rawValue.replace(/^otpauth:\/\/totp\//i, '');
  const [encodedLabel, query = ''] = payload.split('?');
  const queryParams = query
    .split('&')
    .reduce<Record<string, string>>((acc, pair) => {
      if (!pair) return acc;
      const [key, ...valueParts] = pair.split('=');
      if (!key) return acc;
      const paramKey = decodeURIComponent(key).toLowerCase();
      const paramValue = decodeURIComponent(valueParts.join('=') || '');
      acc[paramKey] = paramValue;
      return acc;
    }, {});

  const normalizedSecret = (queryParams.secret || '')
    .replace(/\s+/g, '')
    .replace(new RegExp('=', 'g'), '')
    .toUpperCase();

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

  return { issuer, account, secret: normalizedSecret };
};

export default function ManualEntryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const scanned = route.params?.scanned as string | undefined;

  const [issuer, setIssuer] = useState('');
  const [account, setAccount] = useState('');
  const [secret, setSecret] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (scanned) {
      const parsed = parseOtpAuthUri(scanned);
      if (parsed) {
        setIssuer(parsed.issuer);
        setAccount(parsed.account);
        setSecret(parsed.secret);
      }
    }
  }, [scanned]);

  const handleSave = async () => {
    if (!issuer.trim() || !account.trim() || !secret.trim()) {
      setErrorText('All fields are required.');
      return;
    }

    const normalizedSecret = secret
      .replace(/\s+/g, '')
      .replace(new RegExp('=', 'g'), '');

    try {
      generateTOTP(normalizedSecret, Date.now());
    } catch (e) {
      setErrorText('Invalid secret. Use a valid base32 key.');
      return;
    }

    const newAccount = {
      id: `${Date.now()}`,
      issuer: issuer.trim(),
      account: account.trim(),
      secret: normalizedSecret,
      digits: 6,
      period: 30,
    } as any;

    const existing = await loadAccountsSecurely();
    const updated = [newAccount, ...existing];
    await saveAccountsSecurely(updated);

    Alert.alert('Saved', 'Account saved securely.');
    navigation.navigate('Authenticator');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#E2E8F0" />
        </TouchableOpacity>
        <Text style={styles.title}>Enter code details</Text>
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <Text style={styles.label}>Code name</Text>
      <TextInput
        value={issuer}
        onChangeText={setIssuer}
        style={styles.input}
        placeholder="Google"
        placeholderTextColor="#7B8799"
      />

      <Text style={styles.label}>Account</Text>
      <TextInput
        value={account}
        onChangeText={setAccount}
        style={styles.input}
        placeholder="john@email.com"
        placeholderTextColor="#7B8799"
      />

      <Text style={styles.label}>Your key</Text>
      <TextInput
        value={secret}
        onChangeText={setSecret}
        style={styles.input}
        autoCapitalize="characters"
        placeholder="ABCD EFGH IJKL"
        placeholderTextColor="#7B8799"
      />

      <Text style={styles.label}>Type of key</Text>
      <View style={styles.selectBox}>
        <Text style={styles.selectText}>Time based</Text>
        <MaterialCommunityIcons name="chevron-down" size={22} color="#E2E8F0" />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111318',
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#232836',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  label: {
    marginTop: 12,
    marginLeft: 4,
    color: '#CBD5E1',
    fontSize: 13,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#4B5567',
    borderRadius: 12,
    backgroundColor: '#171B24',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    marginTop: 6,
  },
  selectBox: {
    marginTop: 6,
    height: 56,
    borderWidth: 1,
    borderColor: '#4B5567',
    borderRadius: 12,
    backgroundColor: '#171B24',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: '#E2E8F0',
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 'auto',
    marginBottom: 24,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 18,
  },
  errorText: {
    color: '#FCA5A5',
    marginBottom: 6,
    marginTop: -2,
  },
});
