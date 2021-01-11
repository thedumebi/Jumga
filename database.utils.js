const mongoose = require("mongoose");

exports.connectDB = async function() {
    try {
        await mongoose.connect("mongodb://localhost:27017/jumgaDB", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
        mongoose.set("returnOriginal", false)
        console.log("Database connection established");
    } catch (error) {
        console.log(error);
    }
}
