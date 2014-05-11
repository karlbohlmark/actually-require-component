FILES = *.js

PATH := $(PWD)/node_modules/.bin:$(PATH)

test:
	tap *.js

.PHONY: test
