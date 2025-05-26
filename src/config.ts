const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
  ? "http://localhost:3000/api"
  : "https://https://nigerian-account-number-validation-v2.onrender.com/"; // Your Render backend URL

export const config = {
  apiBaseUrl: API_BASE_URL,
};
