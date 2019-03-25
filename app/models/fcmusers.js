const mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
}

/**
 * Fcmusers Schema - firebase cloud messaging users ids will store here
 */
const FcmusersSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: [true, "User Id is required"],
        unique: true,
        index: true
    }
}, schemaOptions)


/**
 * Methods
 */

 FcmusersSchema.methods = {}


 /**
  * Statics
  */

FcmusersSchema.statics = {}


module.exports = mongoose.model('fcmusers', FcmusersSchema)