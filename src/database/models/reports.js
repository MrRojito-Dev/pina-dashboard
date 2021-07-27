let mongoose = require('mongoose'),
    schema = new mongoose.Schema({
        user_id: { type: String, required: true },
        reportTitle: { type: String, required: true },
        reportDescription: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now() },
    });

module.exports = mongoose.model("Reports", schema);