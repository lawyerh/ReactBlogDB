const express = require('express');

const bp = require('body-parser');

const mysql = require('mysql'); // Get MySQL and a config file containing credentials
const mySQLConnect = require('./connection');

const connection = mysql.createConnection({ // Define connection
    host: mySQLConnect.host,
    user: mySQLConnect.user,
    password: mySQLConnect.password,
    port: mySQLConnect.port,
    database: mySQLConnect.database
});

const app = express();

app.use(bp.json()); // Configure body-parser
app.use(bp.urlencoded({ extended: false }));

app.use(function(req, res, next){ // Allow data requests from this API from anywhere
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

})

app.get('/', function(req, res){
    res.json({
        success: "Welcome to this API!",
        info: "Available queries include /posts (post, get), /posts/ID (get, delete)"
    })
})

app.get('/posts', function(req,res){ // Get all the posts
    connection.query("select * from posts;", function(err, results){
                if(err){
                    throw err;
                }
                else{
                    res.json(results);
                }
            });
})

app.get('/posts/:id', function(req,res){ // Get a specfic post with id passed in from URL
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

app.get('/posts/search/:terms', function(req,res){ // Query MySQL with multiple categories
    let terms = req.params.terms.split('-'); // split categories out of url
    let correctedTerms = terms.map(t => t.toLowerCase()); // normalize each category param by setting to lower case. All DB categories are lowercase
    console.log(terms);
    console.log(correctedTerms);
    terms = '';

    for(let term = 0; term < correctedTerms.length; term++){ // build the WHERE clause of the query. Adds a new OR statement for every additional category

        terms += `${correctedTerms[term]}`

        if(term != correctedTerms.length-1)
        {
            terms += ' or categories.category = '
        }
    }
    console.log(terms)
    connection.query(`select categories.category, posts.content, posts.posterName, posts.created_at from posts, categories where(categories.category = '${terms}')`, function(err, posts){ // Exectue query
        if(err){
            throw err
        }
        console.log(posts)
        res.json(posts)
    });
})

app.post('/posts', function(req, res){ // Make a new post
    const content = req.body.content;
    const poster = req.body.posterName;
    const categories = req.body.categories;

    console.log("********", content, poster, categories);
    
    connection.query(`insert into posts(content, created_at, updated_at, posterName) values ( '${content}', now(), now(), '${poster}')`, function(err, newPost){ // Query DB to create post
        if(err){
            throw err;
        }
        else{
            console.log(newPost);
            for(let idx = 0; idx < categories.length; idx++){
                connection.query(`insert into categories(category, post) values ('${categories[idx].toLowerCase()}', ${newPost.insertId})`); //Query db to create category entrees
            }

            res.json({id: newPost.insertId})
        }
    })  
})

app.delete('/posts/:id', function(req,res){ // Delete a post by id
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

app.listen(process.env.port || 4000, function(){ // Run the server
    console.log("Listening on 4000");
})

