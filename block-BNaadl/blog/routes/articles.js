var express = require('express');
var router = express.Router();
let Article = require("../models/Article")

/* GET users listing. */
router.get("/new",async(req,res,next)=>{
    try{
        res.render("articleForm")
    }catch(err){
        next(err)
    }
})
router.get('/', async(req, res , next)=>{
    try{
        let articles = await Article.find({})
        console.log(articles)
        res.render("articles", {articles:articles})
    }catch(err){
       next(err)
    }
});

router.post("/", async(req,res,next)=>{
      try{ 
        let article = await Article.create(req.body)
        console.log(article)
        res.redirect("/articles")
      }catch(err){
        next(err)
      }
})

router.get("/:id",async(req,res,next)=>{
    try{
        let id =  req.params.id;
        let article = await Article.findById(id)
        res.render("singleArticle", {article})
    }catch(err){
        next(err)
    }
})

router.get("/:id/edit", async(req,res, next)=>{
    try{
        let id = req.params.id
        let article = await Article.findById(id)
        res.render("updateArticle",{article})
    }catch(err){
        next(err)
    }
})

router.post("/:id",async(req,res, next)=>{
    try{
        let id = req.params.id
        let article  = await Article.findByIdAndUpdate(id, req.body)
        res.redirect("/articles/"+id)
    }catch(err){
        next(err)
    }
})

router.get("/:id/delete",async(req,res, next)=>{
    try{
        let id = req.params.id
        let article = await Article.findByIdAndDelete(id)
        res.redirect("/articles")
    }catch(err){
        next(err)
    }
})

router.get("/:id/like",async(req,res, next)=>{
    try{
        let id = req.params.id;
        let article = await Article.findByIdAndUpdate(id,{$inc:{likes:+1}})
        res.redirect('/articles/'+id)
    }catch(err){
        next(err)
    }
})

router.get("/:id/dislike",async(req,res,next)=>{
    try{
        let id = req.params.id
        let find = await Article.findById(id)
        if(find.likes>0){
           let article = await Article.findByIdAndUpdate(id,{$inc:{likes:-1}})
            res.redirect('/articles/'+id)
        }else{
              res.redirect('/articles/'+id)
        }
                
    }catch(err){
        next(err)
    }
})

module.exports = router;
