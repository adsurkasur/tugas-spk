$pptx = "E:\managed-projects-handoff\tugas-spk\Presentasi_DSS_BBPP_Ketindan.pptx"
$pdf = "E:\managed-projects-handoff\tugas-spk\Presentasi_DSS_BBPP_Ketindan.pdf"
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($pptx, 1, 0, 0)
$pres.SaveAs($pdf, 32)
$pres.Close()
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
Write-Host "PDF_EXPORT_SUCCESS"
