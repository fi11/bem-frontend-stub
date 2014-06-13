var koa = require('koa');
var debug = require('debug')('info');
var app = koa();
var mountPages = require('koa-mount-dir')('/pages');
var path = require('path');
var send = require('koa-send');
var errorView = require('./views/error');

if (process.env.NODE_ENV == 'development') {
    debug('Server app: debug mod on');

    app.use(function *(next) {
        var files = ['/robots.txt', '/humans.txt', '/favicon.ico', '/jquery-1.11.1.js'];

        if (/^\/static\//.test(this.path) || /^\/media\//.test(this.path) || ~files.indexOf(this.path)) {
            yield send(this, this.path, { root: path.resolve('public') });
        }

        yield next;
    });
}

app.use(errorView);
mountPages(app);

app.on('error', function(err, ctx) {
    var context = { request: ctx.method + ' ' + ctx.url, header: ctx.header };
    console.log('SERVER ERROR: ', err, 'Context:', context);
});

app.listen(8000);

