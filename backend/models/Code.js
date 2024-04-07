const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    input: {
        type: String,
    },
    language: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Code', codeSchema);