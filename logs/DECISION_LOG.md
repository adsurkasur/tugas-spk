# Decision Log

## [DEC-004] Konvensi nama dan struktur root
- **Date**: 2026-10-23 · **Status**: Accepted
- **Context**: Nama lama (BBPP_Ketindan_DSS, Data_Warehouse_BBPP_...) tidak cocok dengan nama report yang dipublikasikan; root penuh berkas kerja.
- **Decision**: Awalan `SPK_Ade Surya Ananda_2646000083_` + nomor urut 1–4 sesuai alur data (mentah → bersih → warehouse → presentasi) + `_PowerBI.pbip`. Bahan lain di `Pendukung/`; `logs/` tetap di root sesuai protokol AGENTS.md. Model Power BI tetap membaca CSV (path absolut) agar visual tidak berubah.
- **Alternatives**: Mengarahkan model ke Excel data warehouse (perlu mengubah semua query M dan tidak bisa diuji tanpa Power BI Desktop).
- **Affected**: struktur repo, PBIP, TMDL, script build, presentasi.

## [DEC-003] Deck dibangun ulang dengan pptxgenjs, angka diikat ke data
- **Date**: 2026-10-23 · **Status**: Accepted
- **Context**: Deck python-pptx lama berisi angka ketikan tangan yang sempat salah, kotak teks setengah kosong.
- **Decision**: `scripts/build_deck.js` membaca `data_csv/` dan menghitung KPI sendiri (assert total 29.818.920); 10 halaman termasuk judul agar sesuai batas tugas; tanpa backup slide.
- **Alternatives**: Memperbaiki generator lama (tetap rawan angka ketikan). Nama pembeli perorangan bergelar disamarkan; nama dagang grosir/vendor ditampilkan.
- **Affected**: `scripts/build_deck.js`, `scripts/_archive/generate_presentation.py`, presentasi.

## [DEC-001] Tautan dashboard memakai Power BI Share link (trial), bukan Publish to Web
- **Date**: 2026-10-23 · **Status**: Accepted
- **Context**: Pedoman meminta tautan dashboard yang dipublikasikan; Publish to Web/Share butuh lisensi Pro, mahasiswa memakai trial.
- **Decision**: Pakai link Share dari akun trial di slide 10.
- **Alternatives**: Publish to Web (diblokir tenant/lisensi). Risiko: trial berakhir ±60 hari dan penerima harus login akun organisasi yang diberi akses.
- **Affected**: `scripts/generate_presentation.py` (`DASHBOARD_URL`), PDF slide 10.

## [DEC-002] Satuan `paket` digabung ke `Pack`
- **Date**: 2026-10-23 · **Status**: Accepted
- **Context**: Pete tercatat `Pack` (46) dan `paket` (44) dengan harga sama Rp5.000.
- **Decision**: Normalisasi ke `Pack`; `kg` → `Kg`. Grade `A curah`/`A Curah` dibiarkan agar ProductKey dan model Power BI tidak berubah.
- **Affected**: `data_csv/Fact_Penjualan.csv`, sheet `Fact_Penjualan`.
