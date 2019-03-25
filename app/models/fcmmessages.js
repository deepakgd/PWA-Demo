const mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
}

/**
 * FcmMessagesSchema - fcm message will store here before send
 */
const FcmMessagesSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        index: true
    },
    body: {
        type: String,
        required: [true, "Body is required"]
    }
}, schemaOptions)


/**
 * Methods
 */

FcmMessagesSchema.methods = {}


 /**
  * Statics
  */

 FcmMessagesSchema.statics = {}


module.exports = mongoose.model('fcmmessages', FcmMessagesSchema)