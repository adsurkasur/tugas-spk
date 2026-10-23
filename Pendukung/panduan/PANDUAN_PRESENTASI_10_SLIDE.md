# Panduan Lengkap Presentasi 10 Halaman (Tugas 1 SPK / DSS BI Dashboard)
# Studi Kasus: Kebun Produksi Balai Besar Pelatihan Pertanian (BBPP) Ketindan, Lawang - Malang
# Target: Konversi ke File Presentasi PDF 10 Slide untuk Pengumpulan brone.ub.ac.id

---

## SLIDE 1: JUDUL & IDENTITAS PROYEK
- **Judul Presentasi**: Perancangan Decision Support System (DSS) Berbasis Business Intelligence Dashboard untuk Optimasi Penjualan Komoditas Pertanian
- **Studi Kasus**: Kebun Produksi Balai Besar Pelatihan Pertanian (BBPP) Ketindan - Kementerian Pertanian RI
- **Mata Kuliah**: Sistem Penunjang Keputusan (SPK) / Business Intelligence
- **Identitas**: Nama Mahasiswa / Tim & NIM
- **Tanggal Pengumpulan**: 23 Oktober 2026

---

## SLIDE 2: PROFIL ORGANISASI & STAKEHOLDER INSIGHTS
- **Profil Organisasi**: 
  - Balai Besar Pelatihan Pertanian (BBPP) Ketindan adalah Unit Pelaksana Teknis (UPT) di bawah Badan Penyuluhan dan Pengembangan SDM Pertanian (BPPSDMP), Kementerian Pertanian RI yang berlokasi di Lawang, Malang.
  - Selain menjalankan fungsi utama pelatihan vokasi dan standarisasi aparatur/non-aparatur pertanian, BBPP Ketindan mengelola lahan dan *smart greenhouse* (kebun percobaan & produksi) untuk komoditas bernilai ekonomi tinggi (hortikultura seperti melon premium, tomat cherry, sayuran hidroponik, dan tanaman musiman).
- **Tantangan Bisnis & Pengambilan Keputusan**:
  1. *Perencanaan Masa Tanam & Panen*: Ketiadaan agregasi data terpusat membuat manajer kebun sulit memprediksi komoditas mana yang memberikan margin pendapatan tertinggi dalam siklus 2 bulan.
  2. *Fluktuasi Permintaan Pasar*: Distribusi hasil panen masih mengandalkan kombinasi pembeli ritel spontan dan pedagang grosir besar tanpa segmentasi volume yang terstruktur.
  3. *Manajemen Utilisasi Lahan*: Terdapat beberapa kode lahan produksi (`PROGEV`, `PP`, `SGH`, `P3K`, `UMUM`) yang perlu dievaluasi produktivitas finansialnya.

---

## SLIDE 3: IDENTIFIKASI & JUSTIFIKASI 5 KEY PERFORMANCE INDICATORS (KPI)
Tuntutan manajerial kebun diterjemahkan ke dalam 5 KPI terpenting:
1. **KPI 1: Pendapatan Penjualan Mingguan (Weekly Revenue)**
   - *Justifikasi*: Mengukur likuiditas arus kas operasional mingguan dan mendeteksi secara presisi kapan titik puncak (*peak harvest window*) terjadi.
2. **KPI 2: Pendapatan Penjualan Bulanan (Monthly Revenue)**
   - *Justifikasi*: Memantau target pendapatan berkala (Agustus vs September 2026) serta pertumbuhan *Month-over-Month (MoM)*.
3. **KPI 3: Produk Penyumbang Pendapatan Terbesar (Top Revenue Products)**
   - *Justifikasi*: Menentukan komoditas tulang punggung (*revenue driver*) untuk mengalokasikan anggaran benih, pupuk, dan perawatan prioritas.
4. **KPI 4: Produk dengan Volume Penjualan Terbanyak (Top Volume Products)**
   - *Justifikasi*: Menilai komoditas dengan serapan pasar tercepat dan perputaran inventaris (*inventory turnover*) tinggi untuk mencegah pembusukan hasil panen.
