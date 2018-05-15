import express from 'express';

import bp from 'body-parser';

import mysql from 'mysql';

const connection = mysql.createConnection({
    
})

const app = express();

app.use(bp.json());

app.get('/', function(req,res){
    
})

app.listen(4000, function(){
    console.log("Listening on 4000");
})

