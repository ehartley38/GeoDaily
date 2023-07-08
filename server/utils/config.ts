require("dotenv").config();

const PORT = process.env.PORT;

const allowedOrigins = ["http://localhost:3000"];

module.exports = { PORT, allowedOrigins };
