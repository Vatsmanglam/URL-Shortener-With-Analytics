const createShortUrl = (url) => {
    return {
        originalUrl: url,
        shortCode: "abc123",
        shortUrl: "http://localhost:3000/abc123"
    };
};

module.exports = {
    createShortUrl
};