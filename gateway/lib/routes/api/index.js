var router = require('koa-router')({
    prefix: '/api'
});

var auth = require('./auth');
var device = require('./device');

router
    .use(auth.routes())
    .use(device.routes());

module.exports = router;
