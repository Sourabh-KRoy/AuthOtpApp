import { TOTP } from 'otpauth';

const normalizeSecret = (secret: string) =>
  secret.replace(/\s+/g, '').replace(/=/g, '').toUpperCase();

export const getRemainingSeconds = (period = 30, timestamp = Date.now()) => {
  const elapsed = Math.floor(timestamp / 1000) % period;
  return period - elapsed;
};

export const generateTOTP = (
  base32Secret: string,
  timestamp = Date.now(),
  digits = 6,
  period = 30,
): string => {
  const normalizedSecret = normalizeSecret(base32Secret);

  return new TOTP({
    secret: normalizedSecret,
    digits,
    period,
  }).generate({ timestamp });
};
