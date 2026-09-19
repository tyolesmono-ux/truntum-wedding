/**
 * Kontrak Antarmuka Audio Engine (Web Audio API)
 * SSoT: docs/DOKUMEN_TEKNIS/DESIGN.md & .specify/memory/constitution.md
 */

export interface AudioContextValue {
  /**
   * Menunjukkan apakah audio saat ini sedang aktif berputar.
   */
  readonly isPlaying: boolean;

  /**
   * Menunjukkan apakah audio dalam mode bisu (mute).
   */
  readonly isMuted: boolean;

  /**
   * Menunjukkan apakah Web Audio API AudioContext telah dibuka kuncinya oleh gestur fisik pengguna.
   */
  readonly isUnlocked: boolean;

  /**
   * Membuka kunci AudioContext dan memulai pemutaran audio dengan kurva fade-in 0.0 -> 0.8 dalam 2.5 detik.
   * Hanya boleh dipanggil atas respons langsung dari event interaksi pengguna (click/touch).
   */
  unlockAndPlay: () => Promise<void>;

  /**
   * Beralih antara status jeda dan putar dengan transisi suara halus (micro-fade 150ms).
   */
  togglePlay: () => void;

  /**
   * Beralih antara status bisu (mute) dan aktif.
   */
  toggleMute: () => void;
}

export interface AudioProviderProps {
  children: React.ReactNode;
}
