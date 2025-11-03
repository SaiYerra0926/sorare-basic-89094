# Start Backend Server Script
Write-Host "Starting Backend Server..."
Write-Host "=================================="

$serverPath = Join-Path $PSScriptRoot "server"
Set-Location $serverPath

# Check if server directory exists
if (-not (Test-Path $serverPath)) {
    Write-Host "ERROR: Server directory not found at $serverPath"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Start the server
Write-Host "Starting server on http://localhost:3001"
Write-Host "Press Ctrl+C to stop the server"
Write-Host "=================================="
node server.js

