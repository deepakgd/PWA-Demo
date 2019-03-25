// npm packages
const express = require('express'),
    to = require('await-to-js').to;

// local handlers
const fcmController = require('../controllers/fcm'),
    utils = require('../utils');


//express router
const router = express.Router()


/**
 * /users - list users from database
 */
router.get('/users', async (req, res, next)=>{
  let [error, users] = await to(fcmController.getUsers());
  if(error) return utils.helper.handleError(res, error.status, error);
  return res.json({ data: users });
})

/**
 * create - create user
 */
router.post('/create', async (req, res, next)=>{
  let [error, users] = await to(fcmController.createUser(req.body));
  if(error) return utils.helper.handleError(res, error.status, error);
  return res.json({ data: users });
})

module.exports = router

