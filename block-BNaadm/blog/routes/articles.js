var express = require('express');
var router = express.Router();
let Article = require('../models/Article');
let Comment = require('../models/Comment');

/* GET users listing. */

// article form router
router.get('/new', async (req, res, next) => {
  try {
    res.render('articleForm');
  } catch (err) {
    next(err);
  }
});

// list the all article
router.get('/', async (req, res, next) => {
  try {
    let articles = await Article.find({});
    console.log(articles);
    res.render('articles', { articles: articles });
  } catch (err) {
    next(err);
  }
});

// create a new article
router.post('/', async (req, res, next) => {
  try {
    let article = await Article.create(req.body);
    console.log(article);
    res.redirect('/articles');
  } catch (err) {
    next(err);
  }
});


// find a single aricle
router.get('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let article = await Article.findById(id).populate("comments").exec();
    res.render('singleArticle', { article });
  } catch (err) {
    next(err);
  }
});

// find a especific for the aditing article
router.get('/:id/edit', async (req, res, next) => {
  try {
    let id = req.params.id;
    let article = await Article.findById(id);
    res.render('updateArticle', { article });
  } catch (err) {
    next(err);
  }
});

// updete a article
router.post('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let article = await Article.findByIdAndUpdate(id, req.body);
    res.redirect('/articles/' + id);
  } catch (err) {
    next(err);
  }
});

// delete a article
router.get('/:id/delete', async (req, res, next) => {
  try {
    let id = req.params.id;
    let article = await Article.findByIdAndDelete(id);
    let comments = await Comment.deleteMany({articleId: article.id})
    res.redirect('/articles');
  } catch (err) {
    next(err);
  }
});

// like increase
router.get('/:id/like', async (req, res, next) => {
  try {
    let id = req.params.id;
    let article = await Article.findByIdAndUpdate(id, { $inc: { likes: +1 } });
    res.redirect('/articles/' + id);
  } catch (err) {
    next(err);
  }
});

// like decrease
router.get('/:id/dislike', async (req, res, next) => {
  try {
    let id = req.params.id;
    let article = await Article.findByIdAndUpdate(id,{$inc:{dislikes:+1}});
    res.redirect('/articles/' + id);
  } catch (err) {
    next(err);
  }
});

// comments
router.post('/:id/comments', async (req, res, next) => {
  try {
    let id = req.params.id;
    req.body.articleId = id;
    let comment = await Comment.create(req.body);
    let article = await Article.findByIdAndUpdate(id,{$push :{comments:comment.id}})
    console.log(article)
    res.redirect("/articles/"+id)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
