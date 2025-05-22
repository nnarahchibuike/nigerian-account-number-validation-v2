const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
  ? "http://localhost:3000/api"
  : "https://nigerian-account-validator.onrender.com/api"; // Your Render backend URL

export const config = {
  apiBaseUrl: API_BASE_URL,
};
