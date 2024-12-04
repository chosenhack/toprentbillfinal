import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Activity, ActivityType } from '../../types';

interface ActivityState {
  items: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  items: [],
  loading: false,
  error: null,
};

export const addActivity = createAsyncThunk(
  'activity/add',
  async (activity: {
    type: ActivityType;
    userId: string;
    userName: string;
    details: Activity['details'];
  }) => {
    const newActivity: Activity = {
      id: uuidv4(),
      type: activity.type,
      userId: activity.userId,
      userName: activity.userName,
      timestamp: new Date().toISOString(),
      details: activity.details
    };

    // In a real app, you would save this to the backend
    return newActivity;
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error adding activity';
      });
  }
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;