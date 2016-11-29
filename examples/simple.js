'use strict';

const ttnazureiot = require('..');

const bridge = new ttnazureiot.Bridge();

bridge.on('ttn-connect', () => {
  console.log('[INFO] TTN connected');
});

bridge.on('error', err => {
  console.warn('[ERROR] Error', err);
});

bridge.on('message', data => {
  console.log('[INFO] Message', data);
});
