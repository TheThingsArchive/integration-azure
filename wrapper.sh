#!/bin/bash

node usr/azure-integration/bridge.js
printf 'INTEGRATION PROCESS FATAL ERROR: %s\n' "$?"

exit 0
