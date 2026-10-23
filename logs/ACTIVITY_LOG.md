# Activity Log

## [2026-10-23 10:30] Claude Code (Opus 5.5) — Finalisasi berkas pengumpulan
- **Goal**: Siapkan Excel + PDF 10 slide yang siap diunggah ke brone.ub.ac.id.
- **Actions**:
  - Verifikasi ulang 5 KPI dari `data_csv/` (total Rp 29.818.920, 549 transaksi: cocok).
  - Koreksi slide: volume 2.378 → 2.116; satuan KPI 4 (Melon 860 kg, Pete 487 pack); jumlah anomali tanggal (7 baris + 2 teks); 3 KPI cards (bukan 5); klaim "per meter persegi" diganti kontribusi lahan riil (SGH 88,3%); 193/214 pembeli < Rp300 rb.
  - Ganti link dashboard palsu dengan link Share Power BI asli dari mahasiswa; link bisa diklik di PDF.
  - Desain kartu slide: rounded rectangle → panel datar + aksen kiri, ukuran huruf menyesuaikan isi.
  - Seragamkan satuan Fact_Penjualan (`kg`→`Kg`, `paket`→`Pack`) di CSV & Excel.
  - Excel: tambah sheet `Data_Mentah` (salinan buku kasir) dan `Ringkasan_KPI`.
- **Files**: `scripts/generate_presentation.py`, `scripts/build_excel_submission.py` (baru), `Data_Warehouse_BBPP_Ketindan_Cleaned.xlsx`, `data_csv/Fact_Penjualan.csv`, `Presentasi_DSS_BBPP_Ketindan.{pptx,pdf}`, README/HANDOFF/panduan.
- **Verification**: `python scripts/build_excel_submission.py` (assert lulus); PDF 10 halaman, link Power BI & GitHub terdeteksi sebagai URI; semua halaman diperiksa visual.
