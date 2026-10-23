import os
import uuid

base_dir = r"E:\Managed Projects\tugas-spk"
sem_dir = os.path.join(base_dir, "BBPP_Ketindan_DSS.SemanticModel", "definition")
tables_dir = os.path.join(sem_dir, "tables")
os.makedirs(tables_dir, exist_ok=True)

csv_sales = os.path.join(base_dir, "data_csv", "Fact_Penjualan.csv").replace("\\", "/")
csv_waktu = os.path.join(base_dir, "data_csv", "Dim_Waktu.csv").replace("\\", "/")
csv_produk = os.path.join(base_dir, "data_csv", "Dim_Produk.csv").replace("\\", "/")
csv_pelanggan = os.path.join(base_dir, "data_csv", "Dim_Pelanggan.csv").replace("\\", "/")
csv_lahan = os.path.join(base_dir, "data_csv", "Dim_Lahan.csv").replace("\\", "/")

# 1. database.tmdl
with open(os.path.join(sem_dir, "database.tmdl"), "w", encoding="utf-8") as f:
    f.write("database\n\tcompatibilityLevel: 1600\n")

# 2. model.tmdl
model_tmdl = """model Model
\tculture: id-ID
\tdefaultPowerBIDataSourceVersion: powerBI_V3
\tsourceQueryCulture: id-ID

\tannotation PBI_QueryOrder = ["Dim_Waktu","Dim_Produk","Dim_Pelanggan","Dim_Lahan","Fact_Penjualan"]

\tref table Dim_Waktu
\tref table Dim_Produk
\tref table Dim_Pelanggan
\tref table Dim_Lahan
\tref table Fact_Penjualan
"""
with open(os.path.join(sem_dir, "model.tmdl"), "w", encoding="utf-8") as f:
    f.write(model_tmdl)

# 3. relationships.tmdl
rel_tmdl = f"""relationship '{uuid.uuid4()}'
\tfromTable: Fact_Penjualan
\tfromColumn: DateKey
\ttoTable: Dim_Waktu
\ttoColumn: DateKey

relationship '{uuid.uuid4()}'
\tfromTable: Fact_Penjualan
\tfromColumn: ProductKey
\ttoTable: Dim_Produk
\ttoColumn: ProductKey

relationship '{uuid.uuid4()}'
\tfromTable: Fact_Penjualan
\tfromColumn: CustomerKey
\ttoTable: Dim_Pelanggan
\ttoColumn: CustomerKey

relationship '{uuid.uuid4()}'
\tfromTable: Fact_Penjualan
\tfromColumn: LahanKey
\ttoTable: Dim_Lahan
\ttoColumn: LahanKey
"""
with open(os.path.join(sem_dir, "relationships.tmdl"), "w", encoding="utf-8") as f:
    f.write(rel_tmdl)

# 4. Dim_Waktu.tmdl
waktu_tmdl = """table Dim_Waktu
\tlineageTag: __TAG__

\tcolumn DateKey
\t\tdataType: int64
\t\tsummarizeBy: none
\t\tsourceColumn: DateKey

\tcolumn Tanggal
\t\tdataType: dateTime
\t\tformatString: yyyy-mm-dd
\t\tsummarizeBy: none
\t\tsourceColumn: Tanggal

\tcolumn Hari
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: Hari

\tcolumn MingguKe
\t\tdataType: int64
\t\tsummarizeBy: none
\t\tsourceColumn: MingguKe

\tcolumn LabelMinggu
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: LabelMinggu
\t\tsortByColumn: MingguKe

\tcolumn BulanAngka
\t\tdataType: int64
\t\tsummarizeBy: none
\t\tsourceColumn: BulanAngka

\tcolumn NamaBulan
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: NamaBulan
\t\tsortByColumn: BulanAngka

\tcolumn BulanTahun
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: BulanTahun

\tcolumn Tahun
\t\tdataType: int64
\t\tsummarizeBy: none
\t\tsourceColumn: Tahun

\tpartition Dim_Waktu = m
\t\tmode: import
\t\tsource =
\t\t\tlet
\t\t\t\tSource = Csv.Document(File.Contents("__CSV__"),[Delimiter=",", Columns=9, Encoding=65001, QuoteStyle=QuoteStyle.None]),
\t\t\t\t#"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
\t\t\t\t#"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"DateKey", Int64.Type}, {"Tanggal", type date}, {"Hari", type text}, {"MingguKe", Int64.Type}, {"LabelMinggu", type text}, {"BulanAngka", Int64.Type}, {"NamaBulan", type text}, {"BulanTahun", type text}, {"Tahun", Int64.Type}})
\t\t\tin
\t\t\t\t#"Changed Type"
""".replace("__TAG__", str(uuid.uuid4())).replace("__CSV__", csv_waktu)

with open(os.path.join(tables_dir, "Dim_Waktu.tmdl"), "w", encoding="utf-8") as f:
    f.write(waktu_tmdl)

# 5. Dim_Produk.tmdl
prod_tmdl = """table Dim_Produk
\tlineageTag: __TAG__

\tcolumn ProductKey
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: ProductKey

\tcolumn Komoditas
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: Komoditas

\tcolumn Grade
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: Grade

\tcolumn SatuanDefault
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: SatuanDefault

\tpartition Dim_Produk = m
\t\tmode: import
\t\tsource =
\t\t\tlet
\t\t\t\tSource = Csv.Document(File.Contents("__CSV__"),[Delimiter=",", Columns=4, Encoding=65001, QuoteStyle=QuoteStyle.None]),
\t\t\t\t#"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
\t\t\t\t#"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"ProductKey", type text}, {"Komoditas", type text}, {"Grade", type text}, {"SatuanDefault", type text}})
\t\t\tin
\t\t\t\t#"Changed Type"
""".replace("__TAG__", str(uuid.uuid4())).replace("__CSV__", csv_produk)

