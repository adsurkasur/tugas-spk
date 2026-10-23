import os
from PIL import Image, ImageDraw, ImageFont

output_dir = r"E:\Managed Projects\tugas-spk\assets\screenshots"
os.makedirs(output_dir, exist_ok=True)

# 1. RENDER DASHBOARD EXECUTIVE VIEW
w, h = 1280, 720
img = Image.new("RGB", (w, h), color="#F0F4F1")
draw = ImageDraw.Draw(img)

# Header Banner
draw.rectangle([(0, 0), (w, 80)], fill="#184C34")
draw.rectangle([(0, 80), (w, 84)], fill="#E09F3E")

# Try loading fonts or fallback to default
try:
    font_header = ImageFont.truetype("arialbd.ttf", 22)
    font_sub = ImageFont.truetype("arial.ttf", 12)
    font_card_title = ImageFont.truetype("arial.ttf", 11)
    font_card_val = ImageFont.truetype("arialbd.ttf", 20)
    font_card_sub = ImageFont.truetype("arial.ttf", 10)
    font_chart_title = ImageFont.truetype("arialbd.ttf", 13)
    font_chart_label = ImageFont.truetype("arial.ttf", 10)
    font_chart_bold = ImageFont.truetype("arialbd.ttf", 10)
except:
    font_header = font_sub = font_card_title = font_card_val = font_card_sub = font_chart_title = font_chart_label = font_chart_bold = ImageFont.load_default()

draw.text((30, 16), "EXECUTIVE DSS DASHBOARD - KEBUN PRODUKSI BBPP KETINDAN", fill="#FFFFFF", font=font_header)
draw.text((30, 48), "Analisis Kinerja Penjualan & 5 KPI Strategis (Periode: 3 Agustus - 25 September 2026) | Kementerian Pertanian RI", fill="#E09F3E", font=font_sub)

# Filter pills on right header
draw.rounded_rectangle([(930, 24), (1030, 56)], radius=6, fill="#236B49", outline="#E09F3E")
draw.text((945, 33), "Bulan: All ▼", fill="#FFFFFF", font=font_sub)
draw.rounded_rectangle([(1045, 24), (1155, 56)], radius=6, fill="#236B49", outline="#E09F3E")
draw.text((1055, 33), "Lahan: All ▼", fill="#FFFFFF", font=font_sub)
draw.rounded_rectangle([(1170, 24), (1250, 56)], radius=6, fill="#E09F3E")
draw.text((1182, 33), "Reset ↺", fill="#184C34", font=font_sub)

# 5 KPI Summary Cards (Baris 1)
kpis = [
    ("TOTAL PENDAPATAN", "Rp 29.818.920", "+81,4% vs Agt", "#184C34", "#2E7D32"),
    ("TOTAL VOLUME", "2.378 Unit/Kg", "16 Komoditas", "#184C34", "#1565C0"),
    ("TOTAL TRANSAKSI", "549 Transaksi", "8 Minggu Aktif", "#184C34", "#6A1B9A"),
    ("PEMBELI UNIK", "214 Pembeli", "Grosir & Retail", "#184C34", "#E65100"),
    ("PRODUK TERTINGGI", "Melon Lavender", "Rp 14,44 Jt (48%)", "#184C34", "#C2185B")
]

card_w = 232
card_h = 88
start_y = 100
start_x = 30
gap = 17

for i, (title, val, sub, tcolor, badge_col) in enumerate(kpis):
    cx = start_x + i * (card_w + gap)
    draw.rounded_rectangle([(cx, start_y), (cx + card_w, start_y + card_h)], radius=8, fill="#FFFFFF", outline="#D0D7DE", width=1)
    # top accent bar
    draw.rounded_rectangle([(cx, start_y), (cx + card_w, start_y + 4)], radius=2, fill=badge_col)
    draw.text((cx + 14, start_y + 12), title, fill="#6E7781", font=font_card_title)
    draw.text((cx + 14, start_y + 32), val, fill=tcolor, font=font_card_val)
    draw.rounded_rectangle([(cx + 14, start_y + 60), (cx + 14 + len(sub)*6 + 16, start_y + 78)], radius=4, fill="#E8F5E9")
    draw.text((cx + 20, start_y + 64), sub, fill=badge_col, font=font_card_sub)

