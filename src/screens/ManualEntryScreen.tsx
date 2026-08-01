import React, { useEffect, useState } from 'react';
import {
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
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0B3558" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Account</Text>
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <Text style={styles.label}>Issuer</Text>
      <TextInput value={issuer} onChangeText={setIssuer} style={styles.input} />

      <Text style={styles.label}>Account</Text>
      <TextInput
        value={account}
        onChangeText={setAccount}
        style={styles.input}
      />

      <Text style={styles.label}>Secret (base32)</Text>
      <TextInput
        value={secret}
        onChangeText={setSecret}
        style={styles.input}
        autoCapitalize="characters"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Securely</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7FBFF', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#0B3558', marginLeft: 8 },
  label: { marginTop: 10, color: '#475569' },
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
  saveButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1D9BF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
  errorText: { color: '#DC2626' },
});
