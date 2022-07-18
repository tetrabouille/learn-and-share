#/bin/sh
if [ -f ./env/backend.env ]; then
    export $(cat ./env/backend.env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' ) && \
    node ./scripts/generate-credentials.js
fi