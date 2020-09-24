const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Setup article schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//Setup article collection
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////////////////////Request targetting all articles//////////////////////////////////////

app.route("/articles")

  .get(function(req, res){
    Article.find(function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      }
      else{
        res.send(err);
      }
    });
  })

  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Success!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Success!");
      } else{
        res.send(err);
      }
    })
  });

/////////////////////////////////////////////////////Request targetting a specific article//////////////////////////////////////


app.route("/articles/:articleTitle")

  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      } else{
        res.send("Article not Found.");
      }
    });
  })

  .put(function(req, res){
    Article.update(
      //conditions (to find the article to update)
      {title: req.params.articleTitle},
      //what are we going to replace
      {
        title: req.body.title,
        content: req.body.content
      },
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Success!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function(req, res){
    //req.body = {title: "Some title that is passed in through Postman for updating the title"};

    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Success!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Success!");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
