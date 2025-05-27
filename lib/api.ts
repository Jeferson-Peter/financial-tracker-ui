import axios from "axios";

export const djangoAPI = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

djangoAPI.interceptors.response.use(
    (res) => res,
    (error) => {
        return Promise.reject(error);
    }
);