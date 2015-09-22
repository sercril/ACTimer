var mongoose = require("mongoose");


var ProjectSchema = new mongoose.Schema({
    projectId: Number,
    projectName: String
});


module.exports = mongoose.model("Project", ProjectSchema);