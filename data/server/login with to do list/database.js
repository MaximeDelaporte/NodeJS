var mysql = require('mysql');
module.exports = function handle_db(req, res){
var pool = mysql.createPool({
connectionLimit: 100,
host:'localhost',
user: 'root',
password: '0000',
database: 'my_db'
});
pool.getConnection(function (err, connection){
if (err){
console.error("Ca a merde ici" + err);
connection.release();
res.json({"code": 100, "status" : "Erreur de connection DB"});
return;
}
console.log("depuis config DB : connecte en tant que : " + connection.threadID);
connection.on('error', function(err){
res.json({"code": 100, "status" : "Erreur de connection DB"});
return;
});
return connection;
});
return pool;
}