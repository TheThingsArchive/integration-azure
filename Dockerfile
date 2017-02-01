FROM alpine

RUN apk --update add --no-cache ca-certificates nodejs

COPY . /tti/azure/

ENV TTN_MQTT_CERT /tti/azure/mqtt-ca.pem

ENTRYPOINT /tti/azure/wrapper.sh
