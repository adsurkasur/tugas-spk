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
Repositori: `E:\managed-projects-handoff\tugas-spk\` (GitHub: `https://github.com/adsurkasur/tugas-spk.git`, branch `main`), submodule dari superproject `managed-projects-handoff`.

Root hanya memuat berkas yang siap dilihat/dikumpulkan; semua bahan lain ada di `Pendukung/`. Lihat `README.md` di root untuk peta lengkap.

```text
tugas-spk/
├── SPK_Ade Surya Ananda_2646000083_1_Buku Kasir Harian.xlsx          # data mentah asli
├── SPK_Ade Surya Ananda_2646000083_2_Data Bersih.xlsx                # tabel datar hasil pembersihan
├── SPK_Ade Surya Ananda_2646000083_3_Data Warehouse Star Schema.xlsx # star schema + Data_Mentah + Ringkasan_KPI
├── SPK_Ade Surya Ananda_2646000083_4_Presentasi.pdf                  # presentasi 10 slide (dikumpulkan)
├── SPK_Ade Surya Ananda_2646000083_PowerBI.pbip (+ .Report/, .SemanticModel/)
├── logs/                                  # ACTIVITY/DECISION/CHANGELOG (protokol AGENTS.md)
└── Pendukung/
    ├── presentasi/   # SPK_Ade Surya Ananda_2646000083_Presentasi.pptx (sumber PDF)
    ├── data_csv/     # sumber data model Power BI (path absolut di TMDL)
    ├── assets/       # photos/ (observasi Oktober 2026), screenshots/
    ├── scripts/      # build_deck.js, build_excel_submission.py, convert_pdf.ps1, _archive/
    ├── panduan/      # tugas1.pdf, catatan KPI, panduan DAX & import
    ├── materi_kuliah/
    └── HANDOFF_PROMPT_AGENT.md
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

### Membangun ulang presentasi
Semua angka dihitung dari `Pendukung/data_csv/`; teks slide ada di `Pendukung/scripts/build_deck.js`.
```powershell
cd E:\managed-projects-handoff\tugas-spk
$env:NODE_PATH = (npm root -g); node Pendukung/scripts/build_deck.js
powershell -File Pendukung/scripts/convert_pdf.ps1
```
Jaga PDF tetap 10 halaman (judul termasuk) dan tautan dashboard di halaman terakhir.

### Membangun ulang Excel
`python Pendukung/scripts/build_excel_submission.py` menulis berkas 2 dan 3 di root dan menjalankan self-check (549 baris, total Rp 29.818.920).

### Model Power BI
- Format TMDL di `SPK_Ade Surya Ananda_2646000083_PowerBI.SemanticModel/definition/`.
- Sumber data: `File.Contents("E:/managed-projects-handoff/tugas-spk/Pendukung/data_csv/...")`. Jika folder repo dipindah, perbarui kelima path ini lalu Refresh.
- Nama report di Power BI Service: `SPK_Ade Surya Ananda_2646000083_PowerBI` (link Share, akun trial).

### Commit
Ikuti `AGENTS.md` di superproject: commit di submodule (beserta `logs/`), push, lalu perbarui pointer superproject.

---

## 7. Checklist Output Akhir Sebelum Pengumpulan (`brone.ub.ac.id`)
1. [x] Excel data KPI: `SPK_Ade Surya Ananda_2646000083_3_Data Warehouse Star Schema.xlsx` (memuat sheet Data_Mentah); data mentah murni `SPK_Ade Surya Ananda_2646000083_1_Buku Kasir Harian.xlsx`.
2. [x] PDF 10 slide: `SPK_Ade Surya Ananda_2646000083_4_Presentasi.pdf`, tautan dashboard di halaman 10.
3. [x] Proyek Power BI: `SPK_Ade Surya Ananda_2646000083_PowerBI.pbip`.
