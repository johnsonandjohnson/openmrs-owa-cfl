/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const paths = require('../config/paths');
const webpack = require('webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const config = require('../config/webpack.config');
const path = require('path');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin');

const conf = config('development');

for (const rule of conf.module.rules) {
    if (!rule.oneOf) continue

    for (const one of rule.oneOf) {
        if (
            one.loader &&
            one.loader.includes('babel-loader') &&
            one.options &&
            one.options.plugins
        ) {
            one.options.plugins = one
                .options
                .plugins
                .filter(plugin =>
                    typeof plugin !== 'string' ||
                    !plugin.includes('react-refresh')
                )
        }
    }
}

conf.plugins = conf
    .plugins
    .filter(plugin =>
        !(plugin instanceof webpack.HotModuleReplacementPlugin) &&
        !(plugin instanceof ReactRefreshPlugin)
    )

conf.plugins.push(new WatchExternalFilesPlugin.default({
    files: [
        './public/overrides.css',
        './public/overrides.js'
    ]
}));

const OUTPUT_PATH = path.join(require('os').homedir(), '.cfl-dev/owa/cfl');
conf.output.path = OUTPUT_PATH;

conf.output.publicPath = process.env.PUBLIC_URL;

webpack(conf).watch({
}, (err, stats) => {
    if (err) {
        console.error(err);
    } else {
        copyPublicFolder(OUTPUT_PATH);
    }
    console.error(stats.toString({
        chunks: false,
        colors: true
    }));
});

function copyPublicFolder(path = paths.appBuild) {
    fs.copySync(paths.appPublic, path, {
        dereference: true,
        filter: file => file !== paths.appHtml
    });
}
