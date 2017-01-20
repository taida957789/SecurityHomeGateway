var router = require('koa-router')({
    prefix: '/auth'
});

router.post('/login', (ctx, next) => {
   ctx.body = 'auth';
});

router.post('/logout', (ctx, next) => {

});

module.exports = router;
