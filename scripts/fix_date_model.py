import json

bim_path = r"E:\Managed Projects\tugas-spk\BBPP_Ketindan_DSS.SemanticModel\model.bim"
with open(bim_path, "r", encoding="utf-8") as f:
    bim = json.load(f)

for table in bim["model"]["tables"]:
    if table["name"] == "Dim_Waktu":
        for col in table["columns"]:
            if col["name"] == "Tanggal":
                col["dataType"] = "string"
                col.pop("formatString", None)
        table["partitions"][0]["source"]["expression"] = [
            "let",
            '    Source = Csv.Document(File.Contents("E:/Managed Projects/tugas-spk/data_csv/Dim_Waktu.csv"),[Delimiter=",", Columns=9, Encoding=65001, QuoteStyle=QuoteStyle.None]),',
            '    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),',
            '    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"DateKey", Int64.Type}, {"Tanggal", type text}, {"Hari", type text}, {"MingguKe", Int64.Type}, {"LabelMinggu", type text}, {"BulanAngka", Int64.Type}, {"NamaBulan", type text}, {"BulanTahun", type text}, {"Tahun", Int64.Type}})',
            "in",
            '    #"Changed Type"'
        ]

with open(bim_path, "w", encoding="utf-8") as f:
    json.dump(bim, f, indent=2)

print("SUCCESS: model.bim updated! Tanggal is now robust string type.")
