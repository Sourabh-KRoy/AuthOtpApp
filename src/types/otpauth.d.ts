declare module 'otpauth' {
  export interface TOTPOptions {
    secret: string;
    issuer?: string;
    label?: string;
    algorithm?: string;
    digits?: number;
    period?: number;
  }

  export interface TOTPGenerateOptions {
    timestamp?: number;
  }

  export class TOTP {
    constructor(options: TOTPOptions);
    generate(options?: TOTPGenerateOptions): string;
    static generate(options: TOTPOptions & TOTPGenerateOptions): string;
  }
}
