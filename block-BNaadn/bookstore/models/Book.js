
let mongoose = require("mongoose");
let Schama = mongoose.Schema;

let bookSchema= new Schama({
  title: String,
  summary: String,
  pages: Number,
  publication: String,
  cover_image: String,
  category:String,
  author: {
    name: String,
    email: String,
    country: String
  }
},{timestamps:true});

let Book = mongoose.model("Book", bookSchema);

module.exports=Book;