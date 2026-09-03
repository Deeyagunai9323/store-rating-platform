const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const adminRoutes =require("./routes/admin.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes);


// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Store Rating Platform API is running"
    });
});


module.exports = app;