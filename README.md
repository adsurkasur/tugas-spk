# Proyek DSS & BI Dashboard Kebun Hortikultura BBPP Ketindan

Repositori ini memuat implementasi lengkap **Sistem Penunjang Keputusan (DSS)** berbasis **Business Intelligence (Power BI)** untuk unit kebun produksi **Balai Besar Pelatihan Pertanian (BBPP) Ketindan, Lawang - Malang** (Kementerian Pertanian RI).

Proyek ini disusun untuk memenuhi tugas perkuliahan Sistem Penunjang Keputusan dengan standar perancangan **Kimball Star Schema Data Warehouse** dan pelaporan eksekutif 10 slide.

---

## 1. Berkas Utama Pengumpulan Tugas (`brone.ub.ac.id`)
Berdasarkan ketentuan pada pedoman tugas, dua berkas utama yang siap dikumpulkan:
1. **File Excel Data Bersih Star Schema**:
   - [`Data_Warehouse_BBPP_Ketindan_Cleaned.xlsx`](./Data_Warehouse_BBPP_Ketindan_Cleaned.xlsx)
   - Terdiri dari 1 Tabel Fakta (`Fact_Penjualan`) dan 4 Tabel Dimensi (`Dim_Waktu`, `Dim_Produk`, `Dim_Pelanggan`, `Dim_Lahan`).
2. **File Presentasi Eksekutif 10 Slide (Format PDF)**:
   - [`Presentasi_DSS_BBPP_Ketindan.pdf`](./Presentasi_DSS_BBPP_Ketindan.pdf)
   - Versi PowerPoint (editable): [`Presentasi_DSS_BBPP_Ketindan.pptx`](./Presentasi_DSS_BBPP_Ketindan.pptx)
   - Dilengkapi *screenshots* dashboard Power BI nyata, diagram skema bintang, evaluasi 5 KPI, wawasan bisnis pareto 80/20, dan rekomendasi manajerial.

---

## 2. Proyek Power BI (PBIP)
- **File Proyek Power BI**: [`BBPP_Ketindan_DSS.pbip`](./BBPP_Ketindan_DSS.pbip)
  - Cukup klik ganda file ini untuk membukanya langsung di **Power BI Desktop**.
- **Model Data Semantik TMDL**: [`BBPP_Ketindan_DSS.SemanticModel/`](./BBPP_Ketindan_DSS.SemanticModel/)
  - Menggunakan format modern *Tabular Model Definition Language* (TMDL).
  - Hubungan relasional antar-tabel (*1-to-many*) dan ukuran DAX telah dikonfigurasi aktif.
- **Definisi Report**: [`BBPP_Ketindan_DSS.Report/`](./BBPP_Ketindan_DSS.Report/)
- **Data CSV Tables**: [`data_csv/`](./data_csv/)
- **Panduan Formula DAX & Layout Visual**: [`panduan/DAX_MEASURES_AND_VISUAL_GUIDE.txt`](./panduan/DAX_MEASURES_AND_VISUAL_GUIDE.txt)

---

## 3. Ringkasan 5 Key Performance Indicators (KPI)
Berdasarkan data aktual 549 transaksi periode 3 Agustus – 25 September 2026 (Total Omzet: **Rp 29.818.920**):

| KPI | Indikator | Nilai / Temuan Utama | Keputusan Manajerial |
|---|---|---|---|
| **KPI 1** | Pendapatan per Minggu | Puncak panen raya terjadi di **Minggu ke-36 (Rp 15.121.720)** | Menerapkan *staggered planting* agar pasokan merata |
| **KPI 2** | Pendapatan per Bulan | **Agustus:** Rp 10.597.000 \| **September:** Rp 19.221.920 (+81,4%) | Evaluasi pencapaian target berkala dan kesiapan logistik |
| **KPI 3** | Produk Pendapatan Terbesar | **Melon Sweet Lavender (Rp 14.436.800)** & **Tomat Cherry (Rp 9.603.500)** | Alokasi anggaran perawatan & varietas prioritas |
| **KPI 4** | Produk Terbanyak Terjual (Volume) | **Melon Sweet Lavender (860 kg)** & **Pete (487 pack)** | Pencegahan pembusukan panen & perputaran inventaris |
| **KPI 5** | Pembeli Belanja Terbanyak | **B Rara Surabaya (Rp 2,87 Jt)** & **P Joni Batu (Rp 2,70 Jt)** | Kontrak kemitraan *pre-order* & komitmen serapan |

---

## 4. Struktur Direktori Proyek

```text
tugas-spk/
├── README.md                                 # Dokumentasi lengkap proyek
├── AGUSTUS SEPT 2026.xlsx                    # Data mentah asli transaksi kebun
│
├── Data_Warehouse_BBPP_Ketindan_Cleaned.xlsx # [BERKAS KUMPUL 1] Excel Data Warehouse Star Schema
├── Presentasi_DSS_BBPP_Ketindan.pdf          # [BERKAS KUMPUL 2] PDF Presentasi 10 Slide
├── Presentasi_DSS_BBPP_Ketindan.pptx         # File presentasi PowerPoint editable
│
├── BBPP_Ketindan_DSS.pbip                    # [POWER BI] File proyek Power BI Desktop
├── BBPP_Ketindan_DSS.SemanticModel/          # Model data TMDL & relasi antar tabel
├── BBPP_Ketindan_DSS.Report/                 # Definisi tampilan laporan Power BI
├── data_csv/                                 # File CSV sumber data tabel model
│
├── assets/
│   └── screenshots/                          # Tangkapan layar visual dashboard & skema bintang
│       ├── powerbi_dashboard_overview.png
│       └── star_schema_architecture.png
│
├── panduan/                                  # Instruksi tugas & panduan rumus/slide
│   ├── tugas1.pdf                            # Panduan resmi tugas 1 perkuliahan
│   ├── 5 kpi tugas.txt                       # Catatan 5 pertanyaan KPI
│   ├── PANDUAN_PRESENTASI_10_SLIDE.md        # Transkrip lengkap isi 10 slide presentasi
│   └── DAX_MEASURES_AND_VISUAL_GUIDE.txt     # Rumus DAX & rekomendasi kanvas visual
│
├── materi_kuliah/                            # Kumpulan referensi materi kuliah (lect01 - lect07)
│   ├── lect01-intro to dss.pdf
│   ├── lect02-process_system_model.pdf
│   ├── lect03-dss_architecture.pdf
│   ├── lect05-intro_to_data_warehouse.pdf
│   ├── lect06-dw_design.pdf
│   ├── lect07-bi.pdf
│   └── Sistem Penunjang Keputusan Spreadsheet.pdf
│
└── scripts/                                  # Skrip Python otomasi data & rendering
    ├── generate_tmdl.py                      # Generator semantik model Power BI
    ├── generate_screenshots.py               # Generator visual mockup dashboard & diagram
    └── build_deck.js                         # Generator deck 10 slide (pptxgenjs), angka dari data_csv/
```
