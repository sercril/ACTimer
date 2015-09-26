var mongoose = require("mongoose");


var CategorySchema = new mongoose.Schema({
    categoryId: Number,
    categoryName: String
});


module.exports = mongoose.model("Category", CategorySchema);