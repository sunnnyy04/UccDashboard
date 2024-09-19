import mongoose from "mongoose";

const fileSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    file:{
        type:String,
        required:true
    }
})

const File= mongoose.models.File ||mongoose.model('File',fileSchema)
export default File