const express = require('express')
const app = express()
var mysql = require('mysql')
var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser')
var randtoken = require('rand-token')
var moment = require('moment')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/coucou', (req, res) => res.send('Hibou'))

app.use('/admin/', function(req, res, next){
    console.log('je suis la')
    if (req.query.token)
    {
        connection.query('SELECT * FROM USER WHERE token = ?', [req.query.token], function(err, rows){
            if (rows.length > 0)
                {   
                    console.log(rows)
                    if(moment(rows[0].expirationDate).diff(moment())<=0) {
                        error:true
                        message:'Token Mismatch, please reconnect yourself'
                    }
                    else
                    {
                        expirationDate = moment().add(1, 'm').valueOf()
                        console.log(rows[0].expirationDate)
                        connection.query('UPDATE USER SET expirationDate = ? WHERE id= ? ', [expirationDate, rows[0].id], function(err, result){
                            next();
                        })
                    }
                }
            else{
                res.send('Token Mismatch, please reconnect yourself')
            }
        })
    }
    else{
        res.send('No Token found, get out');
    }
})

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '0000',
  database : 'my_db'
});
connection.connect(function(err){
    if (err) throw err
    console.log('Database connected')
})
app.get('/admin/api/users',function (req, res)
{
    connection.query('SELECT name FROM USER', function (err, rows)
    {
        if (err) throw err
        res.json(rows);
    })   
});

app.post('/api/users/connect', function(req, res)
{
    if(req.body.name && req.body.password){
        var name = req.body.name
        var password = req.body.password
        console.log(name, password)
        connection.query('SELECT  * FROM USER WHERE name = ? AND password = ?', [name, password], function(err, rows, fields)
        {
            
            if (err)
            {
                throw err;
                res.send("failed");
            }
            if (rows.length > 0)
            { 
                var currentToken = rows[0].token
                console.log(rows)
                if ((rows[0].token != 'NULL' && rows[0].token !="" && rows[0].token != undefined) || moment(rows[0].expirationDate).diff(moment()) > 0)
                {
                    connection.query('UPDATE USER SET expirationDate = ? WHERE id = ?',[moment().add(10, 'm').valueOf(), rows[0].id])
                    console.log(rows[0].token)
                    res.send({
                        currentToken: rows[0].token
                    });
                }
                else
                {
                    var token = randtoken.generate(25);
                    console.log(token)
                    connection.query('UPDATE USER SET token = ?, expirationDate = ? WHERE name = ? AND password = ? ', [token, moment().add(1, 'm').valueOf(), name, password])
                    res.send({    
                        currentToken: token
                    })
                    console.log(token)
                }
                console.log("Vous etes connectés " + name);
            }
            else
            {
                console.log("C est pas toi")
            }
        })
    }
})
app.get('/admin/api/users/todo', function(req, res){
    console.log("que dois-je faire?")
    connection.query('SELECT task FROM `todo` INNER JOIN `USER` ON `USER`.id = `todo`.user_id WHERE token = ?',[req.query.token], function(err, rows){
        if(err) throw err
        if (rows.length > 0)
            {
                console.log(rows);
                res.send(rows)
            }
        else{
            console.log("nothing to do");
        }
    })
})
app.post('/admin/api/users/new', function (req, res){
    console.log(req.body)
    if(req.body.name && req.body.password){
            var name = req.body.name;
            var password = req.body.password;
            connection.query('INSERT INTO USER VALUES(NULL, ?, ?, "", "")', [name, password], function(err, rows, fields)
            {
                if (err)
                {
                    throw err;
                    res.send("failed");
                }
                else
                { 
                    res.send("success")
                    console.log("Vous etes " + name);
                }
            })
        }
    else console.log(req.body.name)
        })
app.get('/admin/testToken', function(req, res){
    connection.query('SELECT * FROM USER WHERE token=?',[req.query.token], function(err ,result){
        if (result.length > 0)
            {
                if (moment(result[0].expirationDate).diff(moment()) <=0)
                    {
                        res.send('Token Mismatch, please reconnect yourself')
                    }
                else{
                    connection.query('UPDATE USER SET expirationDate = ? WHERE id = ?',[moment().add(1, 'm').valueOf(), result[0].id])
                    res.send('Connected');
                }
            }
        else{
            res.send('Token Mismatch, please reconnect yourself')
        }
    })
})
app.listen(4000, () => console.log('Example app listening on port 3000!'))
        