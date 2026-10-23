// Build Presentasi_DSS_BBPP_Ketindan.pptx (10 slide, mode analitis) dengan pptxgenjs.
// Semua angka dibaca dari data_csv/ (sama dengan sumber Power BI), bukan diketik.
// Jalankan: NODE_PATH="$(npm root -g)" node scripts/build_deck.js
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

const BASE = path.resolve(__dirname, "..");
const OUT = path.join(BASE, "Presentasi_DSS_BBPP_Ketindan.pptx");
const PHOTO = (f) => path.join(BASE, "assets", "photos", f);
const SHOT = (f) => path.join(BASE, "assets", "screenshots", f);
const THEME = path.join(process.env.PPTX_SKILL || "", "scripts", "apply_theme.js");
const DASHBOARD_URL = "https://app.powerbi.com/links/76fma9KOTC?ctid=8b603e04-2c81-4b3c-a54e-b1211ffbceed&pbi_source=linkShare";
const REPO_URL = "https://github.com/adsurkasur/tugas-spk";

// ---------- data ----------
function readCsv(name) {
  const [head, ...rows] = fs.readFileSync(path.join(BASE, "data_csv", name), "utf8").replace(/^﻿/, "").trim().split(/\r?\n/);
  const split = (l) => l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).slice(0, -1).map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
  const cols = split(head);
  return rows.map((l) => Object.fromEntries(split(l).map((v, i) => [cols[i], v])));
}
const fact = readCsv("Fact_Penjualan.csv").map((r) => ({ ...r, Volume: +r.Volume, TotalPendapatan: +r.TotalPendapatan }));
const waktu = Object.fromEntries(readCsv("Dim_Waktu.csv").map((r) => [r.DateKey, r]));
const produk = Object.fromEntries(readCsv("Dim_Produk.csv").map((r) => [r.ProductKey, r]));
const pembeli = Object.fromEntries(readCsv("Dim_Pelanggan.csv").map((r) => [r.CustomerKey, r.NamaPembeli]));
const lahan = Object.fromEntries(readCsv("Dim_Lahan.csv").map((r) => [r.LahanKey, r.KodeLahan]));

function groupSum(key, val = "TotalPendapatan") {
  const m = new Map();
  for (const r of fact) m.set(key(r), (m.get(key(r)) || 0) + r[val]);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
const TOTAL = fact.reduce((s, r) => s + r.TotalPendapatan, 0);
const weeks = groupSum((r) => waktu[r.DateKey].LabelMinggu).sort((a, b) => a[0].localeCompare(b[0]));
const months = groupSum((r) => waktu[r.DateKey].NamaBulan);
const byMonth = Object.fromEntries(months);
const products = groupSum((r) => produk[r.ProductKey].Komoditas);
const volumes = groupSum((r) => produk[r.ProductKey].Komoditas + "|" + r.Satuan, "Volume");
const buyers = groupSum((r) => pembeli[r.CustomerKey]);
const lands = Object.fromEntries(groupSum((r) => lahan[r.LahanKey]));
const peak = weeks.reduce((a, b) => (b[1] > a[1] ? b : a));
const peakMelon = groupSum((r) => (waktu[r.DateKey].LabelMinggu === peak[0] ? produk[r.ProductKey].Komoditas : "-")).find((x) => x[0] === "Melon Sweet Lavender")[1];
const nDays = new Set(fact.map((r) => r.DateKey)).size;
const nProducts = new Set(Object.values(produk).map((p) => p.Komoditas)).size;
const nBuyers = new Set(fact.map((r) => r.CustomerKey)).size;
const smallBuyers = buyers.filter((b) => b[1] < 300000).length;

// ---------- format (id-ID) ----------
const nf = (v, d = 0) => new Intl.NumberFormat("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
const rp = (v) => "Rp " + nf(v);
const jt = (v) => "Rp " + nf(v / 1e6, 2) + " Jt";
const pct = (v, base = TOTAL) => nf((v / base) * 100, 1) + "%";
const mom = (byMonth.September / byMonth.Agustus - 1) * 100;
const top2Prod = products[0][1] + products[1][1];
const top2Buy = buyers[0][1] + buyers[1][1];

// self-check: angka kunci harus cocok dengan buku kasir (sel TOTAL) dan analisis sebelumnya
console.assert(fact.length === 549 && TOTAL === 29818920, "total berubah");
console.assert(peak[0] === "Minggu-36" && products[0][0] === "Melon Sweet Lavender" && buyers[0][0] === "B Rara Surabaya", "peringkat berubah");

// ---------- design system ----------
const C = { dark: "1B4332", mid: "2D6A4F", tint: "EAF3EE", tint2: "F5F8F6", warm: "E09F3E", alarm: "C0392B", text: "212529", muted: "6C757D", white: "FFFFFF", line: "CFDCD4" };
const HEAD = "Cambria", BODY = "Calibri";
const W = 13.333, M = 0.6, CW = W - 2 * M;
const DATA_SRC = "Sumber: buku kasir kebun produksi BBPP Ketindan, 3 Agustus–25 September 2026 (diolah).";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "BI Dashboard sebagai DSS – BBPP Ketindan";
pres.author = "Ade Surya Ananda";
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

const text = (s, t, x, y, w, h, o = {}) =>
  s.addText(t, { x, y, w, h, fontFace: BODY, fontSize: 16, color: C.text, valign: "top", margin: 0, ...o });
const card = (s, x, y, w, h, fill = C.tint) =>
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.08 });
const circle = (s, n, x, y, d = 0.55, fill = C.dark) => {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  text(s, String(n), x, y, d, d, { fontFace: HEAD, fontSize: d * 30, bold: true, color: C.white, align: "center", valign: "middle" });
};
const bar = (s, x, y, w, h, label, body) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: C.dark }, line: { type: "none" }, rectRadius: 0.06 });
  text(s, [{ text: label + "  ", options: { bold: true, color: C.warm } }, { text: body, options: { color: C.white } }], x + 0.25, y, w - 0.5, h, { fontSize: 15, valign: "middle" });
};

