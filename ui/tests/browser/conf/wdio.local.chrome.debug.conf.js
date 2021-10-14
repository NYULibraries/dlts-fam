'use strict';

const wdioLocalConf = require( './wdio.local.conf.js' );

wdioLocalConf.config.capabilities = [
    {
        maxInstances : 1,
        //
        browserName  : 'chrome',
    },
];

wdioLocalConf.config.mochaOpts.retries = 0;
wdioLocalConf.config.mochaOpts.timeout = 99999;

exports.config = wdioLocalConf.config;
