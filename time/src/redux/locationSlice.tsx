// locationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  newAddress: string;
  newLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const initialState: LocationState = {
  newAddress: '',
  newLocation: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateLocation(state, action: PayloadAction<{ newAddress: string; newLocation: { latitude: number; longitude: number; } }>) {
      state.newAddress = action.payload.newAddress;
      state.newLocation = action.payload.newLocation;
    },
  },
});

export const { updateLocation } = locationSlice.actions;

export default locationSlice.reducer;
