#!/bin/sh

node /usr/azure-integration/bridge.js

exitCode=$?
if [ $exitCode -ne 0 ]
then
  printf 'INTEGRATION PROCESS FATAL ERROR\n'
fi

exit $exitCode
