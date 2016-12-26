SHELL = bash

.PHONY: all deps docker

all: deps docker

deps:
	npm install

docker:
	docker build -t thethingsindustries/azure-integration-process .
