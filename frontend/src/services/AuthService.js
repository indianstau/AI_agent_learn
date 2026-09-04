import axios from 'axios';

// const AUTH_API_BASE_URL = 'http://localhost:8080/api/v1/auth';
const AUTH_API_BASE_URL = 'https://aiagentlearn-production.up.railway.app/api/v1/auth';

class AuthService {
    login(credentials) {
        return axios.post(`${AUTH_API_BASE_URL}/login`, credentials);
    }

    register(user) {
        return axios.post(`${AUTH_API_BASE_URL}/register`, user);
    }

    updateProfile(userId, profile) {
        return axios.put(`${AUTH_API_BASE_URL}/profile/${userId}`, profile);
    }
}

export default new AuthService();
