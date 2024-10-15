# Makefile for GraphAI demo
#
.PHONY: init
init:
	yarn global add firebase-tools
	yarn install
	cd functions && yarn install
	@echo in firebase console, add project , choose web, copy config to src/config/project.ts
	open https://firebase.google.com
