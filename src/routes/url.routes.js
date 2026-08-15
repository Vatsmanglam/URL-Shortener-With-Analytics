const express = require("express");
const router = express.Router();

const {
    shortenUrl,
    redirectToOriginalUrl
} = require("../controllers/url.controller");

router.post("/shorten", shortenUrl);

router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;