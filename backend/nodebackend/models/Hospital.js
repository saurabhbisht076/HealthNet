const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    facilities: [String],
});

module.exports = mongoose.model('Hospital', hospitalSchema);