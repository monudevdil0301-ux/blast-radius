# BlastRadius Local Demo Runner
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   💥 Starting BlastRadius Preview...   " -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\static\frontend"

Write-Host "Opening local Vite development server..." -ForegroundColor Green
Write-Host "You can test the full UI, Rovo Sentry chat, and Failure Simulator!" -ForegroundColor Cyan
npm run dev
