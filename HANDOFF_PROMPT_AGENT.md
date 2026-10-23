# AGENT HANDOFF PROMPT: PROYEK DSS & BI DASHBOARD BBPP KETINDAN

Dokumen ini adalah **Master Continuation / Handoff Guide** bagi AI Agent untuk melanjutkan, merevisi, mengekspor tangkapan layar, dan menyempurnakan file presentasi (PPTX/PDF) serta proyek Power BI pada repositori tugas SPK.

---

## 1. Konteks Proyek & Identitas Mahasiswa
- **Subjek Organisasi**: Balai Besar Pelatihan Pertanian (BBPP) Ketindan, Lawang - Malang (Kementerian Pertanian RI).
  - *Catatan Penting*: Ini adalah unit kebun produksi & kebun pelatihan vokasi agribisnis Kementan, **BUKAN** unit internal UB. Pembelinya terdiri dari pedagang grosir antar-kota (Surabaya, Batu), rekanan vendor greenhouse, koperasi, dan pembeli retail.
- **Nama Mahasiswa**: Ade Surya Ananda
- **NIM**: 2646000083
- **Mata Kuliah**: Sistem Penunjang Keputusan (SPK) / Business Intelligence
- **Platform Analitik**: Microsoft Power BI Desktop (Developer Mode / PBIP)
- **Tenggat Pengumpulan**: 23 Oktober 2026 ke portal `brone.ub.ac.id`

---

## 2. Struktur Repositori & Lokasi Berkas
Repositori ini bertempat di submodule:
`E:\Managed Projects\tugas-spk\` (GitHub: `https://github.com/adsurkasur/tugas-spk.git`, branch: `main`).

```text
tugas-spk/
├── README.md                                 # Navigasi & dokumentasi utama
├── HANDOFF_PROMPT_AGENT.md                   # Dokumen ini (panduan agen selanjutnya)
├── AGUSTUS SEPT 2026.xlsx                    # Raw transaction dataset
├── Data_Warehouse_BBPP_Ketindan_Cleaned.xlsx # [OUTPUT 1] Cleaned Star Schema Excel
│
├── BBPP_Ketindan_DSS.pbip                    # Proyek Power BI (PBIP)
├── BBPP_Ketindan_DSS.SemanticModel/          # TMDL semantic model & definition.pbism (v4.0)
│   └── definition/
│       ├── database.tmdl, model.tmdl, relationships.tmdl
│       └── tables/ (Fact_Penjualan, Dim_Waktu, Dim_Produk, Dim_Pelanggan, Dim_Lahan)
├── BBPP_Ketindan_DSS.Report/                 # PBIR report format & definition/pages/
├── data_csv/                                 # Data sumber tabel DW (Fact & Dims)
│
├── assets/screenshots/                       # Asset tangkapan layar untuk slide
│   ├── powerbi_dashboard_overview.png        # Screenshot tampilan Report View kanvas
│   └── star_schema_architecture.png          # Screenshot tampilan Model View relasi
│
├── Presentasi_DSS_BBPP_Ketindan.pptx         # File slide presentasi PowerPoint
├── Presentasi_DSS_BBPP_Ketindan.pdf          # [OUTPUT 2] File presentasi 10 slide resmi
│
├── panduan/
│   ├── tugas1.pdf                            # Panduan resmi tugas dari dosen
│   ├── 5 kpi tugas.txt                       # Catatan 5 KPI acuan
│   ├── PANDUAN_PRESENTASI_10_SLIDE.md        # Teks lengkap isi per slide
│   └── DAX_MEASURES_AND_VISUAL_GUIDE.txt     # Rumus DAX & panduan kanvas visual
│
└── scripts/
    ├── generate_tmdl.py                      # Skrip pembuat TMDL model
    ├── generate_screenshots.py               # Generator visual mockup cadangan
    └── build_deck.js                         # Generator deck 10 slide (pptxgenjs) + convert_pdf.ps1
```

---

## 3. Data Warehouse Star Schema & Ukuran Finansial
- **Total Transaksi Riil**: 549 baris (periode: 3 Agustus – 25 September 2026, 8 minggu penuh).
- **Total Omzet**: Rp 29.818.920.
- **Tabel Fakta**: `Fact_Penjualan` (`TransactionID`, `DateKey`, `ProductKey`, `CustomerKey`, `LahanKey`, `Volume`, `Satuan`, `HargaSatuan`, `TotalPendapatan`).
- **Tabel Dimensi**:
  1. `Dim_Waktu` (36 tanggal unik: Hari, MingguKe, LabelMinggu `Minggu-32` s.d. `Minggu-39`, NamaBulan `Agustus`/`September`, Tahun `2026`).
  2. `Dim_Produk` (16 komoditas unik: Melon Sweet Lavender, Tomat Cherry, Pete, Melon Sweet Hammy, dll. beserta Grade Mutu).
  3. `Dim_Pelanggan` (214 entitas pembeli unik).
  4. `Dim_Lahan` (5 blok budidaya: `PROGEV`, `PP`, `SGH`, `P3K`, `UMUM`).

---