5. **KPI 5: Pelanggan dengan Nilai Belanja Tertinggi (Top Spending Buyers)**
   - *Justifikasi*: Mengidentifikasi mitra strategis dan pembeli grosir utama guna menyusun program loyalitas serta komitmen pasokan hasil panen (*offtaker contracts*).

---

## SLIDE 4: PENGUMPULAN DATA & PROSES PEMBERSIHAN (DATA CLEANSING)
- **Sumber Data Aktual**:
  - Log buku kas harian penjualan kebun periode 3 Agustus 2026 – 25 September 2026 (mencakup 8 minggu aktif, melampaui batas minimal tugas 3 minggu).
  - Total 549 baris transaksi riil dengan nilai omzet terverifikasi sebesar **Rp 29.818.920**.
- **Prosedur Data Cleansing**:
  1. *Koreksi Inkonsistensi Format Tanggal*: Ditemukan 8 baris anomali pencatatan human-error (tahun terinput `2025`, `2028`, dan `2029` padahal nomor urut transaksi berjalan di pertengahan Agustus dan September 2026). Dilakukan normalisasi tahun ke 2026 sesuai *timestamp audit*.
  2. *Standardisasi Komoditas & Grade*: Penyeragaman nilai grade (`A`, `B`, `C`, `Non Grade`, `Mini`, `A Curah`, `A Grosir`).
  3. *Penanganan Entitas Pembeli & Satuan*: Menstandarkan satuan volume (`Kg`, `Buah`, `Pack`, `Ikat`) dan pembersihan *trailing whitespace* pada nama pembeli.

---

## SLIDE 5: DESAIN DATA WAREHOUSE (STAR SCHEMA ARCHITECTURE)
Berdasarkan prinsip Kimball & Taniar (2021), data ditransformasikan dari bentuk flat transaksi menjadi Star Schema berkinerja tinggi:
- **Tabel Fakta (`Fact_Penjualan`)**:
  - *Foreign Keys*: `DateKey`, `ProductKey`, `CustomerKey`, `LahanKey`.
  - *Measures/Metrics*: `Volume`, `HargaSatuan`, `TotalPendapatan`.
  - *Degenerate Dimension*: `TransactionID`, `Satuan`.
- **Tabel Dimensi**:
  1. **`Dim_Waktu`**: `DateKey` (PK), `Tanggal`, `Hari`, `MingguKe`, `LabelMinggu`, `BulanAngka`, `NamaBulan`, `BulanTahun`, `Tahun`.
  2. **`Dim_Produk`**: `ProductKey` (PK), `Komoditas`, `Grade`, `SatuanDefault`.
  3. **`Dim_Pelanggan`**: `CustomerKey` (PK), `NamaPembeli`.
  4. **`Dim_Lahan`**: `LahanKey` (PK), `KodeLahan` (PROGEV, PP, SGH, P3K, UMUM).
- **Keunggulan Skema**: Menghilangkan redundansi, mempercepat eksekusi agregasi DAX di Power BI VertiPaq engine, dan mendukung *drill-down/roll-up* multidimensi.

---

## SLIDE 6: PENGEMBANGAN POWER BI DASHBOARD (EXECUTIVE VIEW & KPI CARDS)
- **Visualisasi KPI Summary Cards**:
  - Total Pendapatan: **Rp 29.818.920**
  - Total Volume Penjualan: **2.116 (gabungan Kg/Pack/Ikat/Buah)**
  - Total Transaksi: **549 Transaksi**
  - Total Pembeli Unik: **214 Pembeli**
  - Pertumbuhan MoM (Agt ke Sep): **+81,39%**
- **Justifikasi Desain Visual**:
  - *Visual Hierarchy*: KPI cards diletakkan di bagian paling atas (*F-pattern scanning*) untuk evaluasi cepat bagi level pimpinan.
  - *Slicer Panel*: Filter interaktif di bilah kiri atas untuk memfilter berdasarkan Bulan, Komoditas, dan Blok Lahan.

---

## SLIDE 7: ANALISIS MULTIDIMENSI & FITUR DRILL-DOWN (KPI 1 - KPI 5)
- **Visual 1: Tren Pendapatan & Transaksi Mingguan (Combo Chart - KPI 1 & 2)**
  - Menunjukkan dinamika mingguan. Pendapatan melonjak tajam pada **Minggu ke-36** mencapai **Rp 15.121.720** (lebih dari 50% total omzet 2 bulan) akibat panen serentak melon premium.
