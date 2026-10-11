$text = [System.IO.File]::ReadAllText('c:\Users\Amogh\Desktop\techweek\index.html')
$bodyStart = $text.IndexOf('<body')
$bodyEnd = $text.IndexOf('</body>')
$body = $text.Substring($bodyStart, $bodyEnd - $bodyStart + 7)
$body | Out-File -FilePath 'c:\Users\Amogh\Desktop\techweek\body.html' -Encoding utf8
Write-Output ("Saved body.html, length: " + $body.Length)
