const router = require('koa-router')({
    prefix: '/device'
});

const deviceManager = require('../../device-manager');
const User = require('../../schemas/user');


// Get Device List
// GET /api/device/list
//
router.get('/list', async (ctx, next) => {

    var devices = deviceManager.getAllResources();

    //TODO: access control

    ctx.body = {
        response: 0,
        data: {
            devices: devices
        }
    }

});

// Get specific device
// GET /api/device/<deviceId>
//
router.get('/get/:deviceId', async (ctx, next) => {

    var deviceId = ctx.params.deviceId;

    var device = deviceManager.getDevice(deviceId)

    // TODO: access control

    if(device) {

        ctx.body = {
            response: 0,
            data: {
                device: devices
            }
        }
    } else {
        ctx.body = {
            response: 404,
            message: 'Device not found'
        };
    }
});

// Get device permission
// GET /api/device/permission/get/<deviceId>
//
router.post('/permission/get/:deviceId', async (ctx, next) => {
    //TODO: process get device permission
});

// Change device permission
// POST /api/device/permission/change
// Post Params:
//  deviceId: the device id
//  permission: permission value (Unix file system mod)
//              read: 4 write: 2 modify: 1
//              <Owner Permission><Group Permission><Others Permission>
//
router.post('/permission/chnage', async (ctx, next) => {
    //TODO: process permission change
});



module.exports = router;
