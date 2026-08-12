const { createShortUrl } = require("../services/url.service");

const shortenUrl = (req, res) => {
    const result = createShortUrl(req.body.url);

    res.json(result);
};

module.exports = {
    shortenUrl
};