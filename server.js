const express = require('express');

const bp = require('body-parser');

const mysql = require('mysql');
const mySQLConnect = require('./connection');

const connection = mysql.createConnection({
    host: mySQLConnect.host,
    user: mySQLConnect.user,
    password: mySQLConnect.password,
    port: mySQLConnect.port,
    database: mySQLConnect.database
});

const app = express();

app.use(bp.json());

app.get('/', function(req,res){

    connection.connect(function(err){
        if(err){
            throw err;
        }
        connection.query("select * from posts;", function(err, results){
            if(err){
                throw err;
            }
            else{
                res.json(results);
            }
        });
    })
})

app.listen(4000, function(){
    console.log("Listening on 4000");
})

