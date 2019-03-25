const to = require('await-to-js').to,
    only = require('only'),
    gcm = require('node-gcm');

const config = require('../../config'),
    Fcmuser = require('../models/fcmusers'),
    FcmMessage = require('../models/fcmmessages');

// gcm.Promise = require('bluebird');
module.exports = {
    /**
     * getUsers - return fcmuserid for push notification
     */
    getUsers: function(){
        return new Promise(async (resolve, reject)=>{
            let [error, users] = await to(Fcmuser.find({}));
            if(error) return reject({ status: 500, error: error });
            resolve(users);
        })
    },
    /**
     * createUser - save user_id for firebase cloud messaging 
     * @param {OBJECT} body - contains user id for fcm and user_id is browser notification id
     */
    createUser: function(body){
        return new Promise(async (resolve, reject)=>{
            var fcmuser = new Fcmuser(only(body, "user_id"));
            let [error, response] = await to(fcmuser.save());
            if(error) return reject({ status: 500, error: error });
            return resolve({ message: "User Id saved" })
        })
    },
    notifyUsers: function(body){
        return new Promise(async (resolve, reject) => {
            let [error, user_ids] = await to(Fcmuser.distinct("_id")); // get only _id as array
            if(error) return reject({ status: 500, error: error });
            // let 

            var sender = new gcm.Sender(config.fcm);

             // Prepare a message to be sent
            var message = new gcm.Message({
                notification: {
                    title: "Hello, World",
                    icon: "/images/192x192.png",
                    body: "Click to see the latest commit"
                }
            });

            sender.send(message, { registrationTokens: user_ids }, function (err, response) {
                if (err) {
                    console.error(err);
                } else {
                return res.json(response);
                } 
            });
        })
    }
}

