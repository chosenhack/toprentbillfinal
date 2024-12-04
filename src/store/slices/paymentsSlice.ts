import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Payment } from '../../types';

interface PaymentsState {
  items: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  items: [],
  loading: false,
  error: null,
};

export const addPayment = createAsyncThunk(
  'payments/add',
  async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPayment: Payment = {
      id: uuidv4(),
      ...payment,
      createdAt: now,
      updatedAt: now
    };
    return newPayment;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'payments/updateStatus',
  async ({ id, status }: { id: string; status: Payment['status'] }) => {
    const now = new Date().toISOString();
    return {
      id,
      status,
      updatedAt: now
    };
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPayment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            status: action.payload.status,
            updatedAt: action.payload.updatedAt
          };
        }
      });
  }
});

export default paymentsSlice.reducer;