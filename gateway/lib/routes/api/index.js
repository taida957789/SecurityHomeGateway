const router = require('koa-router')({
    prefix: '/api'
});

const auth = require('./auth');
const device = require('./device');
const rule = require('./rule');

const User = require('../../schemas/user');


// This function provides token based authentication middleware
// for the url with /api/.... expect for /api/auth/login
// if token is correct , let ctx.user as user object
const authMidd = async(ctx, next) => {
    try {

        if( ctx.url !== '/api/auth/login' ) {
            let token = ctx.request.headers['service-token'].toString();
            if(!token)
                ctx.throw('token missing', 401);


            let user = token === '' ? null : await User.findOne({ token : token });
            if(!user || (new Date() > user.token_expired))
                ctx.throw('invalid token', 401);

            // let ctx.user as user instance
            ctx.user = user;
        }

        await next();

    } catch (err) {
        ctx.body = { status: err.status, message: err.message };
        ctx.status = err.status || 500;
    }
};
router
    .use(authMidd)
    .use(auth.routes())
    .use(device.routes())
    .use(rule.routes());

module.exports = router;
