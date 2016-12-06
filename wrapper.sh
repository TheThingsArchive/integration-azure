#!/bin/bash

node usr/azure-integration/examples/simple.js
printf 'INTEGRATION PROCESS FATAL ERROR: %s\n' "$?"

exit 1
