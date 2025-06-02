let mongoose = require("mongoose")
let Schema = mongoose.Schema


let articleSchema = new Schema({
    title:{type:String},
    description:{type:String},
    tags:[String],
    author:{type:String},
    likes:{type:Number,default:0}
},{timestamps:true})


let Article = mongoose.model("Article", articleSchema)

module.exports = Article