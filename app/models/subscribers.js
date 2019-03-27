const mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
}

/**
 * Subscribers Schema - firebase cloud messaging subscribers ids will store here
 */
const SubscribersSchema = mongoose.Schema({
    subscription_id: {
        type: String,
        required: [true, "Subscription Id is required"],
        unique: true,
        index: true
    }
}, schemaOptions)


/**
 * Methods
 */

SubscribersSchema.methods = {}


 /**
  * Statics
  */

 SubscribersSchema.statics = {}


module.exports = mongoose.model('subscribers', SubscribersSchema)