## 4. Pemetaan 5 KPI Terhadap Dashboard & Analisis Bisnis
| KPI | Pertanyaan Bisnis | Visualisasi di Power BI | Temuan Kunci (*Actionable Insight*) |
|---|---|---|---|
| **KPI 1** | Pendapatan per Minggu | Clustered column chart (`LabelMinggu` vs `Total Pendapatan`) | Lonjakan panen raya di **Minggu ke-36 (Rp 15.121.720)** (>50% omzet). Rekomendasi: *Staggered planting*. |
| **KPI 2** | Pendapatan per Bulan | Slicer `NamaBulan` & Card Pendapatan | **Agustus:** Rp 10.597.000 \| **September:** Rp 19.221.920 (+81,4% MoM). |
| **KPI 3** | Produk Pendapatan Terbesar | Clustered bar chart (`Komoditas` vs `Total Pendapatan`) | **Melon Sweet Lavender (Rp 14,44 Jt)** & **Tomat Cherry (Rp 9,60 Jt)** menyumbang 80,6% total omzet kebun (*Pareto 80/20*). |
| **KPI 4** | Produk Terbanyak Terjual (Volume) | Clustered bar chart (`Komoditas` vs `Total Volume`) | **Melon Sweet Lavender (860 kg)**, **Pete (487 pack)**, dan **Tomat Cherry (372,5 kg)**. Sayuran daun berputar cepat tapi bermargin rendah. |
| **KPI 5** | Pembeli Belanja Terbanyak | Table sorted descending (`NamaPembeli` vs `Total Pendapatan`) | Pembeli grosir borongan mendominasi: **B Rara Surabaya (Rp 2,87 Jt)** & **P Joni Batu (Rp 2,70 Jt)**. Rekomendasi: Kontrak pasokan *pre-order*. |

---

## 5. Status Dashboard Power BI Terkini (Sudah Dibangun Mahasiswa)
Mahasiswa telah berhasil menyusun kanvas dashboard di Power BI Desktop dengan tata letak:
- **Header**: Judul `DASHBOARD DSS KEBUN PRODUKSI BBPP KETINDAN`, identitas Ade Surya Ananda (NIM 2646000083), SPK.
- **KPI Summary Cards**: `Total Pendapatan`, `Total Volume`, `Total Transaksi`.
- **Slicer**: Pilihan bulan `Agustus` / `September`.
- **Charts**:
  - Batang mingguan (kiri atas).
  - Donut chart distribusi lahan (tengah).
  - Bar horizontal pendapatan produk (kiri bawah).
  - Bar horizontal volume produk (tengah bawah).
  - Tabel top pembeli (kanan).

---

## 6. Prosedur Tugas untuk Agent Berikutnya

### Skenario A: Memperbarui Slide Presentasi dengan Real Screenshot
Jika user telah menyimpan tangkapan layar baru atau mengupload gambar dashboard / model:
1. Pastikan kedua berkas gambar tersimpan di:
   - `E:\Managed Projects\tugas-spk\assets\screenshots\powerbi_dashboard_overview.png`
   - `E:\Managed Projects\tugas-spk\assets\screenshots\star_schema_architecture.png`
2. Jalankan skrip generator presentasi via PowerShell / Python:
   ```powershell
   $env:NODE_PATH = (npm root -g); node scripts/build_deck.js; powershell -File convert_pdf.ps1
   ```
3. Skrip akan otomatis:
   - Menyematkan identitas mahasiswa (Ade Surya Ananda - 2646000083).
   - Memasukkan kedua gambar screenshot riil ke Slide 5 (Skema Bintang) dan Slide 6 (Executive Dashboard).
   - Mengompilasi `Presentasi_DSS_BBPP_Ketindan.pptx`.
   - Menggunakan PowerPoint COM Automation untuk meng-export `Presentasi_DSS_BBPP_Ketindan.pdf` (10 halaman tepat).

### Skenario B: Memodifikasi Model atau DAX (Code-First)
- Format model saat ini adalah **TMDL** (Tabular Model Definition Language) pada folder `BBPP_Ketindan_DSS.SemanticModel/definition/`.
- Jika perlu menambah measure baru, edit langsung `Fact_Penjualan.tmdl`.
- Jika user membuka Power BI Desktop, ingatkan user untuk menekan `Ctrl + S` atau tombol `Refresh` untuk reload model.

### Skenario C: Melakukan Commit & Push GitHub
Selalu jaga kebersihan submodule dan superproject:
```powershell
# 1. Commit di dalam tugas-spk
cd "E:\Managed Projects\tugas-spk"
git add .
git commit -m "feat(presentation): update presentation deck with real dashboard screenshots"
git push origin main

# 2. Sinkronkan ke superproject Managed Projects
cd "E:\Managed Projects"
git add tugas-spk logs/ACTIVITY_LOG.md
git commit -m "feat(portfolio): sync tugas-spk latest presentation and dashboard artifacts"
git push origin main
```

---

## 7. Checklist Output Akhir Sebelum Pengumpulan (`brone.ub.ac.id`)
1. [x] **File Excel Data Mentah & Star Schema**: `Data_Warehouse_BBPP_Ketindan_Cleaned.xlsx` siap di-upload.
2. [x] **File PDF Presentasi 10 Slide**: `Presentasi_DSS_BBPP_Ketindan.pdf` (maksimal 10 slide, memuat profil BBPP Ketindan, 5 KPI, data cleansing, star schema, dashboard screenshots, wawasan DSS, dan link publikasi).
3. [x] **Proyek Power BI**: `BBPP_Ketindan_DSS.pbip` tersimpan rapi dan dapat dibuka di Power BI Desktop.
