"use strict";

const fs = require('fs');
const ttnazureiot = require('.');
const ttn = require('ttn');
const ttnlog = ttn.Log;

// TTN related settings
const appId = process.env.TTN_APP_ID;
const processId = process.env.TTN_PROCESS_ID;
const accessKey = process.env.TTN_APP_ACCESS_KEY;
const region = process.env.TTN_REGION;

// Azure related settings
const hubName = process.env.TTN_AZURE_HUBNAME;
const keyName = process.env.TTN_AZURE_KEYNAME;
const key = process.env.TTN_AZURE_KEY;

const mqttCertPath = process.env.TTN_MQTT_CERT || '/etc/ttn/mqtt-ca.pem';
var options = {
  protocol: 'mqtts',
  ca: fs.readFileSync(mqttCertPath),
};

var logger = new ttnlog.Logger('azure', appId, processId);
const bridge = new ttnazureiot.Bridge(region, appId, accessKey, hubName, keyName, key, options);

bridge.on('info', message => {
  logger.log(ttnlog.Levels.INFO, message);
});

bridge.on('error', message => {
  logger.log(ttnlog.Levels.ERROR, message);
});

bridge.on('warn', message => {
  logger.log(ttnlog.Levels.WARN, message);
});
