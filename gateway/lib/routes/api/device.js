const router = require('koa-router')({
    prefix: '/device'
});

const deviceManager = require('../../device-manager');
const User = require('../../schemas/user');

router.get('/', async (ctx, next) => {
   const user = await User.find();
   ctx.body = JSON.stringify(user);
});

module.exports = router;
