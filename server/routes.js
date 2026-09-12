'use strict'

function routes(app){
    
    app.use('/api/test', require('./api/test'));
}
module.exports = routes;