# Tugas 1 SPK: BI Dashboard sebagai DSS — Kebun Produksi BBPP Ketindan

**Ade Surya Ananda · NIM 2646000083 · Sistem Penunjang Keputusan**

Studi kasus kebun produksi Balai Besar Pelatihan Pertanian (BBPP) Ketindan, Lawang, Malang. Buku kasir penjualan 3 Agustus–25 September 2026 (549 transaksi, Rp 29.818.920) dibersihkan, dimodelkan menjadi star schema, lalu divisualisasikan di Power BI untuk lima KPI.

**Dashboard interaktif:** [SPK_Ade Surya Ananda_2646000083_PowerBI](https://app.powerbi.com/links/76fma9KOTC?ctid=8b603e04-2c81-4b3c-a54e-b1211ffbceed&pbi_source=linkShare) (Power BI Service, perlu login akun organisasi yang diberi akses)

---

## Berkas utama (root)

Semua berkas memakai awalan `SPK_Ade Surya Ananda_2646000083_`.

| Berkas | Isi |
|---|---|
| `…_1_Buku Kasir Harian.xlsx` | Data mentah asli dari buku kasir kebun, tanpa perubahan. |
| `…_2_Data Bersih.xlsx` | Satu tabel datar hasil pembersihan: tanggal dikoreksi ke 2026, satuan diseragamkan (`kg`→`Kg`, `paket`→`Pack`), ditambah kolom hari, minggu, dan bulan. |
| `…_3_Data Warehouse Star Schema.xlsx` | Data yang sudah diolah: `Fact_Penjualan` + 4 dimensi (`Dim_Waktu`, `Dim_Produk`, `Dim_Pelanggan`, `Dim_Lahan`), sheet `Ringkasan_KPI` yang menjawab 5 KPI, dan salinan `Data_Mentah`. |
| `…_4_Presentasi.pdf` | Presentasi 10 halaman; tautan dashboard ada di halaman terakhir. |
| `…_PowerBI.pbip` | Proyek Power BI (buka dengan Power BI Desktop). Folder `…_PowerBI.Report/` dan `…_PowerBI.SemanticModel/` adalah bagiannya dan harus tetap di samping file ini. |

**Untuk diunggah ke brone.ub.ac.id:** berkas 3 (Excel data KPI, sudah memuat data mentah) dan berkas 4 (PDF).

## Lima KPI

| KPI | Pertanyaan | Hasil |
|---|---|---|
| 1 | Berapa pendapatan setiap minggu? | Puncak Minggu-36: Rp 15.121.720 (50,7% omzet dua bulan) |
| 2 | Berapa pendapatan setiap bulan? | Agustus Rp 10.597.000; September Rp 19.221.920 (+81,4%) |
| 3 | Produk apa yang memberi pendapatan terbesar? | Melon Sweet Lavender Rp 14.436.800; Tomat Cherry Rp 9.603.500 (bersama 80,6%) |
| 4 | Produk apa yang paling banyak terjual? | Melon Sweet Lavender 860 kg; Pete 487 pack; Tomat Cherry 372,5 kg |
| 5 | Siapa pembeli yang belanjanya terbanyak? | B Rara Surabaya Rp 2.868.000; P Joni Batu Rp 2.698.000 (bersama 18,7%) |

## Folder `Pendukung/`

| Folder | Isi |
|---|---|
| `presentasi/` | File PowerPoint yang bisa diedit (sumber PDF). |
| `data_csv/` | Lima tabel CSV yang dibaca model Power BI. |
| `assets/` | Foto observasi lapangan (Oktober 2026) dan tangkapan layar dashboard/skema. |
| `scripts/` | Script untuk membangun ulang Excel, presentasi, dan PDF; `_archive/` berisi script lama. |
| `panduan/` | Soal tugas (`tugas1.pdf`), catatan 5 KPI, panduan DAX dan impor Power BI. |
| `materi_kuliah/` | Materi kuliah referensi. |
| `HANDOFF_PROMPT_AGENT.md` | Konteks lengkap untuk melanjutkan pekerjaan. |

Folder `logs/` di root berisi catatan aktivitas, keputusan, dan changelog proyek.

## Membangun ulang

```powershell
python Pendukung/scripts/build_excel_submission.py        # berkas 2 & 3, dengan self-check
$env:NODE_PATH = (npm root -g); node Pendukung/scripts/build_deck.js
powershell -File Pendukung/scripts/convert_pdf.ps1        # berkas 4 (butuh PowerPoint)
```

Model Power BI membaca CSV dari `E:/managed-projects-handoff/tugas-spk/Pendukung/data_csv/`. Jika folder repo dipindah, ubah lima path `File.Contents` di Power Query (atau file `*.tmdl` di `…_PowerBI.SemanticModel/definition/tables/`), lalu Refresh.
