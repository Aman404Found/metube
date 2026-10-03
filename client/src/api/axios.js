import axios from "axios"

//how will i import api if i write export const api ... , will i import like - import {api}...?
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1", // but what is this keyword import.meta.env and why not process.env
    withCredentials: true, // does it mean that we are asking server to give us cookies?
    timeout: 10000
})

export default api;
