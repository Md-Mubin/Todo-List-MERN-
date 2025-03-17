const mongoose = require("mongoose")

const dbConnect = () => {
    mongoose.connect(process.env.DATA_BASE)
    .then(()=>{
        console.log("Database Connect")
    })
}

module.exports = dbConnect