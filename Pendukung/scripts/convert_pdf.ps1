# Ekspor presentasi PPTX (Pendukung/presentasi) ke PDF pengumpulan di root repo via PowerPoint.
$prefix = "SPK_Ade Surya Ananda_2646000083"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$pptx = Join-Path $root "Pendukung\presentasi\${prefix}_Presentasi.pptx"
$pdf = Join-Path $root "${prefix}_4_Presentasi.pdf"
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($pptx, 1, 0, 0)
$pres.SaveAs($pdf, 32)
$pres.Close()
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
Write-Host "PDF_EXPORT_SUCCESS $pdf"
