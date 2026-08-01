import * as Keychain from 'react-native-keychain';
import type { AuthAccount } from '../types/authenticator';

const KEYCHAIN_SERVICE = 'authenticator.accounts.v1';
const KEYCHAIN_USERNAME = 'accounts';

export const saveAccountsSecurely = async (accounts: AuthAccount[]) => {
  const payload = JSON.stringify(accounts);

  await Keychain.setGenericPassword(KEYCHAIN_USERNAME, payload, {
    service: KEYCHAIN_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const loadAccountsSecurely = async (): Promise<AuthAccount[]> => {
  const result = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });

  if (!result) {
    return [];
  }

  try {
    const parsed = JSON.parse(result.password);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
};
