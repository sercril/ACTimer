var mongoose = require("mongoose");


var TaskSchema = new mongoose.Schema({
    taskId: Number,
    taskName: String,
    projectId: Number,
    projectName: String
});


module.exports = mongoose.model("Task", TaskSchema);