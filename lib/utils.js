function buildCompatibleInputCallback(cb, node) {
    return function (msg, send, done) {
        send = send || function() { node.send.apply(node, arguments) };
        done = done || function (err) { if (err) node.error(err, String(err)) };
        return cb.call(this, msg, send, done);
    }
}

module.exports = {
    buildCompatibleInputCallback
}
