# My Application

The project is generated by [LoopBack](http://loopback.io).

sure having trouble getting this to run on Heroku.

## broken
npm install --save bcrypt

## To run server:
`node .`

## To run gulp:
mongod must be running to build loopback's angular service
`mongod`
then
`gulp`

## To run integration tests:
`NODE_ENV=integration gulp karma:integration`

or if you want the mongod and webapi to stay running after the test:
`NODE_ENV=integration INTEGRATION_PAUSE=y gulp karma:integration`
and then point your browser to:
localhost:3123/explorer



## One time setup stuff

### To install mongodb:
  Install brew  http://brew.sh/
  Do this as a user with admin rights.  As root fails and is hard to
  cleanup because of permissions problems.

`brew install mongodb`

### To setup the mongodb (after its installed):
`mongo`
```
> use firepol
> db.createUser( { user: "firepol", pwd: "firepol", roles: [ "readWrite", "dbAdmin"] })
```

## Zero time setup stuff
(it's already done and persisted in git, so you don't have to.)
`slc loopback` start project
`slc loopback:datasource` create a datasource
`slc loopback:model` create a model
`slc loopback:relation` create a relation

## Notes
https://docs.strongloop.com/display/public/LB/Realtime+server-sent+events
