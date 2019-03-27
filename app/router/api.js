// npm packages
const express = require('express'),
    to = require('await-to-js').to;

// local handlers
const fcmController = require('../controllers/fcm'),
    utils = require('../utils');


//express router
const router = express.Router()


/**
 * /users - list subscribed users from database
 */
router.get('/users', async (req, res, next)=>{
  let [error, users] = await to(fcmController.getUsers());
  if(error) return utils.helper.handleError(res, error.status, error);
  return res.json({ data: users });
})

/**
 * subscribe - subscribe user for push notification
 */
router.post('/subscribe', async (req, res, next)=>{
  let [error, user] = await to(fcmController.subscribeUser(req.body));
  if(error) return utils.helper.handleError(res, error.status, error);
  return res.json({ data: user });
})

/**
 * unsubscribe - unsubscribe user to avoid push notification
 */
router.delete('/unsubscribe', async (req, res, next) => {
  let [error, user] = await to(fcmController.unsubscribeUser(req.body));
  if(error) return utils.helper.handleError(res, error.status, error);
  return res.json({ data: user })
})

/**
 * notify - send push notification to all subscribed users. custom message can be passed in request body
 * Currently using title and body content from request body for push notification
 */
router.post('/notify', async (req, res, next) => {
  let [error, status] = await to(fcmController.notifyUsers(req.body));
  if(error) return utils.helper.handleError(res, error.status, error);
  return res.json({ data: status })
})

/**
 * notifytemplate - return last push notification template to user
 * Why this API?
 * During App open, unable to get notification message. to fix that i have implemented this API
 * Suppose if app running in background no issue this api at that time would not trigger
 */
router.get('/notifytemplate', async (req, res, next) => {
  let [error, template] = await to(fcmController.getLastNoitificationTemplate())
  if(error) return utils.helper.handleError(res, error.status, error);
  return res.json({ data: template })
})

/**
 * files - return current webpack-manifest.json file content
 * Service worker using this api to cache files in browser
 */
router.get('/files', async (req, res, next) => res.json({ data: req.app.get("webpack") }))

module.exports = router

