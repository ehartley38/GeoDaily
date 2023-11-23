// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;

// const allowedOrigins = ["http://localhost:3000"];
const allowedOrigins = [
  "http://localhost:3000",
  "https://main.d7ip2ly93hjk7.amplifyapp.com",
];

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const MAPS_API_KEY = process.env.MAPS_API_KEY;

export const config = {
  PORT: PORT,
  allowedOrigins: allowedOrigins,
  ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
  MAPS_API_KEY: MAPS_API_KEY,
};
