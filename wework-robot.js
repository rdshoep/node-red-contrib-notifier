module.exports = function (RED) {
    'use strict';

    function WeworkRobotNode(config) {
        RED.nodes.createNode(this, config);

        const robotKey = this.credentials.key;
        const target = config.target || 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send';
        this.target = `${target}?key=${robotKey}`;
        this.property = config.property || 'notify';
        const Axios = require('axios');
        const request = Axios.create();

        const {buildCompatibleInputCallback} = require('./lib/utils');

        let node = this;
        this.on('input', buildCompatibleInputCallback(function (msg, send, done) {
            let notify = RED.util.getMessageProperty(msg, node.property);
            if (!notify) {
                const errorMessage = `msg[${node.property}] is empty!`;
                node.status({fill: "red", shape: "dot", text: errorMessage})
                done(errorMessage)
            } else {
                node.status({fill: "yellow", shape: "dot", text: 'sending to wework'});
                request.post(node.target, notify).then(() => {
                    send(msg);
                    done()
                    node.status({fill: "green", shape: "dot", text: 'notify complete'})
                }, err => {
                    done(err);
                    node.status({fill: "red", shape: "dot", text: `notify error: ${err}`})
                });
            }
        }, this));
    }

    RED.nodes.registerType('wework-robot', WeworkRobotNode, {
        credentials: {
            key: {type: "text"},
        }
    });
}
