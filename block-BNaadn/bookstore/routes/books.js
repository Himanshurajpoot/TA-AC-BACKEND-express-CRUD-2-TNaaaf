var express = require('express');
var router = express.Router();
var Book = require("../models/Book")
var  multer = require("multer")
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images")); // Upload to /public/images folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  }
});

var upload = multer({ storage: storage });
/* GET users listing. */

// book form


router.get('/new', async(req, res, next) =>{
     try{
       await res.render("bookForm");
     }catch(err){
       next(err);
     }
});

// grap the book data
router.post("/", upload.single("cover_image"), async (req, res, next) => {
  try {
    let bookData = req.body;
    console.log(bookData)
    // Save uploaded image filename if present
    if (req.file) {
      bookData.cover_image = req.file.filename;
    }

    let book = await Book.create(bookData);
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
});

// list all book

router.get("/",async(req,res,next)=>{
  try{
    let books = await Book.find({})
     res.render("books", {books:books})
  }catch(err){
    next(err)
  }
})


router.post("/search", async (req, res, next) => {
  try {
    let findBook = req.body.book;

    if (findBook == "") {
      res.redirect("/books");
    } else {
      let books = await Book.find({
        $or: [
          { title: { $regex: findBook, $options: "i" } },
          { "author.name": { $regex: findBook, $options: "i" } },
          { category: { $regex: findBook, $options: "i" } }
        ]
      });

      console.log(books);
      res.render("searchBook", { books: books });
    }

  } catch (err) {
    next(err);
  } 
});




module.exports = router;