with open(os.path.join(tables_dir, "Dim_Produk.tmdl"), "w", encoding="utf-8") as f:
    f.write(prod_tmdl)

# 6. Dim_Pelanggan.tmdl
cust_tmdl = """table Dim_Pelanggan
\tlineageTag: __TAG__

\tcolumn CustomerKey
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: CustomerKey

\tcolumn NamaPembeli
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: NamaPembeli

\tpartition Dim_Pelanggan = m
\t\tmode: import
\t\tsource =
\t\t\tlet
\t\t\t\tSource = Csv.Document(File.Contents("__CSV__"),[Delimiter=",", Columns=2, Encoding=65001, QuoteStyle=QuoteStyle.None]),
\t\t\t\t#"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
\t\t\t\t#"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"CustomerKey", type text}, {"NamaPembeli", type text}})
\t\t\tin
\t\t\t\t#"Changed Type"
""".replace("__TAG__", str(uuid.uuid4())).replace("__CSV__", csv_pelanggan)

with open(os.path.join(tables_dir, "Dim_Pelanggan.tmdl"), "w", encoding="utf-8") as f:
    f.write(cust_tmdl)

# 7. Dim_Lahan.tmdl
lahan_tmdl = """table Dim_Lahan
\tlineageTag: __TAG__

\tcolumn LahanKey
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: LahanKey

\tcolumn KodeLahan
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: KodeLahan

\tpartition Dim_Lahan = m
\t\tmode: import
\t\tsource =
\t\t\tlet
\t\t\t\tSource = Csv.Document(File.Contents("__CSV__"),[Delimiter=",", Columns=2, Encoding=65001, QuoteStyle=QuoteStyle.None]),
\t\t\t\t#"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
\t\t\t\t#"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"LahanKey", type text}, {"KodeLahan", type text}})
\t\t\tin
\t\t\t\t#"Changed Type"
""".replace("__TAG__", str(uuid.uuid4())).replace("__CSV__", csv_lahan)

with open(os.path.join(tables_dir, "Dim_Lahan.tmdl"), "w", encoding="utf-8") as f:
    f.write(lahan_tmdl)

# 8. Fact_Penjualan.tmdl
fact_tmdl = """table Fact_Penjualan
\tlineageTag: __TAG1__

\tmeasure 'Total Pendapatan' = SUM(Fact_Penjualan[TotalPendapatan])
\t\tformatString: "Rp"#,0
\t\tlineageTag: __TAG2__

\tmeasure 'Total Volume' = SUM(Fact_Penjualan[Volume])
\t\tformatString: #,0
\t\tlineageTag: __TAG3__

\tmeasure 'Total Transaksi' = COUNTROWS(Fact_Penjualan)
\t\tformatString: #,0
\t\tlineageTag: __TAG4__

\tmeasure 'Rata-rata Pendapatan per Transaksi' = AVERAGE(Fact_Penjualan[TotalPendapatan])
\t\tformatString: "Rp"#,0
\t\tlineageTag: __TAG5__

\tmeasure 'Total Pembeli Unik' = DISTINCTCOUNT(Fact_Penjualan[CustomerKey])
\t\tformatString: #,0
\t\tlineageTag: __TAG6__

\tcolumn TransactionID
\t\tdataType: int64
\t\tsummarizeBy: count
\t\tsourceColumn: TransactionID

\tcolumn DateKey
\t\tdataType: int64
\t\tsummarizeBy: none
\t\tsourceColumn: DateKey

\tcolumn ProductKey
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: ProductKey

\tcolumn CustomerKey
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: CustomerKey

\tcolumn LahanKey
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: LahanKey

\tcolumn Volume
\t\tdataType: double
\t\tsummarizeBy: sum
\t\tsourceColumn: Volume

\tcolumn Satuan
\t\tdataType: string
\t\tsummarizeBy: none
\t\tsourceColumn: Satuan

\tcolumn HargaSatuan
\t\tdataType: double
\t\tformatString: "Rp"#,0
\t\tsummarizeBy: average
\t\tsourceColumn: HargaSatuan

\tcolumn TotalPendapatan
\t\tdataType: double
\t\tformatString: "Rp"#,0
\t\tsummarizeBy: sum
\t\tsourceColumn: TotalPendapatan

\tpartition Fact_Penjualan = m
\t\tmode: import
\t\tsource =
\t\t\tlet
\t\t\t\tSource = Csv.Document(File.Contents("__CSV__"),[Delimiter=",", Columns=9, Encoding=65001, QuoteStyle=QuoteStyle.None]),
\t\t\t\t#"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
\t\t\t\t#"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"TransactionID", Int64.Type}, {"DateKey", Int64.Type}, {"ProductKey", type text}, {"CustomerKey", type text}, {"LahanKey", type text}, {"Volume", type number}, {"Satuan", type text}, {"HargaSatuan", type number}, {"TotalPendapatan", type number}})
\t\t\tin
\t\t\t\t#"Changed Type"
""".replace("__TAG1__", str(uuid.uuid4())) \
   .replace("__TAG2__", str(uuid.uuid4())) \
   .replace("__TAG3__", str(uuid.uuid4())) \
   .replace("__TAG4__", str(uuid.uuid4())) \
   .replace("__TAG5__", str(uuid.uuid4())) \
   .replace("__TAG6__", str(uuid.uuid4())) \
   .replace("__CSV__", csv_sales)

with open(os.path.join(tables_dir, "Fact_Penjualan.tmdl"), "w", encoding="utf-8") as f:
    f.write(fact_tmdl)

print("SUCCESS: Generated all TMDL files with clean syntax!")