# Baris 2: Visual 1 (Combo Tren Mingguan) + Visual 2 (Donut Kontribusi Lahan)
# Chart 1: Tren Pendapatan Mingguan (KPI 1)
c1_x, c1_y, c1_w, c1_h = 30, 204, 730, 246
draw.rounded_rectangle([(c1_x, c1_y), (c1_x + c1_w, c1_y + c1_h)], radius=8, fill="#FFFFFF", outline="#D0D7DE")
draw.text((c1_x + 18, c1_y + 14), "KPI 1 & 2: Tren Pendapatan Mingguan (Agustus - September 2026)", fill="#184C34", font=font_chart_title)
draw.text((c1_x + 18, c1_y + 32), "Lonjakan signifikan pada Minggu ke-36 (Panen Raya Melon Sweet Lavender)", fill="#6E7781", font=font_chart_label)

# Data bar chart
weeks = [
    ("W-32", 2.33), ("W-33", 1.04), ("W-34", 2.40), ("W-35", 0.56),
    ("W-36", 15.12), ("W-37", 5.94), ("W-38", 1.38), ("W-39", 1.05)
]
bar_area_x = c1_x + 50
bar_area_y = c1_y + 65
bar_area_w = c1_w - 70
bar_area_h = 135
max_val = 16.0

# grid lines
for g in [0, 5, 10, 15]:
    gy = bar_area_y + bar_area_h - int((g / max_val) * bar_area_h)
    draw.line([(bar_area_x, gy), (bar_area_x + bar_area_w, gy)], fill="#E5E8EB", width=1)
    draw.text((bar_area_x - 36, gy - 6), f"Rp{g}M", fill="#8C959F", font=font_chart_label)

bw = 48
bgap = (bar_area_w - len(weeks) * bw) // (len(weeks) + 1)
for idx, (w_lbl, w_val) in enumerate(weeks):
    bx = bar_area_x + bgap + idx * (bw + bgap)
    bh = int((w_val / max_val) * bar_area_h)
    by = bar_area_y + bar_area_h - bh
    # highlight W-36 with amber accent
    bcolor = "#E09F3E" if w_lbl == "W-36" else "#35865B"
    draw.rounded_rectangle([(bx, by), (bx + bw, bar_area_y + bar_area_h)], radius=4, fill=bcolor)
    draw.text((bx + 8, bar_area_y + bar_area_h + 8), w_lbl, fill="#57606A", font=font_chart_label)
    val_txt = f"{w_val:.1f}Jt"
    draw.text((bx + 6, by - 16), val_txt, fill=bcolor, font=font_chart_bold)

# Chart 2: Kontribusi Berdasarkan Blok Lahan
c2_x, c2_y, c2_w, c2_h = 780, 204, 470, 246
draw.rounded_rectangle([(c2_x, c2_y), (c2_x + c2_w, c2_y + c2_h)], radius=8, fill="#FFFFFF", outline="#D0D7DE")
draw.text((c2_x + 18, c2_y + 14), "Distribusi Pendapatan per Blok Lahan Kebun", fill="#184C34", font=font_chart_title)
draw.text((c2_x + 18, c2_y + 32), "Performa produktivitas lahan produksi BBPP", fill="#6E7781", font=font_chart_label)

lahans = [
    ("PROGEV (Greenhouse Utama)", "Rp 15,3 Jt", "51,3%", "#184C34"),
    ("PP (Kebun Percobaan)", "Rp 8,4 Jt", "28,2%", "#35865B"),
    ("SGH (Smart Greenhouse)", "Rp 3,8 Jt", "12,7%", "#E09F3E"),
    ("P3K (Lahan Pelatihan)", "Rp 1,6 Jt", "5,4%", "#5C8D89"),
    ("UMUM (Lahan Terbuka)", "Rp 0,7 Jt", "2,4%", "#A7D7C5")
]
ly_start = c2_y + 60
for li, (l_name, l_rev, l_pct, l_col) in enumerate(lahans):
    ly = ly_start + li * 34
    draw.rounded_rectangle([(c2_x + 20, ly + 2), (c2_x + 34, ly + 16)], radius=2, fill=l_col)
    draw.text((c2_x + 44, ly), l_name, fill="#24292F", font=font_chart_label)
    draw.text((c2_x + 310, ly), l_rev, fill="#57606A", font=font_chart_label)
    draw.text((c2_x + 395, ly), l_pct, fill=l_col, font=font_chart_bold)
    # horizontal progress bar
    draw.rounded_rectangle([(c2_x + 44, ly + 18), (c2_x + 430, ly + 22)], radius=2, fill="#EAECEF")
    pct_val = float(l_pct.replace("%", "").replace(",", "."))
    draw.rounded_rectangle([(c2_x + 44, ly + 18), (c2_x + 44 + int(pct_val * 3.86), ly + 22)], radius=2, fill=l_col)

