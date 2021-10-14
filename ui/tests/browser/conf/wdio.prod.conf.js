'use strict';

const merge        = require( 'deepmerge' );
const wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl    : 'https://fam.dlib.nyu.edu/',
    baseUrlEad : 'https://raw.githubusercontent.com/NYULibraries/findingaids_eads/master/',
    baseUrlFas : 'https://findingaids.library.nyu.edu/',
} );
