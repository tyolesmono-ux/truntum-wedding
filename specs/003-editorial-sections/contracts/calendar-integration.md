# Interface Contract: Integrasi Kalender (Google Calendar & iCal .ics)

**Feature**: `003-editorial-sections`  
**Standard Reference**: RFC 5545 (Internet Calendaring and Scheduling Core Object Specification)  

---

## 1. Google Calendar Web Action Link

### Template URL
```text
https://calendar.google.com/calendar/render?action=TEMPLATE&text={TITLE}&dates={START_UTC}/{END_UTC}&details={DETAILS}&location={LOCATION}
```

### Parameter Specification
- `action`: Wajib bernilai `TEMPLATE`.
- `text`: Judul acara yang di-encode URI (contoh: `Akad%20Nikah%20Ananda%20%26%20Bagus`).
- `dates`: Format gabungan tanggal mulai dan selesai dalam format UTC ISO ringkas: `YYYYMMDDTHHmmssZ/YYYYMMDDTHHmmssZ`.
  - Contoh untuk Akad 12 Desember 2026 08:00–10:00 WIB (UTC+7):
    - Mulai: 01:00 UTC $\rightarrow$ `20261212T010000Z`
    - Selesai: 03:00 UTC $\rightarrow$ `20261212T030000Z`
    - Nilai `dates`: `20261212T010000Z/20261212T030000Z`
- `details`: Deskripsi acara yang di-encode URI.
- `location`: Nama gedung dan alamat lengkap venue yang di-encode URI.

---

## 2. Format Berkas Universal iCalendar (.ics)

### Payload String Generator Contract
```text
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bespoke Luxury Digital Wedding//ID
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:{EVENT_ID}-20261212@truntum.wedding
DTSTAMP:{CURRENT_UTC_TIMESTAMP}
DTSTART:{START_UTC}
DTEND:{END_UTC}
SUMMARY:{TITLE}
DESCRIPTION:{DETAILS}
LOCATION:{LOCATION}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Pengingat Pernikahan Ananda & Bagus
TRIGGER:-PT2H
END:VALARM
END:VEVENT
END:VCALENDAR
```

### Mekanisme Download Klien (Blob Client Download)
```typescript
export function downloadIcsFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```
