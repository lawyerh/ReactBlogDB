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
app.use(bp.urlencoded({ extended: false }));

app.get('/', function(req,res){
    connection.query("select * from posts;", function(err, results){
                if(err){
                    throw err;
                }
                else{
                    res.json(results);
                }
            });
})

app.get('/posts/:id', function(req,res){
    const id = req.params.id;
        connection.query(`select * from posts where(posts.id = ${id})`, function(err, post){
            if(err){
                throw err;
            }
            else{
                res.json(post);
            }
        });
});

app.get('/posts/search/:terms', function(req,res){
    let terms = req.params.terms.split('-');
    let correctedTerms = terms.map(t => t.toLowerCase());
    console.log(terms);
    console.log(correctedTerms);
    terms = '';

    for(let term = 0; term < correctedTerms.length; term++){

        terms += `${correctedTerms[term]}`

        if(term != correctedTerms.length-1)
        {
            terms += ' or categories.category = '
        }
    }
    console.log(term)
    // connection.query(`select categories.category, posts.content, posts.posterName, posts.created_at from posts, categories where(categories.category = '${term[correctedTerms]}')`, function(err, post){
    //     if(err){
    //         throw err
    //     }
    //     else{
    //         terms.push(post)
    //     }
    // });
    console.log(terms)
})

app.post('/posts', function(req, res){
    const content = req.body.content;
    const poster = req.body.posterName;
    const categories = req.body.categories;

    console.log("********", content, poster, categories);
    
    connection.query(`insert into posts(content, created_at, updated_at, posterName) values ( '${content}', now(), now(), '${poster}')`, function(err, newPost){
        if(err){
            throw err;
        }
        else{
            console.log(newPost);
            for(let idx = 0; idx < categories.length; idx++){
                connection.query(`insert into categories(category, post) values ('${categories[idx].toLowerCase()}', ${newPost.insertId})`);
            }

            res.json({id: newPost.insertId})
        }
    })  
})

app.delete('/posts/:id', function(req,res){
    const id = req.params.id;
    console.log(id);
    connection.query(`delete from posts where(id = ${id});`, function(err){
        if(err){
            throw err;
        }
        else{
            res.json({
                success: "Post Successfully deleted"
            });
        }
    });
})

app.listen(4000, function(){
    console.log("Listening on 4000");
})

