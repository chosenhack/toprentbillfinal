import axios from 'axios';
import { store } from '../store';
import type { Customer, Payment, Activity } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: 'auth/clearUser' });
    }
    return Promise.reject(error);
  }
);

// Customers API
export class CustomersAPI {
  async getCustomers(): Promise<Customer[]> {
    const response = await api.get('/customers');
    return response.data;
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await api.post('/customers', customer);
    return response.data;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  }
}

// Payments API
export class PaymentsAPI {
  async getPayments(): Promise<Payment[]> {
    const response = await api.get('/payments');
    return response.data;
  }

  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const response = await api.post('/payments', payment);
    return response.data;
  }

  async updatePaymentStatus(id: string, status: Payment['status']): Promise<Payment> {
    const response = await api.put(`/payments/${id}/status`, { status });
    return response.data;
  }
}

// Activities API
export class ActivitiesAPI {
  async getActivities(): Promise<Activity[]> {
    const response = await api.get('/activities');
    return response.data;
  }

  async createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const response = await api.post('/activities', activity);
    return response.data;
  }
}

// Export API instances
export const customersAPI = new CustomersAPI();
export const paymentsAPI = new PaymentsAPI();
export const activitiesAPI = new ActivitiesAPI();