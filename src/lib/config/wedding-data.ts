/**
 * BERKAS INI ADALAH SERVER-SIDE IMMUTABLE CONSTANTS.
 * DILARANG MENAMBAHKAN ENDPOINT MUTASI UNTUK OBJEK-OBJEK INI.
 * Mengacu pada SECURITY.md Bagian 2 dan DATABASE_ERD.md Bagian 1.
 */

export interface BankAccount {
  readonly bankName: string;
  readonly accountNumber: string;
  readonly accountHolder: string;
  readonly copyPayload: string;
}

export interface QrisConfig {
  readonly imageUrl: string;
  readonly altText: string;
  readonly merchantName: string;
}

export interface WeddingGiftConfig {
  readonly accounts: readonly BankAccount[];
  readonly qris: QrisConfig;
}

export interface EmergencyFeatureFlags {
  readonly isGuestbookFormActive: boolean;
  readonly isRealtimeBroadcastActive: boolean;
}

function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  (Object.getOwnPropertyNames(obj) as Array<keyof T>).forEach((prop) => {
    const value = obj[prop];
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value as object);
    }
  });
  return obj;
}

export const WEDDING_GIFT_CONFIG: WeddingGiftConfig = deepFreeze({
  accounts: [
    {
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '1234567890',
      accountHolder: 'BAGUS PRASETYO',
      copyPayload: '1234567890',
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '0987654321000',
      accountHolder: 'ANANDA PUTRI',
      copyPayload: '0987654321000',
    },
  ],
  qris: {
    imageUrl: '/images/gift/qris-official.webp',
    altText: 'QRIS Resmi Pernikahan Ananda & Bagus',
    merchantName: 'NMID: ID1020304050607',
  },
} as const);

export const EMERGENCY_FEATURE_FLAGS: EmergencyFeatureFlags = deepFreeze({
  isGuestbookFormActive: true,
  isRealtimeBroadcastActive: true,
} as const);
