#!/bin/sh

PLATFORM="linux_amd64"

VERSION=$(curl https://github.com/pocketbase/pocketbase/releases/latest --verbose 2>&1 | grep location | sed -e "s#.*/v##" -e "s/[^a-zA-Z0-9.]*$//")

BASE_URL="https://github.com/pocketbase/pocketbase/releases/download"
FILE_NAME="pocketbase_${VERSION}_${PLATFORM}.zip"
DOWNLOAD="${BASE_URL}/v${VERSION}/${FILE_NAME}"

echo "Fetching pocketbase $VERSION $PLATFORM"
curl -fL -o pb.zip $DOWNLOAD
unzip ./pb.zip -d /pb
rm ./pb.zip
