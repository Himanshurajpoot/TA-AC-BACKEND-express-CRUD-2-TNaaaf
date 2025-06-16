let  express = require("express")
let router = express.Router()
let  Comment = require("../models/Comment")
let Article = require("../models/Article")


// for edit comment
router.get("/:id/edit", async(req,res,next)=>{
    try{
       let id = req.params.id
       let  comment = await Comment.findById(id)
       res.render("updateComment",{comment})
    }catch(err){
         next(err)
    }
})

// updeted comment to database

router.post("/:id", async(req,res,next)=>{
    try{
     let id = req.params.id
     let comment = await Comment.findByIdAndUpdate(id, req.body)
     res.redirect("/articles/"+ comment.articleId)
    }catch(err){
        next(err)
    }
})


// like comment

router.get("/:id/like", async(req,res,next)=>{
    try{
        let id = req.params.id;
        let comment = await Comment.findByIdAndUpdate(id ,{$inc:{likes:+1}})
        res.redirect("/articles/"+ comment.articleId)
    }catch(err){
       next(err)
    }
})

// dislike comment
router.get("/:id/dislike",async(req,res,next)=>{
    try{
        let id = req.params.id;
        let comment = await Comment.findByIdAndUpdate(id,{$inc:{dislikes:+1}})
        res.redirect("/articles/"+ comment.articleId)
    }catch(err){
        next(err)
    }
})

// delete a comment 

router.get("/:id/delete",async(req,res,next)=>{
    try{
      let id = req.params.id
      let comment = await Comment.findByIdAndDelete(id)
      let article = await Article.findByIdAndUpdate(comment.articleId,{$pull:{comments:comment.id}})
      res.redirect("/articles/"+ comment.articleId)
    }catch(err){
        next(err)
    }
})


module.exports=router