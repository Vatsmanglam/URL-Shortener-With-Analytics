
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },

        shortCode: {
            type: String,
            required: true,
            unique: true,
        },

        clicks: {
            type: Number,
            default: 0,
        },

        clickHistory: [
            {
                clickedAt: {
                    type: Date,
                    default: Date.now,
                },

                userAgent: {
                    type: String,
                    default: "Unknown",
                },

                device: {
                    type: String,
                    enum: ["Mobile", "Desktop", "Tablet", "Unknown"],
                    default: "Unknown",
                },

                browser: {
                    type: String,
                    default: "Unknown",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("URL", urlSchema);
