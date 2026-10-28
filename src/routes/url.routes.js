
const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const {
    shortenUrl,
    redirectToOriginalUrl,
    getAnalytics,
} = require("../controllers/url.controller");

// Rate limiter: maximum 10 URL creations per 15 minutes per IP
const shortenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many URLs created. Please try again after 15 minutes.",
    },
});

// Create short URL (rate limited)
router.post("/shorten", shortenLimiter, shortenUrl);

// Analytics
router.get("/analytics/:shortCode", getAnalytics);

// Redirect (keep this route last)
router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;