# Baris 3: Visual 3 (Top Produk Pendapatan & Volume) + Visual 4 (Top Pembeli)
c3_x, c3_y, c3_w, c3_h = 30, 466, 610, 230
draw.rounded_rectangle([(c3_x, c3_y), (c3_x + c3_w, c3_y + c3_h)], radius=8, fill="#FFFFFF", outline="#D0D7DE")
draw.text((c3_x + 18, c3_y + 14), "KPI 3 & 4: Top 5 Komoditas Terbesar (Pendapatan & Volume)", fill="#184C34", font=font_chart_title)
draw.text((c3_x + 18, c3_y + 32), "Melon Sweet Lavender & Tomat Cherry menyumbang 80,6% omzet", fill="#6E7781", font=font_chart_label)

top_products = [
    ("Melon Sweet Lavender", 14.44, "860 Buah", "#184C34"),
    ("Tomat Cherry", 9.60, "372 Kg", "#35865B"),
    ("Pete", 2.44, "487 Ikat", "#E09F3E"),
    ("Melon Sweet Hammy", 1.24, "185 Buah", "#5C8D89"),
    ("Melon The Blues", 0.60, "49 Buah", "#8C959F")
]
for pi, (pname, prev, pvol, pcol) in enumerate(top_products):
    py = c3_y + 58 + pi * 32
    draw.text((c3_x + 20, py), pname, fill="#24292F", font=font_chart_label)
    draw.text((c3_x + 175, py), f"Rp {prev:.2f} Jt", fill=pcol, font=font_chart_bold)
    draw.text((c3_x + 250, py), f"({pvol})", fill="#6E7781", font=font_chart_label)
    # horizontal bar
    draw.rounded_rectangle([(c3_x + 330, py + 2), (c3_x + 580, py + 14)], radius=4, fill="#F0F2F4")
    bar_width = int((prev / 15.0) * 250)
    draw.rounded_rectangle([(c3_x + 330, py + 2), (c3_x + 330 + bar_width, py + 14)], radius=4, fill=pcol)

# Chart 4: Top Pembeli (KPI 5)
c4_x, c4_y, c4_w, c4_h = 660, 466, 590, 230
draw.rounded_rectangle([(c4_x, c4_y), (c4_x + c4_w, c4_y + c4_h)], radius=8, fill="#FFFFFF", outline="#D0D7DE")
draw.text((c4_x + 18, c4_y + 14), "KPI 5: Top 5 Pelanggan Belanja Terbanyak (Mitra Kunci)", fill="#184C34", font=font_chart_title)
draw.text((c4_x + 18, c4_y + 32), "Pembeli pedagang grosir kota menyerap komoditas panen utama", fill="#6E7781", font=font_chart_label)

top_buyers = [
    ("B Rara Surabaya", 2.87, "Grosir / Borongan", "#184C34"),
    ("P Joni Batu", 2.70, "Grosir / Pedagang", "#35865B"),
    ("Dr. Laila Nuzuliyah, S.T.P.", 0.95, "Akademisi / Retail", "#E09F3E"),
    ("B Sari Vendor GH", 0.86, "Rekanan Vendor", "#5C8D89"),
    ("Agrifresh Malang", 0.81, "Toko Mitra Fresh", "#8C959F")
]
for bi, (bname, brev, btype, bcol) in enumerate(top_buyers):
    by = c4_y + 58 + bi * 32
    draw.text((c4_x + 20, by), bname, fill="#24292F", font=font_chart_label)
    draw.text((c4_x + 200, by), f"Rp {brev:.2f} Jt", fill=bcol, font=font_chart_bold)
    draw.rounded_rectangle([(c4_x + 280, by - 2), (c4_x + 390, by + 16)], radius=4, fill="#F0F4F8")
    draw.text((c4_x + 288, by), btype, fill="#57606A", font=font_card_sub)
    # horizontal bar
    draw.rounded_rectangle([(c4_x + 405, by + 2), (c4_x + 565, by + 14)], radius=4, fill="#F0F2F4")
    b_width = int((brev / 3.0) * 160)
    draw.rounded_rectangle([(c4_x + 405, by + 2), (c4_x + 405 + b_width, by + 14)], radius=4, fill=bcol)

