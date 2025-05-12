const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
  ? "http://localhost:3000/api"
  : "https://your-backend-url.com/api"; // You'll need to update this with your actual backend URL after deployment

export const config = {
  apiBaseUrl: API_BASE_URL,
};
