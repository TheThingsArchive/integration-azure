'use strict';
const fs = require('fs');

const ttnazureiot = require('.');

// TTN related settings
const appId = process.env.TTN_APP_ID;
const accessKey = process.env.TTN_APP_ACCESS_KEY;
const region = process.env.TTN_REGION;

// Azure related settings
const hubName = process.env.TTN_AZURE_HUBNAME;
const keyName = process.env.TTN_AZURE_KEYNAME;
const key = process.env.TTN_AZURE_KEY;

var options;

try {
  const mqttCertPath = process.env.TTN_MQTT_CERT;
  if (!mqttCertPath) {
    throw new Error('Could not find the ca certificate');
  }
  options = {
    protocol: 'mqtts',
    ca: [ fs.readFileSync(mqttCertPath) ],
  };
}
catch(err) {
  options = {};
  console.warn('Could not connect using TLS %s', err);
  console.warn("Fallback to a non-secure connection");
}

const bridge = new ttnazureiot.Bridge(region, appId, accessKey, hubName, keyName, key, options);

bridge.on('ttn-connect', () => {
  console.log('TTN connected');
});

bridge.on('error', err => {
  console.warn('Failed to handle uplink', err);
});

bridge.on('message', data => {
  console.log('Handled uplink', data);
});
