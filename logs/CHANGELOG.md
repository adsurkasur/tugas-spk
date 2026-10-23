# Changelog

## [1.2.0] - 2026-10-23
### Changed
- Presentasi dibangun ulang (mode analitis): judul berupa temuan, chart KPI dari data, foto lapangan, speaker notes, tombol tautan dashboard.
- Generator lama diarsipkan; generator baru `scripts/build_deck.js`.

## [1.1.0] - 2026-10-23
### Fixed
- Angka & klaim presentasi disesuaikan dengan data (volume, satuan, anomali tanggal, kontribusi lahan, distribusi pembeli).
- Link dashboard palsu diganti link Power BI asli.
### Added
- Sheet `Data_Mentah` dan `Ringkasan_KPI` di Excel pengumpulan; `scripts/build_excel_submission.py`.
### Changed
- Desain kartu slide lebih rapi; satuan Fact_Penjualan diseragamkan.

## [1.0.0] - 2026-10-22
- Rilis awal: star schema, proyek PBIP, presentasi 10 slide.
