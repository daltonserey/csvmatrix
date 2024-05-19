SOURCE=./csvmatrix
LINKED=./.linked

help:
	@echo "uso: make [ help | link | upload ]"

link: $(SOURCE)/* $(LINKED)
$(LINKED):
	cd $(SOURCE); sudo npm link; cd ..
	touch $(LINKED)

upload:
	cd $(SOURCE); npm publish; cd ..

test:
	cd tests \
	npm i csvmatrix \
	node test-01.js

clean:
	rm -rf build
	rm -rf node_modules tests/node_modules
	rm -rf tests/package-lock.json
