import { apiClient } from '@/axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

class AuthAPI {
  public async login(payload: LoginPayload) {
    return await apiClient.post('/api/v1/auth/login', payload);
  }

  public async signup(payload: SignupPayload) {
    return await apiClient.post('/api/v1/auth/signup', payload);
  }

  public async me() {
    return await apiClient.get('/api/v1/auth/me');
  }

  public async logout() {
    return await apiClient.post('/api/v1/auth/logout');
  }
}

export const authConfig = new AuthAPI();
