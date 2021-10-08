'use strict';

const merge        = require( 'deepmerge' );
const wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl    : 'http://localhost:8080/',
    baseUrlEad : 'https://raw.githubusercontent.com/NYULibraries/findingaids_eads/master/',
    baseUrlFas : 'https://findingaids-local.library.nyu.edu/',
} );
