
const { nanoid } = require("nanoid");
const URL = require("../models/url.model");
const { redisClient } = require("../config/redis");

const createShortUrl = async (originalUrl) => {
    const shortCode = nanoid(6);

    const newUrl = await URL.create({
        originalUrl,
        shortCode,
    });

    try {
        await redisClient.set(
            `url:${shortCode}`,
            originalUrl,
            { EX: 3600 }
        );
    } catch (error) {
        console.error("Redis cache write failed:", error.message);
    }

    return newUrl;
};

const getUrlAndIncrementClicks = async (
    shortCode,
    clickDetails = {}
) => {
    let originalUrl;

    // Try Redis cache first
    try {
        originalUrl = await redisClient.get(`url:${shortCode}`);
    } catch (error) {
        console.error("Redis cache read failed:", error.message);
    }

    // If cache misses, fetch from MongoDB
    if (!originalUrl) {
        const existingUrl = await URL.findOne({ shortCode });

        if (!existingUrl) {
            return null;
        }

        originalUrl = existingUrl.originalUrl;

        // Cache the URL for one hour
        try {
            await redisClient.set(
                `url:${shortCode}`,
                originalUrl,
                { EX: 3600 }
            );
        } catch (error) {
            console.error("Redis cache write failed:", error.message);
        }
    }

    // Increment clicks and save device/browser information
    const updatedUrl = await URL.findOneAndUpdate(
        { shortCode },
        {
            $inc: { clicks: 1 },
            $push: {
                clickHistory: {
                    clickedAt: new Date(),
                    userAgent: clickDetails.userAgent || "Unknown",
                    device: clickDetails.device || "Unknown",
                    browser: clickDetails.browser || "Unknown",
                },
            },
        },
        { new: true }
    );

    if (!updatedUrl) {
        return null;
    }

    updatedUrl.originalUrl = originalUrl;

    return updatedUrl;
};

const getAnalytics = async (shortCode) => {
    const url = await URL.findOne({ shortCode });
    return url;
};

module.exports = {
    createShortUrl,
    getUrlAndIncrementClicks,
    getAnalytics,
};
