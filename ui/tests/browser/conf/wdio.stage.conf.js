'use strict';

const merge        = require( 'deepmerge' );
const wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl    : 'https://fam-stage.dlib.nyu.edu/',
    baseUrlEad : 'https://raw.githubusercontent.com/NYULibraries/[STAGE REPO]/master/',
    baseUrlFas : 'https://findingaids-stage.library.nyu.edu/',
} );
