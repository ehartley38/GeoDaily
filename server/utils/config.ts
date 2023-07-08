require("dotenv").config();

const PORT = process.env.PORT;

const allowedOrigins = ["http://localhost:3000"];

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

module.exports = {
  PORT,
  allowedOrigins,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};
