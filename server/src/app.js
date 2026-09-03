const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const app = express();


// Security
app.use(helmet());


// CORS
app.use(cors());


// Request logging
app.use(morgan("dev"));


// JSON body parser
app.use(express.json());


// URL encoded data
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Store Rating Platform API is running"
    });
});


module.exports = app;