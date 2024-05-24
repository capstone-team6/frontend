// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';

const rootReducer = combineReducers({
  location: locationReducer,
});

export default rootReducer;
