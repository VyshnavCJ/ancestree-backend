const express = require('express');
const familyRouter = express.Router();
const family = require('./family.controllers');
const { auth } = require('../../middlewares');
familyRouter.post('/create', auth, family.CreateFamily);
familyRouter.get('/home', auth, family.Home);
familyRouter.post('/upload', auth, family.Upload);
familyRouter.put('/update', auth, family.UpdateFamily);
module.exports = familyRouter;
