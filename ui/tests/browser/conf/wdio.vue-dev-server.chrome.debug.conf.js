'use strict';

const wdioVueDevServerConf = require( './wdio.vue-dev-server.conf' );

wdioVueDevServerConf.config.capabilities = [
    {
        maxInstances : 1,
        //
        browserName  : 'chrome',
    },
];

wdioVueDevServerConf.config.mochaOpts.timeout = 99999;

exports.config = wdioVueDevServerConf.config;
