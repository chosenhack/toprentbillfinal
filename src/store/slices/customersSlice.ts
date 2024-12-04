import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Customer } from '../../types';

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

export const addCustomer = createAsyncThunk(
  'customers/add',
  async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const customer: Customer = {
      id: uuidv4(),
      ...customerData,
      createdAt: now,
      updatedAt: now
    };
    return customer;
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, ...customerData }: { id: string } & Partial<Customer>) => {
    const now = new Date().toISOString();
    return {
      id,
      ...customerData,
      updatedAt: now
    };
  }
);

export const deactivateCustomer = createAsyncThunk(
  'customers/deactivate',
  async ({ id, deactivationDate }: { id: string; deactivationDate: string }) => {
    return {
      id,
      active: false,
      deactivationDate,
      updatedAt: new Date().toISOString()
    };
  }
);

export const reactivateCustomer = createAsyncThunk(
  'customers/reactivate',
  async ({ id, activationDate }: { id: string; activationDate: string }) => {
    return {
      id,
      active: true,
      activationDate,
      deactivationDate: undefined,
      updatedAt: new Date().toISOString()
    };
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error adding customer';
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
      })
      .addCase(deactivateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
      })
      .addCase(reactivateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
      });
  }
});

export default customersSlice.reducer;