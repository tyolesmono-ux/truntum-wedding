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

export interface LoveStoryMilestone {
  readonly id: string;
  readonly year: string;
  readonly period: string;
  readonly title: string;
  readonly story: string;
}

export interface GalleryPhoto {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: 'landscape' | 'portrait';
  readonly caption?: string;
  readonly blurDataUrl?: string;
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
  readonly loveStory: readonly LoveStoryMilestone[];
  readonly gallery: readonly GalleryPhoto[];
}

// Placeholder buram Kertas Batik (#E8DCC8) sesuai DESIGN.md 9.3, dipakai seluruh foto galeri.
const KERTAS_BATIK_BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23E8DCC8'/%3E%3C/svg%3E";

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
  loveStory: [
    {
      id: 'pertemuan-pertama',
      year: '2021',
      period: 'Agustus 2021',
      title: 'Awal mula pertemuan',
      story:
        'Di bawah naungan keteduhan kota Surakarta, takdir mempertemukan dua insan dalam perbincangan santun yang menumbuhkan rasa saling percaya dan saling menghargai.',
    },
    {
      id: 'ikrar-komitmen',
      year: '2024',
      period: 'Mei 2024',
      title: 'Menjalin doa dan komitmen',
      story:
        'Seiring berjalannya waktu dan kedewasaan hati, doa-doa yang terpanjat perlahan menemukan muaranya untuk saling menjaga, melangkah beriringan, dan memohon ridho kedua orang tua.',
    },
    {
      id: 'menuju-pelaminan',
      year: '2026',
      period: 'Oktober 2026',
      title: 'Langkah menuju janji suci',
      story:
        'Dengan restu dan doa tulus seluruh keluarga besar, kami memantapkan niat suci untuk mengikat janji setia dalam bingkai pernikahan yang sakral dan penuh berkah.',
    },
  ],
  gallery: [
    {
      id: 'gallery-01',
      src: '/images/gallery/gallery-01-momen-berdua.svg',
      alt: 'Bagus dan Ananda berfoto berdua di pelataran keraton Surakarta',
      width: 1200,
      height: 675,
      aspectRatio: 'landscape',
      caption: 'Momen berdua di pelataran keraton.',
      blurDataUrl: KERTAS_BATIK_BLUR,
    },
    {
      id: 'gallery-02',
      src: '/images/gallery/gallery-02-potret-tradisional.svg',
      alt: 'Potret Ananda mengenakan busana tradisional Solo dengan kain batik sogan',
      width: 900,
      height: 1200,
      aspectRatio: 'portrait',
      caption: 'Busana tradisional Solo dalam balutan batik sogan.',
      blurDataUrl: KERTAS_BATIK_BLUR,
    },
    {
      id: 'gallery-03',
      src: '/images/gallery/gallery-03-detail-batik.svg',
      alt: 'Detail selendang batik sogan dan aksesori pengantin wanita',
      width: 900,
      height: 1200,
      aspectRatio: 'portrait',
      caption: 'Detail selendang batik sogan dan aksesori.',
      blurDataUrl: KERTAS_BATIK_BLUR,
    },
    {
      id: 'gallery-04',
      src: '/images/gallery/gallery-04-arsitektur-surakarta.svg',
      alt: 'Bagus dan Ananda berlatar arsitektur klasik Surakarta',
      width: 1200,
      height: 675,
      aspectRatio: 'landscape',
      caption: 'Arsitektur klasik Surakarta sebagai latar.',
      blurDataUrl: KERTAS_BATIK_BLUR,
    },
    {
      id: 'gallery-05',
      src: '/images/gallery/gallery-05-potret-senyum.svg',
      alt: 'Potret wajah Ananda dengan senyuman tulus',
      width: 900,
      height: 1200,
      aspectRatio: 'portrait',
      caption: 'Senyuman tulus menjelang hari bahagia.',
      blurDataUrl: KERTAS_BATIK_BLUR,
    },
    {
      id: 'gallery-06',
      src: '/images/gallery/gallery-06-genggaman-do.svg',
      alt: 'Tangan Bagus dan Ananda tergenggam dalam doa bersama',
      width: 900,
      height: 1200,
      aspectRatio: 'portrait',
      caption: 'Doa bersama dalam genggaman tangan.',
      blurDataUrl: KERTAS_BATIK_BLUR,
    },
    {
      id: 'gallery-07',
      src: '/images/gallery/gallery-07-siluet-senja.svg',
      alt: 'Siluet Bagus dan Ananda di balai kota Surakarta saat senja',
      width: 1200,
      height: 675,
      aspectRatio: 'landscape',
      caption: 'Siluet senja di balai kota Surakarta.',
      blurDataUrl: KERTAS_BATIK_BLUR,
    },
  ],
} as const);
