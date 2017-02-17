const router = require('koa-router')({
    prefix: '/auth'
});
const crypto = require('crypto');
const randomString = require('random-string');

const User = require('../../schemas/user');

router.post('/login', async (ctx, next) => {

    let hash = crypto.createHash('sha1');

    let input = ctx.request.body;

    let username = input.username;
    let password = input.password;

    hash.update(password);
    password = hash.digest('hex');

    let user = await User.findOne({
        username : username,
        password : password
    });

    result = {};

    if( user !== null ) {

        result.response = 1;

        // gaenerate new token
        hash = crypto.createHash('sha1');
        hash.update(user.username);

        var token_prefix = hash.digest('hex');
        var new_token = token_prefix + randomString({
            length : 20
        });

        while( await User.findOne({ token: new_token }) !== null ) {
            new_token = token_prefix + randomString({
                length : 20
            });
        }

        // set new token expiration ( 30 minutes )       
        let currentDate = new Date();
        let token_expired = new Date(currentDate.getTime() + (30 * 60 * 1000));

        user.token_expired = token_expired;
        user.token = new_token;
        user.save();

        result.token = user.token;

    } else {

        // didnt find any user
        result.response = 0;
        result.message = 'Error username or password.';
    
    }

    ctx.body = result;

});

router.post('/logout', async (ctx, next) => {

});

module.exports = router;
