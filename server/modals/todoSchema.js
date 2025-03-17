const mongoose = require("mongoose")
const Schema = mongoose.Schema

const todoSchema = new Schema({
    ToDo : String
})

module.exports = mongoose.model("todos", todoSchema)