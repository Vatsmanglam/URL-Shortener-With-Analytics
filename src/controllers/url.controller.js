const urlService = require("../services/url.service");

const shortenUrl = async (req, res) => {
    try {
        const { url } = req.body;

        const result = await urlService.createShortUrl(url);

        res.status(201).json({
            message: "Short URL created successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await urlService.getOriginalUrl(shortCode);

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found",
            });
        }

        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    shortenUrl,
    redirectToOriginalUrl,
};