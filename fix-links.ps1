$files = @('index.html','features.html','pricing.html','download.html','docs.html','support.html','about.html','contact.html','404.html')
$dir = 'c:\Users\LoOper\LoOperWeb\arrow-site\public'

foreach ($f in $files) {
  $path = Join-Path $dir $f
  $content = Get-Content $path -Raw

  # Add base tag after <head>
  $content = $content -replace '<head>\s*<meta charset', "<head>`r`n  <base href=""/Arrow-online/"" />`r`n  <meta charset"

  # Fix absolute hrefs to relative
  $content = $content -replace 'href="/features"','href="features"'
  $content = $content -replace 'href="/pricing"','href="pricing"'
  $content = $content -replace 'href="/download"','href="download"'
  $content = $content -replace 'href="/docs"','href="docs"'
  $content = $content -replace 'href="/support"','href="support"'
  $content = $content -replace 'href="/about"','href="about"'
  $content = $content -replace 'href="/contact"','href="contact"'
  $content = $content -replace 'href="/home"','href="home"'

  # Fix home link - only <a> tags
  $content = $content -replace '<a href="/" class="tab-btn','<a href="." class="tab-btn'
  $content = $content -replace '<a href="/" class="btn','<a href="." class="btn'

  Set-Content -Path $path -Value $content
  Write-Output "Fixed $f"
}
