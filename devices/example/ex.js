var device = require('../../iotivity-node')('server'),
    debuglog = console.log,
    buttonResource,
    sensorPin,
    notifyObserversTimeoutId,
    resourceTypeName = 'oic.r.button',
    resourceInterfaceName = '/a/button',
    hasUpdate = false,
    noObservers = false,
    sensorState = false;

// Require the MRAA library
var mraa = '';
try {
    mraa = require('mraa');
}
catch (e) {
    debuglog('No mraa module: ', e.message);
}

// Setup Button pin.
function setupHardware() {
    if (!mraa)
        return;

    sensorPin = new mraa.Gpio(4);
    sensorPin.dir(mraa.DIR_IN);
}

// This function construct the payload and returns when
// the GET request received from the client.
function getProperties() {
    var buttonState = false;

    if (mraa) {
        if (sensorPin.read() == 1)
            buttonState = true;
        else
            buttonState = false;
    } else {
        // Simulate real sensor behavior. This is
        // useful for testing on desktop without mraa.
        buttonState = !sensorState;
    }

    if (sensorState != buttonState) {
        hasUpdate = true;
        sensorState = buttonState;
    }

    // Format the payload.
    var properties = {
        rt: resourceTypeName,
        id: 'button',
        value: sensorState
    };

    return properties;
}

// Set up the notification loop
function notifyObservers() {
    properties = getProperties();

    if (hasUpdate) {
        buttonResource.properties = properties;
        hasUpdate = false;

        debuglog('Send the response: ', sensorState);
        device.notify(buttonResource).catch(
            function(error) {
                debuglog('Failed to notify observers: ', error);
                noObservers = error.noObservers;
                if (noObservers) {
                    if (notifyObserversTimeoutId) {
                        clearTimeout(notifyObserversTimeoutId);
                        notifyObserversTimeoutId = null;
                    }
                }
            });
    }

    // After all our clients are complete, we don't care about any
    // more requests to notify.
    if (!noObservers) {
        notifyObserversTimeoutId = setTimeout(notifyObservers, 1000);
    }
}

// Event handlers for the registered resource.
function observeHandler(request) {
    buttonResource.properties = getProperties();
    request.sendResponse(buttonResource).catch(handleError);

    noObservers = false;
    hasUpdate = true;

    if (!notifyObserversTimeoutId)
        setTimeout(notifyObservers, 200);
}

function retrieveHandler(request) {
    buttonResource.properties = getProperties();
    request.sendResponse(buttonResource).catch(handleError);
}

device.device = Object.assign(device.device, {
    name: 'Smart Home Button Sensor',
    coreSpecVersion: 'core.1.0.0',
    dataModels: ['res.1.1.0']
});



function handleError(error) {
    debuglog('Failed to send response with error: ', error);
}

device.platform = Object.assign(device.platform, {
    manufacturerName: 'Intel',
    manufactureDate: new Date('Fri Oct 30 10:04:17 (EET) 2015'),
    platformVersion: '1.1.0',
    firmwareVersion: '0.0.1'
});

// Enable presence
device.enablePresence().then(
    function() {
        // Setup Button pin.
        setupHardware();

        debuglog('Create button resource.');

        // Register Button resource
        device.register({
            id: { path: resourceInterfaceName },
            resourceTypes: [ resourceTypeName ],
            interfaces: [ 'oic.if.baseline' ],
            discoverable: true,
            observable: true,
            properties: getProperties()
        }).then(
            function(resource) {
                debuglog('register() resource successful');
                buttonResource = resource;

                // Add event handlers for each supported request type
                device.addEventListener('observerequest', observeHandler);
                device.addEventListener('retrieverequest', retrieveHandler);
            },
            function(error) {
                debuglog('register() resource failed with: ', error);
            });
    },
    function(error) {
        debuglog('device.enablePresence() failed with: ', error);
    });

// Cleanup on SIGINT
process.on('SIGINT', function() {
    debuglog('Delete Button Resource.');

    // Remove event listeners
    device.removeEventListener('observerequest', observeHandler);
    device.removeEventListener('retrieverequest', retrieveHandler);

    // Unregister resource.
    device.unregister(buttonResource).then(
        function() {
            debuglog('unregister() resource successful');
        },
        function(error) {
            debuglog('unregister() resource failed with: ', error);
        });

    // Disable presence
    device.disablePresence().then(
        function() {
            debuglog('device.disablePresence() successful');
        },
        function(error) {
            debuglog('device.disablePresence() failed with: ', error);
        });

    // Exit
    process.exit(0);
});
