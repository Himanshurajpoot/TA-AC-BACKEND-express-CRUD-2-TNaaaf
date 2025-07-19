var express = require('express');
var router = express.Router();
var Book = require("../models/Book")
var  multer = require("multer")
const path = require("path");
const fs = require("fs");
const imagePath = path.join(__dirname, "../public/images");


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
    const searchQuery = req.body.book?.trim();

    if (!searchQuery) {
      return res.redirect("/books");
    }

    const allBooks = await Book.find({});
    if (allBooks.length === 0) {
      return res.render("searchBook", {
        books: [],
        message: "The library is currently empty.",
      });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { "author.name": { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    });

    if (books.length === 0) {
      return res.render("searchBook", {
        books: [],
        message: `No books found for "${searchQuery}".`,
      });
    }

    res.render("searchBook", { books, message: null });

  } catch (err) {
    console.error("Search error:", err);
    next(err);
  }
});

// edit the book

router.get("/:id/edit",async(req,res,next)=>{
  try{
    let id = req.params.id
    let book = await Book.findById(id)
    res.render("updateBook", {book})
  }catch(err){
    next(err)
  }
})



// update data


router.post("/:id", upload.single("cover_image"), async (req, res, next) => {
  try {
    const id = req.params.id;
    let updatedData = req.body;

    let existingBook = await Book.findById(id);

    if (!existingBook) {
      return res.status(404).send("Book not found");
    }

    // If new image is uploaded, delete old one
    if (req.file) {
      const oldImage = existingBook.cover_image;
      if (oldImage) {
        const fullOldPath = path.join(imagePath, oldImage);
        // Check file exists and delete
        if (fs.existsSync(fullOldPath)) {
          fs.unlinkSync(fullOldPath);
        }
      }

      // Add new image filename
      updatedData.cover_image = req.file.filename;
    }

    await Book.findByIdAndUpdate(id, updatedData);
    res.redirect("/books");

  } catch (err) {
    next(err);
  }
});





router.get("/:id/delete", async (req, res, next) => {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    // Delete cover image file if exists
    if (book.cover_image) {
      const coverPath = path.join(imagePath, book.cover_image);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath); // Delete file
        console.log("Deleted image:", book.cover_image);
      }
    }

    // Delete book document from DB
    await Book.findByIdAndDelete(id);

    res.redirect("/books"); // Or send a success message
  } catch (err) {
    next(err);
  }
});





module.exports = router;