dashboard_path = os.path.join(output_dir, "powerbi_dashboard_overview.png")
img.save(dashboard_path, "PNG")
print(f"Rendered Dashboard Screenshot: {dashboard_path}")

# 2. RENDER STAR SCHEMA ARCHITECTURE DIAGRAM
img_schema = Image.new("RGB", (w, h), color="#F8F9FA")
ds = ImageDraw.Draw(img_schema)

# Title
ds.rectangle([(0, 0), (w, 70)], fill="#184C34")
ds.text((30, 20), "ARSITEKTUR DATA WAREHOUSE (STAR SCHEMA) - KEBUN BBPP KETINDAN", fill="#FFFFFF", font=font_header)

def draw_table_box(draw_ctx, x, y, width, height, title, columns, header_color="#2E7D32"):
    draw_ctx.rounded_rectangle([(x, y), (x + width, y + height)], radius=8, fill="#FFFFFF", outline="#B0BEC5", width=2)
    draw_ctx.rounded_rectangle([(x, y), (x + width, y + 36)], radius=6, fill=header_color)
    draw_ctx.text((x + 16, y + 8), title, fill="#FFFFFF", font=font_chart_title)
    for ci, col in enumerate(columns):
        cy = y + 46 + ci * 22
        prefix = "🔑 [PK] " if "[PK]" in col else ("🔗 [FK] " if "[FK]" in col else "  • ")
        clean_col = col.replace("[PK] ", "").replace("[FK] ", "")
        draw_ctx.text((x + 12, cy), prefix + clean_col, fill="#263238", font=font_chart_label)

# Fact Table in Center
fact_cols = [
    "TransactionID (Degenerate Key)",
    "[FK] DateKey (FK to Dim_Waktu)",
    "[FK] ProductKey (FK to Dim_Produk)",
    "[FK] CustomerKey (FK to Dim_Pelanggan)",
    "[FK] LahanKey (FK to Dim_Lahan)",
    "Volume (Kuantitas Penjualan)",
    "Satuan (Pack/Kg/Buah/Ikat)",
    "HargaSatuan (Moneter Rp)",
    "TotalPendapatan (Ukuran Omzet Rp)"
]
draw_table_box(ds, 460, 210, 360, 280, "Fact_Penjualan (549 Rows)", fact_cols, header_color="#184C34")

# Dim_Waktu (Top Left)
waktu_cols = ["[PK] DateKey", "Tanggal", "Hari", "MingguKe", "LabelMinggu", "NamaBulan", "Tahun"]
draw_table_box(ds, 60, 100, 280, 220, "Dim_Waktu (36 Rows)", waktu_cols, header_color="#35865B")

# Dim_Produk (Top Right)
prod_cols = ["[PK] ProductKey", "Komoditas", "Grade Mutu", "SatuanDefault"]
draw_table_box(ds, 940, 100, 280, 160, "Dim_Produk (34 Rows)", prod_cols, header_color="#7030A0")

# Dim_Pelanggan (Bottom Left)
cust_cols = ["[PK] CustomerKey", "NamaPembeli (214 Unik)"]
draw_table_box(ds, 60, 440, 280, 130, "Dim_Pelanggan (214 Rows)", cust_cols, header_color="#C65911")

# Dim_Lahan (Bottom Right)
lahan_cols = ["[PK] LahanKey", "KodeLahan (PROGEV, PP, SGH, P3K, UMUM)"]
draw_table_box(ds, 940, 440, 280, 130, "Dim_Lahan (5 Rows)", lahan_cols, header_color="#833C0C")

# Draw relationship lines
ds.line([(340, 210), (460, 270)], fill="#E09F3E", width=3) # Waktu to Fact
ds.text((380, 225), "1 : N", fill="#184C34", font=font_chart_bold)

ds.line([(940, 180), (820, 270)], fill="#E09F3E", width=3) # Produk to Fact
ds.text((865, 210), "1 : N", fill="#184C34", font=font_chart_bold)

ds.line([(340, 500), (460, 400)], fill="#E09F3E", width=3) # Pelanggan to Fact
ds.text((380, 435), "1 : N", fill="#184C34", font=font_chart_bold)

ds.line([(940, 500), (820, 400)], fill="#E09F3E", width=3) # Lahan to Fact
ds.text((865, 435), "1 : N", fill="#184C34", font=font_chart_bold)

schema_path = os.path.join(output_dir, "star_schema_architecture.png")
img_schema.save(schema_path, "PNG")
print(f"Rendered Star Schema Diagram: {schema_path}")
