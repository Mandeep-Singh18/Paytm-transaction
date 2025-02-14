// backend/api/index.js
const { Router } = require("express");
const userrouter = require("./user")
const accountrouter = require("./account")

const router = Router();

router.use("/user", userrouter);
router.use("/account", accountrouter);


module.exports = router;