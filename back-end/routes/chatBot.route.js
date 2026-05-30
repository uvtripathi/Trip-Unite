const chatBot = require("../controllers/chatBot.controller.js");
const { Router } = require("express");

const router = Router();
router.route("/chatbot").post(chatBot);

module.exports = router;
