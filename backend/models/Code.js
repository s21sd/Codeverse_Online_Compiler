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
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Code', codeSchema);
