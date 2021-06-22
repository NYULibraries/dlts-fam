'use strict';

const merge        = require( 'deepmerge' );
const wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl : 'https://fam-local.dlib.nyu.edu/',
} );
