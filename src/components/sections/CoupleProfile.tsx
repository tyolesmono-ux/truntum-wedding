import React from 'react';
import Image from 'next/image';
import { WeddingPerson } from '@/lib/config/wedding-content';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';
import { Instagram } from 'lucide-react';

export interface CoupleProfileProps {
  readonly groom: WeddingPerson;
  readonly bride: WeddingPerson;
}

interface ProfileCardProps {
  readonly person: WeddingPerson;
}

function ProfileCard({ person }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-surakarta-surface rounded-card border border-surakarta-line shadow-sm space-y-6 max-w-sm mx-auto w-full">
      {/* Bingkai Foto Lengkung Kubah Keraton (Ogee Arch) */}
      <div className="relative p-1.5 rounded-[50%_50%_4px_4px_/_32%_32%_4px_4px] border border-surakarta-gold/50 shadow-inner">
        <div className="relative w-44 h-56 sm:w-48 sm:h-64 overflow-hidden rounded-[50%_50%_4px_4px_/_32%_32%_4px_4px] bg-surakarta-surface-alt">
          <Image
            src={person.photoUrl}
            alt={`Potret ${person.fullName}`}
            fill
            sizes="(max-width: 640px) 176px, 192px"
            unoptimized
            className="w-full h-full object-cover object-center filter brightness-95 contrast-95"
            loading="lazy"
          />
        </div>
      </div>

      {/* Identitas Mempelai */}
      <div className="space-y-2">
        <p className="font-body text-xs tracking-widest text-surakarta-brand-soft uppercase font-medium">
          {person.title || (person.role === 'groom' ? 'Mempelai Pria' : 'Mempelai Wanita')}
        </p>

        <h3 className="font-display text-2xl sm:text-3xl text-surakarta-fg tracking-tight leading-snug">
          {person.fullName}
        </h3>

        {/* Garis Silsilah Orang Tua (Nasab) */}
        <div className="pt-2 text-xs sm:text-sm font-body text-surakarta-fg-body leading-relaxed">
          <p className="text-surakarta-fg-muted text-xs">
            {person.role === 'groom' ? 'Putra dari pasangan:' : 'Putri dari pasangan:'}
          </p>
          <p className="font-medium text-surakarta-fg pt-0.5">{person.fatherName}</p>
          <p className="text-surakarta-fg-muted">&</p>
          <p className="font-medium text-surakarta-fg">{person.motherName}</p>
        </div>
      </div>

      {/* Tautan Media Sosial Instagram Santun */}
      {person.instagramHandle && (
        <div className="pt-2">
          <a
            href={`https://instagram.com/${person.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram @${person.instagramHandle}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-body text-surakarta-fg-muted hover:text-surakarta-brand hover:bg-surakarta-surface-alt/50 transition-colors border border-transparent hover:border-surakarta-line focus:outline-none focus:ring-2 focus:ring-surakarta-gold focus:ring-offset-2"
          >
            <Instagram className="w-3.5 h-3.5 text-surakarta-brand-soft" aria-hidden="true" />
            <span className="font-normal">@{person.instagramHandle}</span>
          </a>
        </div>
      )}
    </div>
  );
}

export function CoupleProfile({ groom, bride }: CoupleProfileProps) {
  return (
    <section
      role="region"
      aria-label="Profil Kedua Mempelai"
      className="relative py-24 md:py-32 px-6 bg-surakarta-surface text-surakarta-fg overflow-hidden text-center"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Judul Seksi Editorial */}
        <div className="space-y-3">
          <p className="font-body text-xs md:text-sm tracking-[0.08em] text-surakarta-brand-soft uppercase font-medium">
            Maha Suci Allah
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-surakarta-fg tracking-[-0.02em]">
            Kedua Mempelai
          </h2>
          <p className="font-body text-sm md:text-base text-surakarta-fg-body max-w-md mx-auto leading-relaxed">
            Dengan memohon rahmat dan ridho Allah Subhanahu wa Ta&#39;ala, kami bermaksud melangsungkan pernikahan putra-putri kami:
          </p>
        </div>

        {/* Layout Responsif: Stack di Mobile, 2 Kolom di Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-items-center">
          {/* Mempelai Wanita (Tradisi Javanese wedding: Ananda) */}
          <ProfileCard person={bride} />

          {/* Pemisah Simbolik Mobile */}
          <div className="md:hidden w-full flex flex-col items-center my-2">
            <span className="font-display italic text-3xl text-surakarta-gold mb-2">&</span>
            <TruntumDivider className="w-full" />
          </div>

          {/* Mempelai Pria (Bagus) */}
          <ProfileCard person={groom} />
        </div>
      </div>
    </section>
  );
}
