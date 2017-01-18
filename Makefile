SHELL = bash

.PHONY: all deps docker

deps:
	npm install

docker: deps
	docker build -t thethingsnetwork/azure-integration-process .
