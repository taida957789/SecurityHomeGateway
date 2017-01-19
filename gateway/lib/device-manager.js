class DeviceManager {
    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.device = require('iotivity-node')('client');
        this.notifyObserversTimeoutId = undefined;
        this.resourcesList = {};
        this.bindDiscoverResource = evt => this.discoverResource(evt);
        this.bindObserveResource = evt => this.observeResource(evt);
        this.bindDeleteResource = evt => this.deleteResource(evt);
        this.device.addEventListener('resourcefound', this.bindDiscoverResource);
        this.findResources();
        this.bindShutdownHook = () => this.shutdownHook();
        process.on('SIGINT', this.bindShutdownHook);
    }

    getAllResources() {
        return this.resourcesList;
    }

    findResources() {
        this.device.findResources().then(
            function() {
                console.log('Client: findResource() successfully');
            },
            function(error) {
                console.log('Client: findResources() failed with ' + error + ' and result ' + error.result);
            });
        setTimeout(() => {this.findResources();}, 5000);
    }

    discoverResource(event) {
        var resourceId = this.resourcesList[event.resource.id.deviceId + ":" + event.resource.id.path];

        if(!resourceId) {
            console.log('Resource found:' + JSON.stringify(event.resource, null, 4));
            this.resourcesList[event.resource.id.deviceId + ":" + event.resource.id.path] = event.resource;
            event.resource.addEventListener("change", this.bindObserveResource);
            event.resource.addEventListener("delete", this.bindDeleteResource);
        }
    }

    observeResource(event) {
        console.log('Resource changed :' + JSON.stringify(event.resource.properties, null, 4));
    }

    deleteResource(event) {
        console.log('Resource deleted :' + JSON.stringify(event));
    }

    shutdownHook() {
        console.log('SIGINT: Quitting...');

        this.device.removeEventListener('resourcefound', this.bindDiscoverResource);

        if(this.notifyObserversTimeoutId) {
            clearTimeout(this.notifyObserversTimeoutId);
            this.notifyObserversTimeoutId = null;
        }

        for(var index in this.resourceList) {
            var resource = this.resourceList[index];
            if(resource) {
                resource.removeEventListener('change', this.bindObserveResource);
                resource.removeEventListener('delete', this.bindDeleteResource);
            }
        }
        process.exit(0);
    }
}

let deviceInstance = new DeviceManager({});

module.exports = deviceInstance;
