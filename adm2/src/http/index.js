import axios from 'axios';

// const API_URL = 'http://192.168.31.68:9999/api/v1'
const API_URL = 'http://localhost:9999/api/v1'

const server = axios.create({
    baseURL: `${API_URL}`,
});

server.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt'); // Assuming the JWT token is stored in localStorage with the key 'jwtToken'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Include the token in the 'Authorization' header
    }
    return config;
});

export default server
