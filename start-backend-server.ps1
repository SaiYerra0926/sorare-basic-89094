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

# Read PORT from .env file or use default
$envFile = Join-Path $serverPath ".env"
$port = 3001
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $portLine = $envContent | Where-Object { $_ -match "^PORT=" }
    if ($portLine) {
        $port = ($portLine -split "=")[1].Trim()
        Write-Host "Using port from .env file: $port"
    }
} else {
    Write-Host "No .env file found, using default port: $port"
}

# Function to kill process on a specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    Write-Host "Checking for processes using port $Port..."
    $connections = netstat -ano | Select-String ":$Port\s" | Select-String "LISTENING"
    
    if ($connections) {
        $pids = $connections | ForEach-Object {
            $parts = $_ -split '\s+'
            if ($parts.Length -gt 4) {
                $parts[-1]
            }
        } | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique
        
        foreach ($pid in $pids) {
            Write-Host "Found process $pid using port $Port. Stopping it..."
            try {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "✓ Process $pid stopped successfully"
            } catch {
                Write-Host "⚠ Could not stop process $pid: $_"
            }
        }
        
        # Wait a moment for ports to be released
        Start-Sleep -Seconds 2
    } else {
        Write-Host "✓ Port $Port is available"
    }
}

# Kill any process using the port
Stop-ProcessOnPort -Port $port

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies"
        exit 1
    }
}

# Check if users database is initialized (optional check)
Write-Host "Checking database setup..."
Write-Host "Note: If you see database errors, run: npm run init-users-db"
Write-Host ""

# Start the server
Write-Host "Starting server on http://localhost:$port"
Write-Host "API endpoints will be available at: http://localhost:$port/api/auth"
Write-Host "Health check: http://localhost:$port/health"
Write-Host "Press Ctrl+C to stop the server"
Write-Host "=================================="
node server.js

