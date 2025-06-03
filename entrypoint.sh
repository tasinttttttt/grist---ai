#!/bin/sh
#nginx
node /var/html/app/index.js && /pb/pocketbase serve --http=0.0.0.0:8090
