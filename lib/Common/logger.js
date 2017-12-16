log = require('simple-node-logger').createSimpleLogger(`../log/${new Date().getTime()}.log`);

function logInfo(message) {
    log.info(message);
}

module.exports = {
    log: log,
    logInfo: logInfo
};

