import axios from 'axios';

const API_URL = 'http://blog:9999/api/v1'

const server = axios.create({
    baseURL: `${API_URL}`,
});

export default server