var device = require('../../iotivity-node')('server');

var simulationMode = false;

var resourceInterfaceName = '/a/button',
    resourceTypeName = 'oic.r.button',
    hasUpdate = false,
    sensorState = false,
    buttonResource = null;


var args = process.argv.slice(2);
args.forEach(function(entry) {
    if(entry === '--simulation' || entry === '-s')
        simulationMode = true;
        console.log('[Debug] Running in simulation mode.')
});


var mraa = '';

if(!simulationMode) {
    try {
        mraa = require('mraa');
    } catch(e) {
        console.log('[Error] No mraa package found', e.message)
    }
}



function setupPins() {
    // TODO: Setup hardware
}


function getProperties() {
    return {
        rt: resourceTypeName,
        id: 'button',
        value: sensorState
    }
}

function errorHandler(error) {
    console.log('[Error] ', error.message);
}

function retrieveHandler(request) {
    buttonResource.properties = getProperties();
    request.respond(buttonResource).catch(errorHandler);

    if('observe' in request) {
        hasUpdate = true;
        console.log('[Debug] observed!');
    }
}

device.device = Object.assign(device.device, {
    name: 'Smart Home Button',
    coreSpecVersion: 'core.1.1.0',
    dataModels: ['res.1.1.0']
})


device.platform = Object.assign(device.platform, {
    manufacturerName: 'RB507',
    manufactureDate: new Date('Fri Oct 30 10:04:17 (EET) 2015'),
    platformVersion: '1.0.0',
    firmwareVersion: '1.0.0'
});

if( device.device.uuid) {
    setupPins();

    console.log('[Info] Create Resource...');

    device.register({
        resourcePath: resourceInterfaceName,
        resourceTypes: [resourceTypeName],
        interfaces: ['oic.if.baseline'],
        discoverable: true,
        observable: true,
        properties: getProperties()
    }).then(
        function(resource) {
            console.log('[Info] Register resource successfully.');
            buttonResource = resource;
            resource.onretrive(retrieveHandler);
        },
        function(error) {
            console.log('[Error] register() resource failed with: ', error);
        }
    );
}











