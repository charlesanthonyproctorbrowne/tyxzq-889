notes during development:

missmatch between `.npmrc` node version wanting node 20.10.0 vs package requirements wanting 20.17 or 16.20 or 18.18

BE api endpoint needed updating in order to correctly return the api
BE api weather endpoint was returning an array of promises, needed to `promise.all` the mapped return fnc

installed tailwindcss
