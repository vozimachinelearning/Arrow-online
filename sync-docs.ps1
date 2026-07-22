# Sync public/ to docs/ for GitHub Pages deployment
Remove-Item -Path 'docs\*' -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path 'public\*' -Destination 'docs\' -Recurse -Force
Write-Host '✓ docs/ synced from public/' -ForegroundColor Green
