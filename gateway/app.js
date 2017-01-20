const koa = require('koa');
const mongoose = require('koa-mongoose');
const router = require('koa-router')();
const koaStatic = require('koa-static');


const dbOption = require('./lib/db');
const apiRoute = require('./lib/routes/api');

const app = new koa();

let deviceManager = require('./lib/device-manager');

router.use(apiRoute.routes());

app
    .use(koaStatic(__dirname + '/static'))
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(3000, () => {
      console.log('listening on port 3000');
});
