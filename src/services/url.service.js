const { nanoid } = require("nanoid");
const URL = require("../models/url.model");

const createShortUrl = async (originalUrl) => {
    const shortCode = nanoid(6);

    const newUrl = await URL.create({
        originalUrl,
        shortCode,
    });

    return newUrl;
};

const getOriginalUrl = async (shortCode) => {
    const url = await URL.findOne({ shortCode });

    return url;
};

module.exports = {
    createShortUrl,
    getOriginalUrl,
};