# xtars Deployment Fix Script
# This script helps resolve the "Package Alignment" and "Installation" errors on your Pixel 9.

Write-Host "--- xTars: Starting Project Cleanup & Fresh Sync ---" -ForegroundColor Cyan

# 1. Clear old build artifacts
Write-Host "[1/4] Cleaning old distribution files..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

# 2. Build the web app
Write-Host "[2/4] Building web application..." -ForegroundColor Yellow
npm run build

# 3. Sync with Capacitor
Write-Host "[3/4] Syncing with Android platform..." -ForegroundColor Yellow
npx cap sync android

# 4. Success message & Next Steps
Write-Host "--- Cleanup & Sync Complete! ---" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS FOR YOU:" -ForegroundColor Cyan
Write-Host "1. Open Android Studio."
Write-Host "2. Go to: Build -> Clean Project."
Write-Host "3. Go to: Build -> Rebuild Project."
Write-Host "4. IMPORTANT: On your Pixel 9, long-press the 'xtars' app icon -> App Info -> Storage & Cache -> Clear Storage."
Write-Host "5. Uninstall the old app from your Pixel 9 completely."
Write-Host "6. Run the app again from Android Studio."
Write-Host ""
Write-Host "This ensures a fresh, zip-aligned APK is generated for your device." -ForegroundColor Gray
