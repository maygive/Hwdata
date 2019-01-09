var mongojs = require('mongojs');

var databaseUrl = 'mongodb://localhost/hwData';
var collections = ['Temperature'];
var option = {"auth":{"user":"admin","password":"tgr2019"}}
var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};
