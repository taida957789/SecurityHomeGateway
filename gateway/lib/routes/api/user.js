const router = require('koa-router')({
    prefix: '/user'
});

const User = require('../../schemas/user');

// Add user to a group
// POST /api/user/group/add
// Post Params:
//  username: user account
//  group: the name of group where user is added
router.post('/group/add', async (ctx, next) => {
    //TODO: process add user to a group
});

// Remove user from a group
// POST /api/user/group/delete
// Post Params:
//  username: user account
//  group: the name of group where user is removed from
router.post('/group/delete', async (ctx, next) => {
    //TODO: process remove user from the group
});


module.exports = router;
