import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/store.type';
import type { RootState } from '../auth.store';

const initialState: AuthState = {
  user: null,
  isRehydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setRehydrated(state, action: PayloadAction<boolean>) {
      state.isRehydrated = action.payload;
    },
  },
});

export const { setUser, clearUser, setRehydrated } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectIsRehydrated = (state: RootState) => state.auth.isRehydrated;

export default authSlice.reducer;
