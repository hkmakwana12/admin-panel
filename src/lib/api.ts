import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8000/api", // 👈 change this to your backend URL
    withCredentials: false, // set to true if you use cookies (like Sanctum)
});

// Optional: Interceptors for token auth or logging
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.error("API error:", error);
//         return Promise.reject(error);
//     }
// );
