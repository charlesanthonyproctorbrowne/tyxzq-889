all: serve

build-api: 
	npx nx build api

docs: 
	make build-api && npx ts-node --project tools/tsconfig.json ./tools/schema.ts

lint:
	npx nx format:write -v

orval:
	make docs && npx orval --config ./tools/orval.config.ts

serve-api:
	npx nx serve api

serve-webapp:
	npx nx serve webapp

serve:
	npx nx run-many -t serve