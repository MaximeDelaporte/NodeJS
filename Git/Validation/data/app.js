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

app.use('/admin/', function(req, res, next){
    if (req.query.token)
    {
        connection.query('SELECT * FROM users WHERE token = ?', [req.query.token], function(err, rows){
            if (rows.length > 0)
                {   
                    console.log(rows)
                    if(moment(rows[0].expirationDate).diff(moment())<=0) {
                       
                        res.send('Token Mismatch, please reconnect yourself')
                    }
                    else
                    {
                        var expirationDate = moment().add(1, 'm').valueOf()
                        console.log(rows[0].expirationDate)
                        connection.query('UPDATE users SET expirationDate = ? WHERE id= ? ', [expirationDate, rows[0].id], function(err, result){
                            console.log(result)
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
  database : 'books'
});
connection.connect(function(err){
    if (err) throw err
    console.log('Database connected')
})
app.get('/admin/api/users',function (req, res)
{
    connection.query('SELECT name FROM users', function (err, rows)
    {
        if (err) throw err
        res.json(rows);
    })   
});

app.post('/users/connect', function(req, res)
{
    if(req.body.name && req.body.password){
        var name = req.body.name
        var password = req.body.password
        console.log(name, password)
        connection.query('SELECT  * FROM users WHERE username = ? AND password = ?', [name, password], function(err, rows, fields)
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
                if ((moment(rows[0].expirationDate).diff(moment() > 0) && rows[0].expirationDate != 'NULL' )  || (rows[0].token != 'NULL' && rows[0].token !="" && rows[0].token != undefined))
                {
                    connection.query('UPDATE users SET expirationDate = ? WHERE id = ?',[moment().add(10, 'm').valueOf(), rows[0].id])
                    console.log(rows[0].token)
                    res.send({
                        currentToken: rows[0].token
                    });
                }
                else
                {
                    var token = randtoken.generate(25);

                    connection.query('UPDATE users SET token = ?, expirationDate = ? WHERE username = ? AND password = ? ', [token, moment().add(10, 'm').valueOf(), name, password])
                    res.send({    
                        currentToken: token
                    })
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
app.post('/admin/newbook', function(req, res){
    var title = req.body.title
    var author = req.body.author
    var editor = req.body.editor
    connection.query('SELECT * FROM books WHERE title = ? AND author = ? AND editor = ?', [title, author, editor], function(err, result){
        if(err) {
            throw err
            }
        if (result.length > 0)
        {
            res.send("failed")
        }
        else{
            connection.query('INSERT INTO books VALUES(NULL, ?, ?, ?,"")', [title, author, editor], function(err, rows){
                if (err) {
                    throw err
                }
                else{
                    res.send("success");
                    console.log("Book added")
                }
            })
        }
    })
}) 
app.get('/admin/books/all', function(req, res){
    connection.query('SELECT * FROM books', function(err, rows){
        if(err) throw err
        if (rows.length > 0)
            {
                res.send(rows)
            }
        else{
            err:true
            message:'No book'
        }
    })
})
app.post('/admin/books/delete', function(req, res){
    console.log("id to delete : " +req.body.id)
    if(req.body.id != 'NULL' && req.body.id !="undefined"){
		var id = Number(req.body.id)
		console.log(id)
		connection.query('DELETE FROM books WHERE id = ? ', [id], function(err, result){
			if(err) {
				throw err
				res.send("error")
			}
			else {
				res.send("success")
			}
		})
	}
})
app.post('/users/new', function (req, res){
    console.log(req.body)
    if(req.body.name && req.body.password){
            var name = req.body.name;
            var password = req.body.password;
            connection.query('INSERT INTO users VALUES(NULL, ?, ?, "", NULL)', [name, password], function(err, rows, fields)
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
app.listen(4000, () => console.log('Example app listening on port 4000!'))
        