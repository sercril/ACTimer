var mongoose = require("mongoose");


var TaskSchema = new mongoose.Schema({
    taskId: Number,
    taskName: String,
    projectId: Number
});


module.exports = mongoose.model("Task", TaskSchema);