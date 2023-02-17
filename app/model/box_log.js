const mongoose  = require('mongoose')

const EnginePubItem = mongoose.Schema({
    name: {
        type: String
    },
    status: {
        type: Number
    },
    engine_id: {
        type: Number
    }
})

const BoxLog = mongoose.Schema({
    box_id: {
        type: String,
    },
    mac_address: {
        type: String,
    },
    cpu_usage: {
        type: String,
    },
    memory: {
        type: String,
    },
    memory_usage: {
        type: String,
    },
    boot_storage: {
        type: String,
    },
    boot_storage_usage: {
        type: String,
    },
    storage: {
        type: String,
    },
    storage_usage: {
        type: String,
    },
    ip_private: {
        type: String,
    },
    ip_public: {
        type: String,
    },
    temperature: {
        type: String,
    },
    engines_pub: {
        type: [EnginePubItem],
    },
    time: {
        type: Date,
        default: Date.now,
    },
    up_time: {
        type: String,
        default: '00:00:00'
    },
    status: {
        type: Number,
        default : 1
    },
    engines_pub_status: {
        type: Number,
        default: 1
    }
})

BoxLog.index({time: -1},{expireAfterSeconds: 30 * 24 * 60 * 60})
BoxLog.index({box_id: 1, time: -1})

module.exports = mongoose.model('BoxLog', BoxLog)