- **Visual 2: Pareto Kontribusi Produk (Bar Chart - KPI 3 & 4)**
  - *Melon Sweet Lavender* menjadi kontributor omzet nomor 1 (**Rp 14.436.800**, volume 860 kg), disusul *Tomat Cherry* (**Rp 9.603.500**, volume 372 kg).
  - *Pete* mendominasi volume (487 pack) namun bernilai pendapatan Rp 2.435.000.
- **Visual 3: Top Pembeli & Analisis Konsentrasi Pasar (KPI 5)**
  - Dua pembeli grosir luar kota menyerap lebih dari 18% omzet: *B Rara Surabaya* (Rp 2.868.000) dan *P Joni Batu* (Rp 2.698.000).

---

## SLIDE 8: BUSINESS INSIGHTS DARI DSS DASHBOARD
1. **Konsentrasi Pendapatan Sangat Tinggi (Pareto 80/20)**:
   - Dua komoditas utama (*Melon Sweet Lavender* dan *Tomat Cherry*) menyumbang **80,6%** dari total seluruh pendapatan kebun BBPP Ketindan. Komoditas sayuran daun (sawi, selada, kenikir) berfungsi sebagai *cash-flow stabilizer* harian.
2. **Efek Panen Raya Musiman**:
   - Omzet bulan September (Rp 19,22 juta) melesat **+81,4%** dibanding Agustus (Rp 10,60 juta), membuktikan bahwa performa finansial kebun sangat tergantung pada ketepatan panen *greenhouse*.
3. **Ketergantungan Pembeli Grosir**:
   - Walaupun terdapat 214 pembeli terdaftar, top 2 pembeli grosir menyerap omzet setara gabungan 50 pembeli ritel eceran.

---

## SLIDE 9: REKOMENDASI STRATEGIS & KEPUTUSAN MANAJEMEN
Sebagai Sistem Penunjang Keputusan (DSS), dashboard ini merekomendasikan:
1. **Penjadwalan Tanam Bergilir (Staggered Planting System)**:
   - Mengatur rotasi tanam Melon Sweet Lavender agar panen tidak terkonsentrasi hanya di Minggu ke-36, melainkan terdistribusi rata untuk menjaga kestabilan harga dan pasokan.
2. **Perjanjian Pasokan Kemitraan (B2B Offtaker Agreement)**:
   - Mengikat pembeli besar (*B Rara Surabaya* & *P Joni Batu*) dengan sistem *pre-order* panen untuk menjamin serapan hasil panen Grade A tanpa risiko penurunan harga pasar.
3. **Optimasi Lahan Smart Greenhouse**:
   - Memprioritaskan alokasi Greenhouse (SGH/PROGEV) untuk varietas bernilai margin tinggi (Melon & Tomat Cherry) dan memanfaatkan lahan terbuka untuk komoditas volume cepat (sayuran dan polong-polongan).

---

## SLIDE 10: KESIMPULAN & TAUTAN DASHBOARD INTERAKTIF
- **Kesimpulan**:
  - Penerapan Business Intelligence berbasis Star Schema Data Warehouse berhasil mengubah data operasional mentah buku kas kebun BBPP Ketindan menjadi informasi analitis yang siap pakai.
  - 5 KPI yang dirancang memberikan visibilitas penuh bagi pimpinan dalam memonitor pendapatan mingguan/bulanan, evaluasi produk terlaris, dan pengelolaan pelanggan.
- **Tautan Dashboard Interaktif (Power BI Publish to Web)**:
  - *URL Dashboard*: `https://app.powerbi.com/links/76fma9KOTC?ctid=8b603e04-2c81-4b3c-a54e-b1211ffbceed&pbi_source=linkShare`
  - *(Tautan Share Power BI Service, akun trial; penerima perlu login akun organisasi)*.
- **Lampiran Berkas**:
  - File Excel Bersih Star Schema: `SPK_Ade Surya Ananda_2646000083_3_Data Warehouse Star Schema.xlsx`
  - Proyek Power BI: `SPK_Ade Surya Ananda_2646000083_PowerBI.pbip`
