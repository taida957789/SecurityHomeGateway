const deviceManager = require('./device-manager.js');


/**

{
    

}

**/

class RulesEngine {

    constructor(rules) {
        this.rules = [];
        for(var i in rules) {
            var rule = rules[i];
            this.rules.push(rule);
        }
    }

    addRule(rule) {
        if( this.checkRule(rule) !== true)
            return false;
        return this.rules.push(rule);
    }

    checkRule(rule) {
        //TODO : add rule data checking
        return true;
    }

    processEvent(events) {
        for(var i in events) {

            var event = events[i];

            


        }
    }
}

const rulesEngine = RulesEngine([]);
module.exports = rulesEngine;
