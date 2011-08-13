var events = require("events");

exports.extendEmitter = function() {
    var emitter = new events.EventEmitter();
    var wrapper = {
        on: function(e,c){ emitter.on(e,c); return wrapper; },
        once: function(e,c){ emitter.once(e,c); return wrapper; },
        emit: function(){ emitter.emit.apply(emitter, Array.prototype.slice.call(arguments)); return wrapper; }
    };
    return wrapper;
};
