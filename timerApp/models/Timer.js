var mongoose = require("mongoose");


var TimerSchema = new mongoose.Schema({
    elapsedTime: Number,
    billable: Boolean,
    description: String,
    category: String,
    date: {type: Date, default: Date.now()},
    task: String
});


module.exports = mongoose.model("Timers", TimerSchema);