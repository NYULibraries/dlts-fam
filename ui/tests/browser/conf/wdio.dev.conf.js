'use strict';

const merge        = require( 'deepmerge' );
const wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl    : 'https://fam-dev.dlib.nyu.edu/',
    baseUrlEad : 'https://raw.githubusercontent.com/NYULibraries/[DEV REPO]/master/',
    baseUrlFas : 'https://findingaids-dev.library.nyu.edu/',
} );
