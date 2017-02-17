const router = require('koa-router')({
    prefix: '/api'
});

const auth = require('./auth');
const device = require('./device');
const User = require('../../schemas/user');

const authMidd = async(ctx, next) => {
    try {

        if( ctx.url !== '/api/auth/login' ) {
            let token = ctx.request.headers['service-token'];
            if(!token)
                ctx.throw('token missing', 401);
        
            let user = await User.findOne({ token : token });
            if(!user || (new Date() > user.token_expired))
                ctx.throw('invalid token', 401);
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
    .use(device.routes());

module.exports = router;
