const express = require('express');
const memberRouter = express.Router();
const member = require('./member.controllers');
const { auth } = require('../../middlewares');
memberRouter.post('/create', auth, member.Create);
memberRouter.get('/view/:id', auth, member.View);
// memberRouter.put('/edit', auth, member);
// memberRouter.get('/search', auth, member);
module.exports = memberRouter;
