const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/blog.controller');

router.get("/", controller.index);

router.get('/detail/:slugBlog', controller.detail);

router.get("/:slugBlog", controller.category)
module.exports = router;    