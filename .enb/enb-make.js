var techLevels = require('enb/techs/levels');
var techDepsModules = require('enb-modules/techs/deps-with-modules');

var techFileProvider =  require('enb/techs/file-provider');
var techFiles = require('enb/techs/files');

var techCssStyl = require('../libs/bem-stylus-lib/techs/css-stylus');
var techBorschik = require('enb/techs/borschik');

var techJs = require('enb/techs/js');
var techYM = require('enb-modules/techs/prepend-modules');

var techBhServer = require('enb-bh/techs/bh-server');
var techBhClient = require('enb-bh/techs/bh-client-module');

var hasClientBh = false;

module.exports = function(config) {
    config.setLanguages(['ru']);

    config.node('bundles/pages', function(nodeConfig) {

        // common techs
        nodeConfig.addTechs([
            [techLevels, { levels: getLevels(config) }]
            , [techFileProvider, { target: '?.bemdecl.js' }]
            , techDepsModules
            , techFiles
            , [techJs, { target: '_?.js', sourceSuffixes: ['js', 'vanilla.js'] }]
            , [techYM, { target: hasClientBh ? '?.ym.js' : '?.js', source: '_?.js' }]
            , [techCssStyl, { target: '?.css' }]
            , [techBhServer, { target: '?.server.bh.js', jsAttrName: 'data-bem', jsAttrScheme: 'json' }]
        ]);

        // bh for client
        hasClientBh && nodeConfig.addTechs([
            [ require('enb/techs/bemdecl-from-deps-by-tech'), { target: '?.bh.bemdecl.js', sourceTech: 'js', destTech: 'bh' } ]
            , [ require('enb/techs/deps-old'), { bemdeclTarget: '?.bh.bemdecl.js', depsTarget: '?.bh.deps.js' } ]
            , [ require('enb/techs/files'), { filesTarget: '?.bh.files', dirsTarget: '?.bh.dirs', depsTarget: '?.bh.deps.js' } ]
            , [techBhClient, { filesTarget: '?.bh.files', target: '?.client.bh.js', devMode: false, jsAttrName: 'data-bem', jsAttrScheme: 'json' }]
            , [ require('enb/techs/file-merge'), { sources: ['?.ym.js', '?.client.bh.js'], target: '?.js' } ]
        ]);


        // add build targets
        nodeConfig.addTargets([
            '?.js'
            , '?.css'
            , '?.server.bh.js'
            , '?.min.js'
            , '?.min.css'
        ]);

        hasClientBh && nodeConfig.addTargets(['?.client.bh.js'])
    });

    config.mode("development", function() {
        config.node('bundles/pages', function(nodeConfig) {
            nodeConfig.addTechs([
                [techBorschik, { sourceTarget: '?.js', destTarget: '?.min.js', minify: false, freeze: true } ]
                , [techBorschik, { sourceTarget: '?.css', destTarget: '?.min.css', minify: false, freeze: true } ]
            ]);
        });
    });

    config.mode("production", function() {
        config.node('bundles/pages', function(nodeConfig) {
            nodeConfig.addTechs([
                [techBorschik, { sourceTarget: '?.js', destTarget: '?.min.js', minify: true, freeze: true } ]
                , [techBorschik, { sourceTarget: '?.css', destTarget: '?.min.css', minify: true, freeze: true } ]
            ]);
        });
    });

};

function getLevels(config) {
    var levels = [
        // libs
        { path: 'libs/bem-stylus-lib', check: true },
        { path: 'libs/bem-core/common.blocks', check: true },
        { path: 'libs/bem-core/desktop.blocks', check: true },
        { path: 'libs/bem-interface-lib/blocks', check: true },

        // project
        'blocks'
    ];

    return levels.map(function(levelPath) { return config.resolvePath(levelPath) });
}
