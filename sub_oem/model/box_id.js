const mongoose = require('mongoose')

const BoxId = mongoose.Schema({
    box_id: {
        type: String,
        require: true
    },
    box_type: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('BoxId', BoxId);

