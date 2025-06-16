let mongoose = require("mongoose")
let Schema = mongoose.Schema


let articleSchema = new Schema({
    title:{type:String ,require:true},
    discription:{type:String, require:true},
    tags:[String],
    author:{type:String},
    likes:{type:Number,default:0},
    dislikes:{type:Number,default:0},
    comments:[{type:Schema.Types.ObjectId, ref:"Comment"}]
},{timestamps:true})


let Article = mongoose.model("Article", articleSchema)

module.exports = Article