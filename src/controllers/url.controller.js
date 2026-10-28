
const urlService = require("../services/url.service");

const shortenUrl = async (req, res) => {
    try {
        const { url } = req.body;

        // Check if URL is provided
        if (!url || typeof url !== "string" || !url.trim()) {
            return res.status(400).json({
                message: "URL is required and must be a string",
            });
        }

        // Validate URL format
        let parsedUrl;

        try {
            parsedUrl = new URL(url.trim());
        } catch {
            return res.status(400).json({
                message: "Please provide a valid URL",
            });
        }

        // Allow only HTTP and HTTPS
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                message: "Only HTTP and HTTPS URLs are allowed",
            });
        }

        const result = await urlService.createShortUrl(parsedUrl.href);

        return res.status(201).json({
            message: "Short URL created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Shorten URL error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const userAgent = req.get("user-agent") || "Unknown";
        const ua = userAgent.toLowerCase();

        let device = "Unknown";

        if (/ipad|tablet/.test(ua)) {
            device = "Tablet";
        } else if (/mobile|android|iphone|ipod/.test(ua)) {
            device = "Mobile";
        } else if (userAgent !== "Unknown") {
            device = "Desktop";
        }

        let browser = "Unknown";

        if (ua.includes("edg/")) {
            browser = "Edge";
        } else if (ua.includes("opr/") || ua.includes("opera")) {
            browser = "Opera";
        } else if (ua.includes("firefox/")) {
            browser = "Firefox";
        } else if (ua.includes("chrome/") && !ua.includes("edg/")) {
            browser = "Chrome";
        } else if (ua.includes("safari/") && !ua.includes("chrome/")) {
            browser = "Safari";
        }

        const url = await urlService.getUrlAndIncrementClicks(
            shortCode,
            { userAgent, device, browser }
        );

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found",
            });
        }

        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error("Redirect error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};



const getAnalytics = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await urlService.getAnalytics(shortCode);

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found",
            });
        }

        return res.status(200).json({
            message: "Analytics fetched successfully",
            data: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                clicks: url.clicks,
                clickHistory: url.clickHistory.map((click) => ({
                    clickedAt: click.clickedAt,
                    userAgent: click.userAgent,
                    device: click.device,
                    browser: click.browser,
                })),
                createdAt: url.createdAt,
            },
        });
    } catch (error) {
        console.error("Analytics error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


module.exports = {
    shortenUrl,
    redirectToOriginalUrl,
    getAnalytics,
};
