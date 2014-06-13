var page404 = require('../../pages/404');

module.exports = function *errorView(next){
    try {
        yield next;
        if (!this.body) this.throw(404);
    } catch (err) {
        if (err.status === 404)  {
            if ((this.req.headers['x-requested-with'] || '').toLowerCase() !== 'XMLHttpRequest'.toLowerCase())
                yield page404;
        }
        else {
            this.status = 500;
            this.app.emit('error', err, this);
        }
    }
};
