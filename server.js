const express = require('express');

const bp = require('body-parser');

const mysql = require('mysql');
const mySQLConnect = require('./connection');

const connection = mysql.createConnection({mySQLConnect});

const app = express();

app.use(bp.json());

app.get('/', function(req,res){
    const response = {
        hello: "Welcome to the database api!"
    }
    res.json(response)
})

app.listen(4000, function(){
    console.log("Listening on 4000");
})

