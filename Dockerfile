FROM alpine

RUN apk add --update nodejs

COPY ./bridge.js ./index.js ./wrapper.sh /usr/azure-integration/

COPY ./node_modules /usr/azure-integration/node_modules

RUN chmod +x usr/azure-integration/wrapper.sh

ENTRYPOINT usr/azure-integration/wrapper.sh
