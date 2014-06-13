module.exports = function(bh) {
    bh.match('page-home', function(ctx) {
        ctx.content('Ok, it`s work!');
    });
};
