var router = require('koa-router')({
    prefix: '/auth'
});

router.get('/', (ctx, next) => {
   ctx.body = 'auth';
});

module.exports = router;
