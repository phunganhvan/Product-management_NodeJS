const express= require('express')
const router= express.Router()
const controller= require("../../controllers/client/users.controller")

router.get("/not-friend", controller.notFriend);
router.get("/request", controller.requestFriends);
router.get("/accept", controller.accept);
router.get("/friendList", controller.friendList);
module.exports= router