'use strict';

const ttnazureiot = require('..');

// Replace with your region, app ID and access key
const region = '<insert region>';
const appId = '<insert app ID>';
const accessKey = '<insert access key>';

// Replace with your Azure IoT Hub name, key name and key
const hubName = '<insert hub name>';
const keyName = 'iothubowner';
const key = '<insert key>';

const bridge = new ttnazureiot.Bridge(region, appId, accessKey, hubName, keyName, key);

bridge.on('ttn-connect', () => {
  console.log('TTN connected');
});

bridge.on('error', err => {
  console.warn('Error', err);
});

bridge.on('message', data => {
  console.log('Message', data);
});
