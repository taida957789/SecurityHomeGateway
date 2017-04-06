class DeviceManager {
    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.device = require('iotivity-node')('client');
        this.notifyObserversTimeoutId = undefined;
        this.resourcesList = {};
        this.newResourcesList = {};
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

    getResource(deviceId) {
        return this.resourcesList[deviceId];
    }

    findResources(prefifx='') {
        this.checkResourceList = [];
        this.device.findResources().then(
            function() {
                console.log('Client: findResource() successfully');
           },
            function(error) {
                console.log('Client: findResources() failed with ' + error + ' and result ' + error.result);
            }
        );



        setTimeout(() => {this.findResources();}, 5000);
    }

    discoverResource(event) {

        var resourceId = event.resource.id.deviceId + ":" + event.resource.id.path;
        var resource = this.resourcesList[resourceId];

        if(!resource) {
            console.log('Resource found:' + JSON.stringify(event.resource, null, 4));
            this.resourcesList[event.resource.id.deviceId + ":" + event.resource.id.path] = event.resource;
            event.resource.addEventListener("change", this.bindObserveResource);
            event.resource.addEventListener("delete", this.bindDeleteResource);
        }

        //if(this.checkResourceList.indexOf(resourceId) < 0)
        //    this.checkResourceList.push(resourceId);
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
