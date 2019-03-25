const env = process.env.NODE_ENV
let config = {
  env,
}
// mongodb - connection string 
config.mongodbUrl = process.env.MONGODB_URL;
config.fcm = process.env.FCM_API_KEY

config.timezone = 'Asia/Kolkata'

module.exports = config
