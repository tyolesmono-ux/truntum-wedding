/**
 * Kontrak Komponen Gerbang Pembuka (Virtual Envelope Subsystem)
 * SSoT: docs/DOKUMEN_TEKNIS/DESIGN.md & PRD.md
 */

import React from 'react';

export interface VirtualEnvelopeProps {
  /**
   * Nama tamu undangan hasil sanitasi (contoh: "Budi Sekeluarga" atau "Tamu Undangan").
   */
  guestName?: string;

  /**
   * Callback opsional yang dipanggil saat urutan animasi pembukaan selesai dan amplop di-unmount.
   */
  onOpened?: () => void;
}

export interface WaxSealProps {
  /**
   * Callback saat segel lilin diklik / diaktifkan.
   */
  onClick: () => void;

  /**
   * Status apakah animasi pembukaan sedang aktif berlangsung.
   */
  isOpening?: boolean;

  /**
   * Inisial monogram yang ditampilkan di tengah segel (default: "A & B").
   */
  monogram?: string;

  /**
   * Custom CSS class name.
   */
  className?: string;
}

export interface InvitationLetterProps {
  /**
   * Nama tamu yang tercetak pada kartu surat.
   */
  guestName: string;

  /**
   * Status apakah surat sedang meluncur keluar kantong.
   */
  isSliding?: boolean;

  /**
   * Custom CSS class name.
   */
  className?: string;
}

export interface FloatingVinylProps {
  /**
   * Custom CSS class name.
   */
  className?: string;
}
