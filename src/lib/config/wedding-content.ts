/**
 * BERKAS KONFIGURASI KONTEN NARASI EDITORIAL PERNIKAHAN.
 * Bersifat statis, terisolasi dari konfigurasi finansial, dan read-only (immutable).
 * Mengacu pada specs/003-editorial-sections/data-model.md dan DESIGN.md SSoT.
 */

export interface WeddingPerson {
  readonly fullName: string;
  readonly shortName: string;
  readonly title?: string;
  readonly fatherName: string;
  readonly motherName: string;
  readonly photoUrl: string;
  readonly instagramHandle?: string;
  readonly role: 'groom' | 'bride';
}

export interface SacredQuote {
  readonly surahName: string;
  readonly surahNumber: number;
  readonly ayahNumber: number;
  readonly arabicText: string;
  readonly translation: string;
  readonly blessingDuah: string;
}

export interface WeddingEventSession {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly timeRange: string;
  readonly startIso: string;
  readonly endIso: string;
  readonly venueName: string;
  readonly roomName?: string;
  readonly address: string;
  readonly googleMapsUrl: string;
  readonly wazeUrl: string;
}

export interface WeddingContentConfig {
  readonly couple: {
    readonly groom: WeddingPerson;
    readonly bride: WeddingPerson;
  };
  readonly quote: SacredQuote;
  readonly countdownTargetDate: string;
  readonly events: readonly WeddingEventSession[];
  readonly hero: {
    readonly locationCity: string;
    readonly dateFormal: string;
    readonly coverImageUrl: string;
  };
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

export const WEDDING_CONTENT_CONFIG: WeddingContentConfig = deepFreeze({
  couple: {
    groom: {
      fullName: 'Bagus Prasetyo, S.T.',
      shortName: 'Bagus',
      title: 'Putra Pertama',
      fatherName: 'Bapak Dr. Bambang Sudiro',
      motherName: 'Ibu Sri Wahyuni',
      photoUrl: '/images/couple/groom.webp',
      instagramHandle: 'bagusprasetyo',
      role: 'groom',
    },
    bride: {
      fullName: 'Ananda Putri, M.Ds.',
      shortName: 'Ananda',
      title: 'Putri Kedua',
      fatherName: 'Bapak Ir. H. Raden Mas Hendro',
      motherName: 'Ibu Hj. Siti Aminah',
      photoUrl: '/images/couple/bride.webp',
      instagramHandle: 'anandaputri',
      role: 'bride',
    },
  },
  quote: {
    surahName: 'Ar-Rum',
    surahNumber: 30,
    ayahNumber: 21,
    arabicText: 'وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًۭا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةًۭ وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍۢ لِّقَوْمٍۢ يَتَفَكَّرُونَ',
    translation: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
    blessingDuah: "بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ\n\"Semoga Allah memberkahimu, memberkahi atasmu, dan mengumpulkan kalian berdua dalam kebaikan.\"",
  },
  countdownTargetDate: '2026-12-12T01:00:00Z', // 12 Des 2026, 08:00 WIB (UTC+7)
  hero: {
    locationCity: 'Surakarta, Jawa Tengah',
    dateFormal: 'Sabtu, 12 Desember 2026',
    coverImageUrl: '/images/hero/cover-cinematic.webp',
  },
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah',
      date: 'Sabtu, 12 Desember 2026',
      timeRange: '08:00 – 10:00 WIB',
      startIso: '2026-12-12T01:00:00Z',
      endIso: '2026-12-12T03:00:00Z',
      venueName: 'Sasana Handrawina',
      roomName: 'Pendhapa Ageng',
      address: 'Jl. Baluwarti No. 1, Kompleks Keraton Kasunanan Surakarta Hadiningrat, Surakarta',
      googleMapsUrl: 'https://maps.google.com/?q=Keraton+Surakarta+Hadiningrat',
      wazeUrl: 'https://waze.com/ul?q=Keraton+Surakarta+Hadiningrat',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      date: 'Sabtu, 12 Desember 2026',
      timeRange: '11:00 – 14:00 WIB',
      startIso: '2026-12-12T04:00:00Z',
      endIso: '2026-12-12T07:00:00Z',
      venueName: 'Sasana Handrawina',
      roomName: 'Ballroom Utama',
      address: 'Jl. Baluwarti No. 1, Kompleks Keraton Kasunanan Surakarta Hadiningrat, Surakarta',
      googleMapsUrl: 'https://maps.google.com/?q=Keraton+Surakarta+Hadiningrat',
      wazeUrl: 'https://waze.com/ul?q=Keraton+Surakarta+Hadiningrat',
    },
  ],
} as const);
