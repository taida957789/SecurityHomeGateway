var router = require('koa-router')({
    prefix: '/device'
});

var deviceManager = require('../../device-manager');

router.get('/', (ctx, next) => {
   ctx.body = deviceManager.getAllResources();
});

module.exports = router;
