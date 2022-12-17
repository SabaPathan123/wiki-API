const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true});

const articleSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article",articleSchema);

app.route("/articles/:title")
.get(function(req,res){
  Article.findOne({title : req.params.title},function(err,result){
    if(result){
      res.send(result);
    }
    else{
      res.send(err);
    }
  });
})
.put(function(req,res){
  Article.replaceOne({title : req.params.title},
  {title : req.body.title, content : req.body.content},
  function(err){
    if(!err){
      res.send("success");
    }
  });
})
.patch(function(req,res){
  Article.updateOne({title : req.params.title},
  {title : req.body.title, content : req.body.content},
  function(err){
    if(!err){
      res.send("Success");
    }
  });
})
.delete(function(req,res){
  Article.deleteOne({title : req.params.title},
    function(err){
      if(!err){
        res.send("Success");
      }
  });
});

app.route("/articles")
  .get(function(req,res){
    Article.find({},function(err,results){
      if(results){
        res.send(results);
      }
    });
  })
  .post(function(req,res){
    const ntitle = req.body.title;
    const ncontent = req.body.content;
    console.log(ntitle);
    console.log(ncontent);
    const newArticle = new Article({
      title: ntitle,
      content: ncontent
    });
   newArticle.save(function(err){
     if(!err){
       console.log("Success");
     }
     else{
       console.log(err);
     }
   });
  })
  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(err){
        res.send("Success");
      }
      else{
        res.send(err);
      }
    })
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
