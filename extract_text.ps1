$body = [System.IO.File]::ReadAllText('c:\Users\Amogh\Desktop\techweek\body.html')
# Extract all text between tags >text< where text is not empty/whitespace
$regex = [regex]'>([^<]+)<'
$matches = $regex.Matches($body)
$results = @()
foreach ($m in $matches) {
    $t = $m.Groups[1].Value.Trim()
    if ($t.Length -gt 0 -and $t -notmatch '^\s+$') {
        $results += $t
    }
}
$results | Out-File -FilePath 'c:\Users\Amogh\Desktop\techweek\all_extracted_text.txt' -Encoding utf8
Write-Output ("Extracted " + $results.Count + " text nodes. Saved to all_extracted_text.txt")
