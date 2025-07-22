Notes during development:

missmatch between `.npmrc` node version wanting node 20.10.0 vs package requirements wanting 20.17 or 16.20 or 18.18

BE api endpoint needed updating in order to correctly return the api
BE api weather endpoint was returning an array of promises, needed to `promise.all` the mapped return fnc

Had a lot of problems running `nx` so due to time I opted just to run them separately

---

# Connex Tech Test

## Getting Started

To get started you will need to install dependencies.
`nvm use`
`npm i`

After which you will want to start the api and webapp in separate terminals (this can be done together, but you get better logging individually).
`make serve-api`
http://localhost:3333/

`make serve-webapp`
http://localhost:4200/

Please note that the hot reloader has some issues when adding a new route in the api.

## Additional helpers

Generate type safe hooks from openapi docs
`make orval`

Linting
`make lint`

# Docs

https://nx.dev/getting-started/intro
https://www.npmjs.com/package/express-openapi
https://orval.dev/overview
https://mui.com/material-ui/getting-started/
https://sequelize.org/docs/v6/
