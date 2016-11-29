'use strict';

const util = require('util');
const ttn = require('ttn');
const iothub = require('azure-iothub');
const device = require('azure-iot-device');
const amqp = require('azure-iot-device-amqp');
const common = require('azure-iot-common');
const EventEmitter = require('events');

const SAK_CONNECTION_STRING = 'HostName=%s.azure-devices.net;SharedAccessKeyName=%s;SharedAccessKey=%s';
const DEVICE_CONNECTION_STRING = 'HostName=%s.azure-devices.net;DeviceId=%%s;SharedAccessKey=%%s';

const Bridge = class Bridge extends EventEmitter {
  constructor(options) {
    super();
    options = options || {};

    this._createMessage = options.createMessage || function(deviceId, message) {
      const metadata = {
        deviceId: deviceId,
        time: message.metadata.time,
        raw: message.payload_raw.toString('base64')
      };
      return Object.assign({}, message.payload_fields, metadata);
    }

    const appId = checkSetting(process.env.TTN_APP_ID);
    const accessKey = checkSetting(process.env.TTN_APP_ACCESS_KEY);
    const region = checkSetting(process.env.TTN_REGION);

    const hubName = checkSetting(process.env.TTI_AZURE_HUBNAME);
    const keyName = checkSetting(process.env.TTI_AZURE_KEYNAME);
    const key = checkSetting(process.env.TTI_AZURE_KEY);

    this.registry = iothub.Registry.fromConnectionString(util.format(SAK_CONNECTION_STRING, hubName, keyName, key));
    this.deviceConnectionString = util.format(DEVICE_CONNECTION_STRING, hubName);
    this.devices = {};

    this.ttnClient = new ttn.Client(region, appId, accessKey);
    this.ttnClient.on('connect', super.emit.bind(this, 'ttn-connect'));
    this.ttnClient.on('error', super.emit.bind(this, 'error'));
    this.ttnClient.on('message', this._handleMessage.bind(this));
  }

  _getDevice(deviceId) {
    if (this.devices[deviceId]) {
      return Promise.resolve(this.devices[deviceId]);
    }

    return new Promise((resolve, reject) => {
      const device = new iothub.Device(null);
      device.deviceId = deviceId;
      this.registry.create(device, (err, deviceInfo) => {
        if (!err) {
          resolve(deviceInfo);
        } else {
          // The device probably exists
          this.registry.get(device.deviceId, (err, deviceInfo) => {
            if (err) {
              reject(err);
            } else {
              resolve(deviceInfo);
            }
          });
        }
      });
    }).then(deviceInfo => {
      const key = deviceInfo.authentication.symmetricKey.primaryKey;
      const connectionString = util.format(this.deviceConnectionString, deviceId, key);
      const client = amqp.clientFromConnectionString(connectionString);
      return new Promise((resolve, reject) => {
        client.open(err => {
          if (err) {
            reject(err);
          } else {
            this.devices[deviceId] = client;
            resolve(client);
          }
        });
      });
    });
  }

  _handleMessage(deviceId, data) {
    console.log('%s: Handling message', deviceId);

    this._getDevice(deviceId).then(deviceInfo => {
      const message = JSON.stringify(this._createMessage(deviceId, data));

      deviceInfo.sendEvent(new device.Message(message), (err, res) => {
        if (err) {
          console.warn('%s: Could not send event: %s. Closing connection', deviceId, err);
          deviceInfo.close(err => {
            // Delete reference even if close failed
            delete this.devices[deviceId];
          });
          this.emit('error', err);
        } else {
          this.emit('message', { deviceId: deviceId, message: message });
        }
      });
    })
    .catch(err => {
      console.log('%s: Could not get device: %s', deviceId, err);
      super.emit('error', err);
    });
  }
}

module.exports = {
  Bridge: Bridge
};

function checkSetting(variable){
  if ( typeof variable !== 'undefined' && variable ) {
    return variable;
  } else {
    throw new InvalidSetting("Could not get the setting")
  }
}

function InvalidSetting(message) {
  this.message = message;
  this.name = "Invalid setting";
}
