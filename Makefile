.SILENT:
.ONESHELL:
.NOTPARALLEL:
.EXPORT_ALL_VARIABLES:
.PHONY:

run:
	cd code
	go run .

dev-install:
	npm install -g vsce

publish:
	# get token here https://dev.azure.com/user/_usersSettings/tokens
	vsce publish -p $(TOKEN)
