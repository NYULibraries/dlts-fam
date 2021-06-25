'use strict';

const merge        = require( 'deepmerge' );
const wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl : 'http://localhost:8080/',
} );
