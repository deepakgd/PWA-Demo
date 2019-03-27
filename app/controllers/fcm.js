const to = require('await-to-js').to,
    only = require('only'),
    gcm = require('node-gcm');

const config = require('../../config'),
    Subscribers = require('../models/subscribers'),
    FcmMessage = require('../models/fcmmessages');

// gcm.Promise = require('bluebird');
module.exports = {
    /**
     * getUsers - return fcmuserid for push notification
     */
    getUsers: function(){
        return new Promise(async (resolve, reject)=>{
            let [error, users] = await to(Subscribers.find({}));
            if(error) return reject({ status: 500, error: error });
            resolve(users);
        })
    },
    /**
     * subscribeUser - save subscription_id for firebase cloud messaging 
     * @param {OBJECT} body - contains subscription_id  of brower for push notification
     */
    subscribeUser: function(body){
        return new Promise(async (resolve, reject)=>{
            let subscriber = new Subscribers(only(body, "subscription_id"));
            let [error, response] = await to(subscriber.save());
            if(error) return reject({ status: 500, error: error });
            return resolve({ message: "Subscribed successfully" })
        })
    },
    /**
     * unsubscribeUser - unsubscribe user from push notification
     * @param {OBJECT} body - contains subscription_id of browser to unsubscribe push notification
     */
    unsubscribeUser: function(body){
        return new Promise(async (resolve, reject) => {
            let [error, response] = await to(Subscribers.findOneAndDelete({ subscription_id: body.subscription_id }));
            if(error) return reject({ status: 500, error: error });
            return resolve({ message: "Unsubscribed" })
        })
    },
    /**
     * notifyUsers - send custom push notification message to subscribed users
     * @param {OBJECT} body - contains title and body for push notification 
     */
    notifyUsers: function(body){
        return new Promise(async (resolve, reject) => {
            // get all subscribers subscription_ids as array
            let [error, subscription_ids] = await to(Subscribers.distinct("subscription_id")); 
            if(error) return reject({ status: 500, error: error });

            // init GCM with API key
            let sender = new gcm.Sender(config.fcm);

            // push notification content
            let title = body.title || "Default Title";
            let content = body.body || "Default body content";

            let fcmmessage = new FcmMessage(only(body, 'title body'))
            let [saveError, response] = await to(fcmmessage.save());
            if(saveError) return reject({ status: 500, error: saveError });

            // Prepare a message to be sent
            let message = new gcm.Message({
                notification: {
                    title,
                    body: content
                }
            });

            sender.send(message, { registrationTokens: subscription_ids }, function (err, response) {
                if (err) {
                    reject({ status: 500, error: err });
                } else {
                    return resolve(response);
                } 
            });
        })
    },
    /**
     * getLastNoitificationTemplate - return last notification template 
     */
    getLastNoitificationTemplate: function(){
        return new Promise(async (resolve, reject) => {
            let [error, template] = await to(FcmMessage.findOne({}, {}, { sort: { createdAt: -1 } }));
            if(error) return reject({ status: 500, error: error });
            resolve({
                title: template.title,
                options: {
                    body: template.body
                }
            })
        })
    }
}

