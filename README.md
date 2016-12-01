# The Things Network Azure IoT Hub Integration

This is an example integration of The Things Network with Azure IoT Hub. This integration features creating devices in the Azure IoT Hub device registry as well as sending events from uplink messages.

## Example

This integration requires an shared access policy key name with Registry read and write and Device connect permissions. In this example, we use the **iothubowner** policy which has these permissions enabled by default.

```js
'use strict';

const ttnazureiot = require('ttn-azure-iothub');

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
```

## Options

When creating and initializing the `Bridge`, you can specify options:

```js
const options = {};
const bridge = new ttnazureiot.Bridge(region, appID, accessKey, hubName, keyName, key, options);
```

### `createMessage`

The function to create a message. By default, the message is a combination of the result of the payload functions `fields`, the unique device ID and the server time:

```js
options.createMessage = function(deviceId, message) {
  const metadata = {
    deviceId: deviceId,
    time: message.metadata.time,
    raw: message.payload_raw
  };
  return Object.assign({}, message.payload_fields, metadata);
}
```

*Note: if the result of your payload functions contain the fields `deviceId` or `time`, these fields will be overwritten by the metadata. Use a custom `createMessage` function to use custom field names.*
