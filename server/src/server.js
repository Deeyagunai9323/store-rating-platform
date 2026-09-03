require("dotenv").config();

const app = require("./app");

const {
    testDatabaseConnection
} = require("./config/database");


const PORT = process.env.PORT || 5000;


const startServer = async () => {

    await testDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};


startServer();