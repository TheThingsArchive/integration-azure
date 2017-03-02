FROM alpine

RUN apk --update add --no-cache ca-certificates nodejs

COPY . /tti/azure/

ENTRYPOINT /tti/azure/docker-entrypoint.sh
