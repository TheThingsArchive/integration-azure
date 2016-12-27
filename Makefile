SHELL = bash

.PHONY: all deps docker

all: docker

deps:
	npm install

docker: deps
	docker build -t thethingsindustries/azure-integration-process .
