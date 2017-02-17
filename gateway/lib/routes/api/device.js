const router = require('koa-router')({
    prefix: '/device'
});

const deviceManager = require('../../device-manager');
const User = require('../../schemas/user');

router.get('/list', async (ctx, next) => {

    var devices = deviceManager.getAllResources();

    ctx.body = {};
    ctx.body.devices = JSON.stringify(devices);

});

module.exports = router;
