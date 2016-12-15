'use strict';

const ttnazureiot = require('.');

// TTN related settings
const appId = process.env.TTN_APP_ID;
const accessKey = process.env.TTN_APP_ACCESS_KEY;
const region = process.env.TTN_REGION;

// Azure related settings
const hubName = process.env.TTI_AZURE_HUBNAME;
const keyName = process.env.TTI_AZURE_KEYNAME;
const key = process.env.TTI_AZURE_KEY;

const bridge = new ttnazureiot.Bridge(region, appId, accessKey, hubName, keyName, key);

bridge.on('ttn-connect', () => {
  console.log('TTN connected');
});

bridge.on('error', err => {
  console.warn('Failed to handle uplink', err);
});

bridge.on('message', data => {
  console.log('Handled uplink', data);
});
