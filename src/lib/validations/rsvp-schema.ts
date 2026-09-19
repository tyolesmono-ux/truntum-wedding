import { z } from 'zod';

export const attendanceEnum = z.enum(['attending', 'declined'], {
  errorMap: () => ({ message: 'Pilih konfirmasi kehadiran yang valid.' }),
});

export const rsvpSchema = z.object({
  guest_name: z
    .string({ required_error: 'Nama tamu wajib diisi.' })
    .trim()
    .min(2, { message: 'Nama tamu minimal 2 karakter.' })
    .max(60, { message: 'Nama tamu maksimal 60 karakter.' }),

  attendance_status: attendanceEnum,

  pax_count: z
    .number({ invalid_type_error: 'Jumlah tamu harus berupa angka.' })
    .int({ message: 'Jumlah tamu harus berupa bilangan bulat.' })
    .min(1, { message: 'Jumlah tamu minimal 1 orang.' })
    .max(5, { message: 'Jumlah tamu maksimal 5 orang.' })
    .default(1),

  message: z
    .string({ required_error: 'Pesan ucapan wajib diisi.' })
    .trim()
    .min(3, { message: 'Pesan ucapan minimal 3 karakter.' })
    .max(500, { message: 'Pesan ucapan maksimal 500 karakter.' }),

  turnstile_token: z
    .string({ required_error: 'Verifikasi keamanan captcha wajib diisi.' })
    .min(1, { message: 'Verifikasi keamanan captcha wajib diisi.' }),
});

export type RSVPInput = z.infer<typeof rsvpSchema>;

export type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[] | undefined> };

export interface RSVPRecordOutput {
  id: string;
  guest_name: string;
  attendance_status: 'attending' | 'declined';
  pax_count: number;
  message: string;
  created_at: string;
}