function contentSlide(n, title, { step, section, source = DATA_SRC, notes }) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  let tx = M;
  if (step) { circle(s, step, M, 0.42, 0.6); tx = M + 0.8; }
  text(s, title, tx, 0.3, W - tx - 1.0, 0.95, { fontFace: HEAD, fontSize: 24, bold: true, color: C.dark, valign: "middle", fit: "shrink" });
  text(s, String(n), W - 0.95, 0.35, 0.4, 0.3, { fontSize: 11, color: C.muted, align: "right" });
  if (source) text(s, source, M, 7.0, 9.2, 0.3, { fontSize: 11, italic: true, color: C.muted });
  text(s, section, W - M - 3.2, 7.0, 3.2, 0.3, { fontSize: 10, color: C.muted, align: "right" });
  if (notes) s.addNotes(notes);
  return s;
}
async function photo(s, file, x, y, w, h, position = "centre") {
  const px = Math.round(Math.min(2400, w * 220)), py = Math.round((px * h) / w);
  const buf = await sharp(file).rotate().resize(px, py, { fit: "cover", position }).jpeg({ quality: 86 }).toBuffer();
  s.addImage({ data: "image/jpeg;base64," + buf.toString("base64"), x, y, w, h });
}
async function fitImage(s, file, x, y, w, h, crop) {
  let img = sharp(file);
  if (crop) img = img.extract(crop);
  const buf = await img.png().toBuffer();
  const m = await sharp(buf).metadata();
  const r = Math.min(w / m.width, h / m.height), iw = m.width * r, ih = m.height * r;
  s.addImage({ data: "image/png;base64," + buf.toString("base64"), x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
  return { x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih };
}
function table(s, rows, x, y, colW, o = {}) {
  const fs_ = o.fontSize || 13;
  const data = rows.map((r, i) =>
    r.map((c, j) => ({
      text: String(c),
      options: {
        bold: i === 0, color: i === 0 ? C.white : C.text, fill: { color: i === 0 ? C.dark : i % 2 ? C.white : C.tint2 },
        align: j > 0 && o.rightCols !== false ? "right" : "left", fontFace: BODY, fontSize: fs_,
      },
    }))
  );
  s.addTable(data, { x, y, colW, rowH: o.rowH || 0.34, border: { type: "solid", pt: 0.5, color: C.line }, margin: [0.04, 0.08, 0.04, 0.08], valign: "middle" });
}

(async () => {
  // ===== 1. Judul =====
  {
    const s = pres.addSlide();
    await photo(s, PHOTO("kebun-melon.jpeg"), 0, 0, W, 7.5);
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 7.5, fill: { color: "0B2418", transparency: 28 }, line: { type: "none" } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 8.6, h: 7.5, fill: { color: "0B2418", transparency: 30 }, line: { type: "none" } });
    text(s, "TUGAS 1 · SISTEM PENUNJANG KEPUTUSAN", M + 0.2, 1.5, 8, 0.4, { fontSize: 14, bold: true, color: C.warm, charSpacing: 2 });
    text(s, "BI Dashboard sebagai DSS untuk Penjualan Kebun Produksi BBPP Ketindan", M + 0.2, 2.0, 7.6, 2.2, { fontFace: HEAD, fontSize: 40, bold: true, color: C.white, valign: "top" });
    text(s, `Star schema data warehouse dan dashboard Power BI dari ${nf(fact.length)} transaksi, 3 Agustus–25 September 2026`, M + 0.2, 4.35, 7.4, 0.8, { fontSize: 18, color: "DDEBE2" });
    text(s, [{ text: "Ade Surya Ananda", options: { bold: true, breakLine: true } }, { text: "NIM 2646000083 · Sistem Penunjang Keputusan" }], M + 0.2, 5.55, 7, 0.8, { fontSize: 16, color: C.white });
    text(s, "Foto: Smart Greenhouse melon BBPP Ketindan, dokumentasi observasi Oktober 2026.", M + 0.2, 7.0, 8, 0.3, { fontSize: 11, italic: true, color: "C9D8CF" });
    s.addNotes("Pembuka (±30 dtk). Tugas ini membangun BI dashboard sebagai sistem penunjang keputusan untuk kebun produksi BBPP Ketindan. Datanya buku kasir asli 8 minggu, dimodelkan menjadi star schema, lalu divisualisasikan di Power BI.");
  }

  // ===== 2. Organisasi =====
  {
    const s = contentSlide(2, "BBPP Ketindan menjual hasil kebun pelatihannya langsung ke pembeli, tetapi pencatatannya hanya buku kasir harian", {
      step: 1, section: "Organisasi & pemangku kepentingan", source: "Foto: dokumentasi observasi lapangan BBPP Ketindan, Oktober 2026.",
      notes: "Organisasi (±1,5 mnt). BBPP Ketindan adalah UPT Kementan di Lawang yang menggabungkan pelatihan vokasi dengan kebun produksi komersial. Hasil kebun dijual langsung di balai ke pembeli grosir dan eceran. Pemangku kepentingan utama: pengelola kebun yang memutuskan jadwal tanam, staf penjualan yang mencatat transaksi, dan pembeli. Masalahnya, semua keputusan masih berdasar ingatan dan buku kasir.",
    });
    text(s, "UPT BPPSDMP Kementerian Pertanian di Lawang, Malang: pelatihan vokasi pertanian sekaligus kebun produksi komersial dengan 5 blok lahan (SGH, UMUM, PP, P3K, PROGEV).", M, 1.35, CW, 0.55, { fontSize: 16, color: C.muted });
    const pw = (CW - 0.6) / 3, py = 2.0, ph = 2.45;
    const items = [
      ["kebun-melon.jpeg", "Smart Greenhouse", "Melon premium dan tomat cherry ditanam serentak, sehingga panen datang bersamaan."],
      ["kebun-pakcoy.jpeg", "Lahan terbuka", "Sayuran daun seperti pakcoy dan sawi berputar cepat dengan nilai jual kecil."],
      ["beli.jpeg", "Penjualan langsung di balai", "Pembeli memilih sendiri; staf mencatat komoditas, volume, harga, dan nama pembeli."],
    ];
    for (const [i, [f, h, d]] of items.entries()) {
      const x = M + i * (pw + 0.3);
      await photo(s, PHOTO(f), x, py, pw, ph);
      text(s, [{ text: `${i + 1}  ${h}`, options: { bold: true, color: C.dark, breakLine: true } }, { text: d, options: { fontSize: 14 } }], x, py + ph + 0.12, pw, 0.95, { fontSize: 16 });
    }
    const sh = [["Pengelola kebun", "memutuskan jadwal tanam dan alokasi lahan"], ["Staf penjualan", "mencatat transaksi di buku kasir"], ["Pembeli grosir & eceran", "menentukan serapan hasil panen"]];
    for (const [i, [h, d]] of sh.entries()) {
      const x = M + i * (pw + 0.3);
      card(s, x, 5.55, pw, 0.5);
      text(s, [{ text: h + ": ", options: { bold: true, color: C.dark } }, { text: d }], x + 0.15, 5.55, pw - 0.3, 0.5, { fontSize: 13, valign: "middle" });
    }
    bar(s, M, 6.2, CW, 0.62, "Masalah inti:", "panen menumpuk di minggu tertentu dan omzet bergantung pada sedikit produk dan pembeli, tetapi belum ada alat untuk melihatnya.");
  }

  // ===== 3. KPI =====
  {
    const s = contentSlide(3, "Lima KPI menjawab tiga keputusan: kapan hasil panen terjual, produk apa diprioritaskan, dan pembeli siapa dijaga", {
      step: 2, section: "Pemilihan KPI", source: null,
      notes: "Alasan KPI (±1,5 mnt). Lima KPI ini diturunkan dari pertanyaan pengelola dan dari kolom yang benar-benar tercatat. Dua KPI waktu untuk arus kas dan jadwal panen, dua KPI produk untuk prioritas komoditas, satu KPI pembeli untuk kemitraan. Margin dan stok tidak dicatat, jadi tidak saya jadikan KPI.",
    });
    const k = [
      ["Pendapatan per minggu", "Berapa pendapatan setiap minggu?", "Mendeteksi minggu panen raya dan arus kas.", "Jadwal tanam & logistik"],
      ["Pendapatan per bulan", "Berapa pendapatan setiap bulan?", "Membandingkan capaian antarbulan.", "Evaluasi target berkala"],
      ["Produk omzet terbesar", "Produk apa yang memberi pendapatan terbesar?", "Menemukan komoditas tulang punggung omzet.", "Prioritas lahan & perawatan"],
      ["Produk terlaris (volume)", "Produk apa yang paling banyak terjual?", "Mengukur serapan pasar per satuan.", "Volume panen & cegah busuk"],
      ["Pembeli terbesar", "Siapa pembeli yang belanjanya terbanyak?", "Memetakan pembeli kunci.", "Kontrak & pre-order"],
    ];
    const cw = (CW - 4 * 0.25) / 5;
    for (const [i, [name, q, why, dec]] of k.entries()) {
      const x = M + i * (cw + 0.25), y = 1.45, h = 4.45;
      card(s, x, y, cw, h);
      circle(s, i + 1, x + 0.2, y + 0.22, 0.5, i < 2 ? C.dark : i < 4 ? C.mid : C.warm);
      text(s, "KPI " + (i + 1), x + 0.85, y + 0.3, cw - 1, 0.35, { fontSize: 13, bold: true, color: C.muted });
      text(s, name, x + 0.2, y + 0.85, cw - 0.4, 0.75, { fontFace: HEAD, fontSize: 17, bold: true, color: C.dark });
      text(s, [{ text: "Pertanyaan", options: { bold: true, color: C.mid, breakLine: true } }, { text: q, options: { italic: true, breakLine: true } },
        { text: " ", options: { fontSize: 6, breakLine: true } }, { text: "Alasan", options: { bold: true, color: C.mid, breakLine: true } }, { text: why }],
        x + 0.2, y + 1.7, cw - 0.4, 1.9, { fontSize: 13 });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: y + h - 0.78, w: cw - 0.3, h: 0.6, fill: { color: C.white }, line: { type: "none" }, rectRadius: 0.06 });
      text(s, [{ text: "Keputusan: ", options: { bold: true } }, { text: dec }], x + 0.25, y + h - 0.78, cw - 0.5, 0.6, { fontSize: 13, valign: "middle", color: C.dark });
    }
    bar(s, M, 6.15, CW, 0.65, "Justifikasi:", "dipilih dari kolom yang benar-benar tercatat (tanggal, komoditas, volume, harga, pembeli, lahan). Biaya dan stok tidak dicatat, sehingga margin dan perputaran stok tidak dijadikan KPI.");
  }

  // ===== 4. Data =====
  {
    const s = contentSlide(4, "Data 8 minggu dari buku kasir dibersihkan dalam empat langkah sebelum dimodelkan", {
      step: 3, section: "Pengumpulan & pembersihan data",
      notes: `Data (±1,5 mnt). Data diambil dari buku kasir harian kebun: ${nf(fact.length)} transaksi selama ${nDays} hari transaksi, jauh di atas syarat minimal tiga minggu. Langkah paling penting adalah koreksi tanggal, karena empat transaksi tomat cherry tercatat tahun 2025. Hasil akhirnya divalidasi: total pendapatan sama persis dengan total di buku kasir.`,
    });
    const stats = [[nf(fact.length), "transaksi tercatat"], [nf(nDays), "hari transaksi (8 minggu)"], [jt(TOTAL), "total pendapatan"], [`${nProducts} · ${nBuyers}`, "komoditas · pembeli unik"]];
    const sw = (CW - 3 * 0.3) / 4;
    for (const [i, [v, l]] of stats.entries()) {
      const x = M + i * (sw + 0.3);
      card(s, x, 1.4, sw, 1.35);
      text(s, v, x + 0.25, 1.5, sw - 0.5, 0.75, { fontFace: HEAD, fontSize: 32, bold: true, color: C.dark, valign: "middle" });
      text(s, l, x + 0.25, 2.25, sw - 0.5, 0.4, { fontSize: 15, color: C.muted });
    }
    const flow = [
      ["Buku kasir", "1 sheet Excel, 549 baris, kolom tanggal s.d. lahan"],
      ["Koreksi tanggal", "7 baris tahun salah (2025/2028/2029) dan 2 tanggal teks → 2026"],
      ["Seragamkan satuan", "kg → Kg, paket → Pack (harga sama); sisa 4 satuan"],
      ["Pisah star schema", "1 tabel fakta + 4 tabel dimensi dengan kunci"],
      ["Validasi total", `${rp(TOTAL)} sama dengan sel TOTAL buku kasir`],
    ];
    const fw = (CW - 4 * 0.4) / 5, fy = 3.1, fh = 1.65;
    for (const [i, [h, d]] of flow.entries()) {
      const x = M + i * (fw + 0.4), hl = i === 1;
      card(s, x, fy, fw, fh, hl ? C.warm : C.tint);
      text(s, [{ text: h, options: { bold: true, fontSize: 17, breakLine: true, color: hl ? C.white : C.dark } }, { text: d, options: { fontSize: 13, color: hl ? C.white : C.text } }], x + 0.15, fy + 0.15, fw - 0.3, fh - 0.3);
      if (i < 4) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + fw + 0.07, y: fy + fh / 2 - 0.13, w: 0.26, h: 0.26, fill: { color: C.mid }, line: { type: "none" } });
    }
    card(s, M, 5.05, CW, 1.3, C.tint2);
    text(s, [{ text: "Mengapa koreksi tanggal penting", options: { bold: true, color: C.dark, breakLine: true, fontSize: 17 } },
      { text: "Empat transaksi Tomat Cherry tanggal 15 September tercatat sebagai 2025. Tanpa koreksi, Rp 150.000 hilang dari pendapatan Minggu-38 (KPI 1) dan dari September (KPI 2). Koreksi memakai urutan nomor transaksi: baris sebelum dan sesudahnya bertanggal 2026." }],
      M + 0.3, 5.18, CW - 0.6, 1.4, { fontSize: 15 });
  }

  // ===== 5. Star schema =====
  {
    const s = contentSlide(5, "Star schema: satu tabel fakta penjualan dikelilingi empat dimensi yang masing-masing melayani KPI", {
      step: 4, section: "Desain data warehouse", source: "Diagram: model data Power BI (BBPP_Ketindan_DSS.SemanticModel), disusun ulang.",
      notes: "Desain DW (±1,5 mnt). Tabel fakta menyimpan satu baris per transaksi dengan ukuran volume dan pendapatan. Dimensi waktu melayani KPI 1 dan 2, dimensi produk KPI 3 dan 4, dimensi pelanggan KPI 5, dan dimensi lahan untuk analisis tambahan. Semua relasi satu-ke-banyak dari dimensi ke fakta.",
    });
    await fitImage(s, SHOT("star_schema_architecture.png"), M, 1.4, 7.4, 4.3, { left: 0, top: 0, width: 1280, height: 600 });
    const n = (f) => Object.keys(f).length;
    table(s, [["Tabel", "Baris", "Melayani"], ["Fact_Penjualan", nf(fact.length), "Ukuran Volume, TotalPendapatan"], ["Dim_Waktu", nf(n(waktu)), "KPI 1 minggu, KPI 2 bulan"],
      ["Dim_Produk", nf(n(produk)), "KPI 3–4 (16 komoditas × grade)"], ["Dim_Pelanggan", nf(n(pembeli)), "KPI 5 pembeli"], ["Dim_Lahan", nf(n(lahan)), "Kontribusi 5 blok lahan"]],
      8.25, 1.45, [1.65, 0.75, 2.08], { fontSize: 13, rowH: 0.42, rightCols: false });
    card(s, 8.25, 4.25, 4.48, 1.45, C.tint2);
    text(s, [{ text: "Cara membaca", options: { bold: true, color: C.dark, breakLine: true } }, { text: "Grain fakta: satu baris = satu komoditas yang dibeli satu pembeli pada satu tanggal. Relasi 1 : N dari setiap dimensi ke fakta." }], 8.45, 4.37, 4.1, 1.25, { fontSize: 14 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.95, w: CW, h: 0.85, fill: { color: C.white }, line: { color: C.line, width: 1 }, rectRadius: 0.06 });
    text(s, [{ text: "Istilah  ", options: { bold: true, color: C.mid } }, { text: "Tabel fakta", options: { bold: true } }, { text: ": berisi angka yang dijumlahkan.   " },
      { text: "Dimensi", options: { bold: true } }, { text: ": konteks untuk memfilter dan mengelompokkan angka.   " }, { text: "Star schema", options: { bold: true } }, { text: ": fakta di tengah, dimensi di sekeliling." }],
      M + 0.25, 5.95, CW - 0.5, 0.85, { fontSize: 14, valign: "middle" });
  }

  // ===== 6. Dashboard =====
  {
    const s = contentSlide(6, "Dashboard Power BI menaruh angka utama di atas dan semua visual saling memfilter", {
      step: 5, section: "Dashboard BI", source: "Tangkapan layar: dashboard Power BI BBPP_Ketindan_DSS (Power BI Desktop).",
      notes: "Dashboard (±2 mnt). Tiga kartu KPI di atas memberi gambaran dalam sekali lihat. Di bawahnya grafik mingguan, donut per lahan, dua grafik produk, dan tabel pembeli. Slicer bulan dan klik pada visual mana pun memfilter semua visual lain, misalnya klik Minggu-36 untuk melihat produk dan pembeli minggu itu.",
    });
    const r = await fitImage(s, SHOT("powerbi_dashboard_overview.png"), M, 1.4, 8.3, 5.2, { left: 0, top: 10, width: 932, height: 474 });
    s.addShape(pres.shapes.RECTANGLE, { ...r, fill: { type: "none" }, line: { color: C.line, width: 1 } });
    const j = [
      ["Hierarki visual", "3 kartu KPI (pendapatan, volume, transaksi) di kiri atas, dibaca pertama."],
      ["Satu halaman", "Kelima KPI terlihat tanpa berpindah halaman atau menggulir."],
      ["Interaktif", "Slicer bulan + cross-filter: klik batang, irisan lahan, atau baris pembeli."],
      ["Warna hemat", "Satu warna utama untuk semua batang agar perbandingan tidak terdistraksi."],
    ];
    for (const [i, [h, d]] of j.entries()) {
      const y = 1.4 + i * 1.33;
      card(s, 9.2, y, 3.53, 1.18, i === 2 ? C.warm : C.tint);
      text(s, [{ text: h, options: { bold: true, breakLine: true, color: i === 2 ? C.white : C.dark } }, { text: d, options: { fontSize: 13, color: i === 2 ? C.white : C.text } }], 9.38, y + 0.1, 3.2, 1.0, { fontSize: 16 });
    }
  }

  // ===== 7. KPI 1-2 =====
  {
    const s = contentSlide(7, `KPI 1–2: separuh omzet dua bulan datang dari satu minggu panen raya (${peak[0]})`, {
      step: 6, section: "Hasil KPI 1–2",
      notes: `KPI waktu (±2 mnt). Pendapatan mingguan sangat tidak rata. ${peak[0]} menghasilkan ${rp(peak[1])}, atau ${pct(peak[1])} dari total dua bulan; ${jt(peakMelon)} di antaranya dari Melon Sweet Lavender. Karena puncak itu jatuh di awal September, pendapatan September naik ${nf(mom, 1)}% dibanding Agustus. Kenaikan ini efek panen serentak, bukan tren pertumbuhan.`,
    });
    const labels = weeks.map((w) => w[0].replace("Minggu-", "M-"));
    s.addChart(pres.charts.BAR, [
      { name: "Minggu lain", labels, values: weeks.map((w) => (w[0] === peak[0] ? 0 : +(w[1] / 1e6).toFixed(2))) },
      { name: "Minggu puncak", labels, values: weeks.map((w) => (w[0] === peak[0] ? +(w[1] / 1e6).toFixed(2) : 0)) },
    ], {
      x: M, y: 1.4, w: 8.3, h: 4.75, barDir: "col", barGrouping: "clustered", barOverlapPct: 100, chartColors: [C.mid, C.warm], showLegend: false,
      showValue: true, dataLabelFormatCode: "#,##0.0;;;", dataLabelFontSize: 12, dataLabelColor: C.text, dataLabelPosition: "outEnd",
      catAxisLabelFontSize: 13, valAxisLabelFontSize: 12, valAxisTitle: "Pendapatan (Rp juta)", showValAxisTitle: true, valAxisTitleFontSize: 12,
      valGridLine: { color: "E5E9E7", size: 0.5 }, catAxisLabelColor: C.text, valAxisLabelColor: C.muted, barGapWidthPct: 45,
    });
    text(s, `Pendapatan per minggu ISO (M-32 = 3–9 Agustus). ${peak[0]}: ${jt(peakMelon)} dari Melon Sweet Lavender.`, M, 6.2, 8.3, 0.4, { fontSize: 12, italic: true, color: C.muted });
    const st = [[jt(byMonth.Agustus), "Agustus (KPI 2)", C.dark], [jt(byMonth.September), "September (KPI 2)", C.dark], ["+" + nf(mom, 1) + "%", "kenaikan September vs Agustus", C.dark], [pct(peak[1]), `omzet 2 bulan jatuh di ${peak[0]}`, C.alarm]];
    for (const [i, [v, l, col]] of st.entries()) {
      const y = 1.4 + i * 1.22;
      card(s, 9.2, y, 3.53, 1.08, i === 3 ? "FBEAE8" : C.tint);
      text(s, v, 9.4, y + 0.08, 3.2, 0.6, { fontFace: HEAD, fontSize: 28, bold: true, color: col, valign: "middle" });
      text(s, l, 9.4, y + 0.66, 3.2, 0.35, { fontSize: 14, color: C.muted });
    }
  }

  // ===== 8. KPI 3-5 =====
  {
    const s = contentSlide(8, `KPI 3–5: dua komoditas menyumbang ${pct(top2Prod)} omzet, dua pembeli grosir ${pct(top2Buy)}`, {
      step: 6, section: "Hasil KPI 3–5",
      notes: `KPI produk dan pembeli (±2 mnt). Melon Sweet Lavender ${rp(products[0][1])} dan Tomat Cherry ${rp(products[1][1])} bersama ${pct(top2Prod)} omzet. Dari sisi volume, urutannya hampir sama, dengan Pete di posisi dua karena dijual per pack murah. Dua pembeli grosir dari Surabaya dan Batu menyerap ${pct(top2Buy)} omzet, sementara ${smallBuyers} dari ${nBuyers} pembeli berbelanja di bawah Rp 300.000.`,
    });
    const top = products.slice(0, 8).reverse();
    s.addChart(pres.charts.BAR, [
      { name: "Lainnya", labels: top.map((p) => p[0]), values: top.map((p, i) => (i >= top.length - 2 ? 0 : +(p[1] / 1e6).toFixed(2))) },
      { name: "Top 2", labels: top.map((p) => p[0]), values: top.map((p, i) => (i >= top.length - 2 ? +(p[1] / 1e6).toFixed(2) : 0)) },
    ], {
      x: M, y: 1.4, w: 6.6, h: 4.85, barDir: "bar", barGrouping: "clustered", barOverlapPct: 100, chartColors: [C.mid, C.warm], showLegend: false,
      showValue: true, dataLabelFormatCode: "#,##0.00;;;", dataLabelFontSize: 11, dataLabelPosition: "outEnd", dataLabelColor: C.text,
      catAxisLabelFontSize: 12, valAxisHidden: true, valGridLine: { style: "none" }, barGapWidthPct: 40,
      showTitle: true, title: "KPI 3 · Pendapatan per komoditas (Rp juta, 8 teratas)", titleFontSize: 13, titleColor: C.dark,
    });
    text(s, `Lainnya (8 komoditas) = ${jt(products.slice(8).reduce((a, b) => a + b[1], 0))}.`, M, 6.3, 6.6, 0.35, { fontSize: 12, italic: true, color: C.muted });
    text(s, "KPI 4 · Volume terjual terbanyak", 7.55, 1.4, 5.2, 0.35, { fontSize: 14, bold: true, color: C.dark });
    table(s, [["Komoditas", "Volume", "Satuan"], ...volumes.slice(0, 4).map(([k, v]) => [k.split("|")[0], nf(v, v % 1 ? 1 : 0), k.split("|")[1]])], 7.55, 1.8, [2.7, 1.25, 1.23], { fontSize: 13, rowH: 0.33 });
    text(s, "KPI 5 · Pembeli dengan belanja terbanyak", 7.55, 3.65, 5.2, 0.35, { fontSize: 14, bold: true, color: C.dark });
    // pembeli perorangan bergelar/nama lengkap disamarkan; nama dagang grosir/vendor ditampilkan
    const anon = (n) => (/[,.]/.test(n) ? "Pembeli perorangan*" : n);
    table(s, [["Pembeli", "Belanja", "% omzet"], ...buyers.slice(0, 5).map(([k, v]) => [anon(k), rp(v), pct(v)])], 7.55, 4.05, [2.6, 1.55, 1.03], { fontSize: 13, rowH: 0.33 });
    text(s, `*nama disamarkan. ${smallBuyers} dari ${nBuyers} pembeli berbelanja total < Rp 300.000.`, 7.55, 6.1, 5.2, 0.5, { fontSize: 12, italic: true, color: C.muted });
  }

  // ===== 9. Wawasan & rekomendasi =====
  {
    const s = contentSlide(9, "Tiga temuan dari dashboard diterjemahkan menjadi tiga keputusan pengelolaan kebun", {
      step: 7, section: "Wawasan & rekomendasi",
      notes: "Rekomendasi (±2 mnt). Pertama, panen raya terkonsentrasi, jadi tanam melon dibuat bergilir. Kedua, omzet terkonsentrasi di dua komoditas dan di Smart Greenhouse, jadi lahan itu diprioritaskan untuk keduanya dan blok kecil dievaluasi. Ketiga, dua pembeli grosir sangat penting, jadi diikat dengan pre-order. Batasannya: data satu musim dan tanpa biaya produksi.",
    });
    const recs = [
      [pct(peak[1]), `omzet jatuh di ${peak[0]}`, "Panen raya serentak", "Tanam Melon Sweet Lavender bergilir dengan selang 1–2 minggu agar panen tersebar dan dashboard mingguan dipakai memantau hasilnya."],
      [pct(top2Prod), "dari 2 komoditas", `Smart Greenhouse = ${pct(lands.SGH)} omzet`, `Prioritaskan SGH untuk Melon Sweet Lavender dan Tomat Cherry; evaluasi blok PP, P3K, PROGEV yang bersama hanya ${pct(lands.PP + lands.P3K + lands.PROGEV)} omzet.`],
      [pct(top2Buy), "dari 2 pembeli grosir", "Serapan bergantung pada grosir", "Tawarkan kontrak pre-order sebelum panen raya kepada B Rara Surabaya dan P Joni Batu, dengan uang muka untuk buah grade A."],
    ];
    const cw = (CW - 2 * 0.3) / 3;
    for (const [i, [v, vl, h, d]] of recs.entries()) {
      const x = M + i * (cw + 0.3), y = 1.45, hh = 4.5;
      card(s, x, y, cw, hh);
      text(s, v, x + 0.3, y + 0.2, cw - 0.6, 0.95, { fontFace: HEAD, fontSize: 48, bold: true, color: i === 0 ? C.alarm : C.dark, valign: "middle" });
      text(s, vl, x + 0.3, y + 1.15, cw - 0.6, 0.35, { fontSize: 15, color: C.muted });
      text(s, "Temuan: " + h, x + 0.3, y + 1.65, cw - 0.6, 0.7, { fontSize: 16, bold: true, color: C.dark });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: y + 2.4, w: cw - 0.3, h: 1.92, fill: { color: C.white }, line: { type: "none" }, rectRadius: 0.06 });
      text(s, [{ text: "Keputusan", options: { bold: true, color: C.warm, breakLine: true } }, { text: d }], x + 0.3, y + 2.5, cw - 0.6, 1.75, { fontSize: 15 });
    }
    bar(s, M, 6.15, CW, 0.65, "Batasan:", "data satu musim (8 minggu) dan tanpa biaya produksi, sehingga rekomendasi perlu diuji ulang dengan data musim berikutnya.");
  }

  // ===== 10. Kesimpulan & tautan =====
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };
    text(s, "Kesimpulan dan tautan dashboard interaktif", M, 0.45, CW, 0.8, { fontFace: HEAD, fontSize: 30, bold: true, color: C.white, valign: "middle" });
    text(s, "10", W - 0.95, 0.35, 0.4, 0.3, { fontSize: 11, color: "A9C2B4", align: "right" });
    const pts = [
      ["Buku kasir menjadi data warehouse", `${nf(fact.length)} transaksi dibersihkan dan dimodelkan ke star schema 1 fakta + 4 dimensi; total ${rp(TOTAL)} tervalidasi.`],
      ["Lima KPI menjawab kapan, apa, siapa", `Puncak di ${peak[0]} (${pct(peak[1])}), dua komoditas ${pct(top2Prod)}, dua pembeli grosir ${pct(top2Buy)} omzet.`],
      ["Dashboard sebagai DSS", "Dipakai evaluasi mingguan untuk jadwal tanam bergilir, prioritas lahan SGH, dan kontrak pre-order."],
    ];
    for (const [i, [h, d]] of pts.entries()) {
      const y = 1.55 + i * 1.3;
      circle(s, i + 1, M, y, 0.6, C.warm);
      text(s, [{ text: h, options: { bold: true, fontSize: 19, breakLine: true } }, { text: d, options: { fontSize: 15, color: "DDEBE2" } }], M + 0.85, y - 0.05, 6.3, 1.2, { color: C.white });
    }
    const bx = 8.0, bw = W - M - bx;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: 1.5, w: bw, h: 4.2, fill: { color: C.white }, line: { type: "none" }, rectRadius: 0.08 });
    text(s, "Dashboard interaktif (Power BI)", bx + 0.3, 1.7, bw - 0.6, 0.4, { fontSize: 17, bold: true, color: C.dark });
    text(s, [{ text: DASHBOARD_URL, options: { hyperlink: { url: DASHBOARD_URL }, color: "0B5CAD", underline: true } }], bx + 0.3, 2.15, bw - 0.6, 0.95, { fontSize: 12 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx + 0.3, y: 2.95, w: 2.2, h: 0.5, fill: { color: C.warm }, line: { type: "none" }, rectRadius: 0.08, hyperlink: { url: DASHBOARD_URL } });
    text(s, [{ text: "Buka dashboard", options: { hyperlink: { url: DASHBOARD_URL }, color: C.white, bold: true } }], bx + 0.3, 2.95, 2.2, 0.5, { fontSize: 15, align: "center", valign: "middle" });
    text(s, [{ text: "Berkas pendukung", options: { bold: true, color: C.dark, breakLine: true } },
      { text: "Data_Warehouse_BBPP_Ketindan_Cleaned.xlsx (data mentah, star schema, ringkasan KPI)", options: { breakLine: true } },
      { text: "BBPP_Ketindan_DSS.pbip (proyek Power BI)", options: { breakLine: true } },
      { text: REPO_URL, options: { hyperlink: { url: REPO_URL }, color: "0B5CAD", underline: true } }],
      bx + 0.3, 3.7, bw - 0.6, 2.0, { fontSize: 13, color: C.text, paraSpaceAfter: 4 });
    text(s, "Ade Surya Ananda · NIM 2646000083 · Sistem Penunjang Keputusan", M, 6.95, 8, 0.35, { fontSize: 12, color: "A9C2B4" });
    s.addNotes("Penutup (±1 mnt). Ringkasnya: buku kasir sudah menjadi data warehouse, lima KPI menjawab kapan, apa, dan siapa, dan dashboard ini bisa langsung dipakai pengelola untuk evaluasi mingguan. Tautan dashboard interaktif ada di kanan.");
  }

  await pres.writeFile({ fileName: OUT });
  if (fs.existsSync(THEME)) {
    await require(THEME).applyTheme(OUT, { name: "Ketindan Green", colors: { dk1: C.text, lt1: C.white, dk2: C.dark, lt2: C.tint, accent1: C.dark, accent2: C.mid, accent3: C.warm, accent4: C.alarm, accent5: "52796F", accent6: "84A98C", hlink: "0B5CAD", folHlink: "6F42C1" } });
  }
  console.log("OK", OUT, { total: TOTAL, peak, mom: mom.toFixed(2), top2Prod: pct(top2Prod), top2Buy: pct(top2Buy), sgh: pct(lands.SGH), smallBuyers });
})();
