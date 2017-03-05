const router = require('koa-router')({
    prefix: '/rule'
});

const User = require('../../schemas/user');

router.get('/list', async (ctx, next) => {
    //TODO: reutrn rule list
});

router.post('/add', async (ctx, next) => {
    //TODO: add a IFTTT rule
});

router.post('/delete', async (ctx, next) => {
    //TODO: remove rule
});

module.exports = router;
