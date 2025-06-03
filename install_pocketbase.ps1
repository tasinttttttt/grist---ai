# Define variables
$VERSION = "0.23.4"
$PLATFORM = "windows_amd64"
$URL = "https://github.com/pocketbase/pocketbase/releases/download/v$VERSION/pocketbase_${VERSION}_${PLATFORM}.zip"

# Print a message
Write-Host "Fetching pocketbase $VERSION $PLATFORM"

# Download the file
Invoke-WebRequest -Uri $URL -OutFile "pb.zip"

# Unzip the file
Expand-Archive -Path "pb.zip" -DestinationPath ".\pb" -Force
