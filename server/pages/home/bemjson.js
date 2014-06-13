module.exports = function(data) {
    var content = [
        { block: 'header', content: { block: 'input', js: true, mods: { theme: 'simple' }} },
        { block: 'content', content: { block: 'page-home' } },
        { block: 'footer' },
        data.static.js
    ];

    var head = [
        data.static.css,
        { elem: 'js', url: '//yandex.st/jquery/1.10.1/jquery.min.js' },
        { elem: 'js', url: 'http://yandex.st/es5-shims/0.0.1/es5-shims.min.js', ie: 'lt IE 9' }
    ];

    return {
        block: 'page',
        head: head,
        mods: { width: 'fix' },
        'x-ua-compatible' : true,
        ie: false,
        content: content
    };
};
