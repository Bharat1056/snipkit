import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser,
  clearUser,
  selectCurrentUser,
  selectIsRehydrated,
} from '@/stores/slices/auth.slice';
import type { User } from '@/types/store.type';

/**
 * Checks if the user's session has expired.
 * @param user The user object from the auth state.
 * @returns `true` if the session is expired, otherwise `false`.
 */
const isSessionExpired = (user: User | null): boolean => {
  if (!user?.expiresAt) {
    // No user or no expiration date means the session is invalid.
    return true;
  }
  // Compare the expiration date with the current time.
  return new Date(user.expiresAt) <= new Date();
};

/**
 * A utility to ensure any Date objects in user data are converted to
 * ISO strings, which is required for Redux state serialization.
 * @param userData The user data, potentially from an API.
 * @returns User data with date fields converted to strings.
 */
const convertDatesToStrings = (userData: any): User => {
  if (!userData) return userData;

  const newUserData = { ...userData };
  // List of keys that might be Date objects
  for (const key of ['createdAt', 'updatedAt', 'expiresAt']) {
    if (newUserData[key] instanceof Date) {
      newUserData[key] = newUserData[key].toISOString();
    }
  }
  return newUserData;
};

/**
 * Custom hook to manage and access authentication state.
 * It handles loading state, session expiration, and provides methods
 * to log in and out.
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  // Select the raw user and rehydration status from the Redux store
  const user = useSelector(selectCurrentUser);
  const isRehydrated = useSelector(selectIsRehydrated);

  // This effect automatically handles session expiration.
  // When the store is rehydrated, it checks if the persisted user session is still valid. If not, it clears it.
  useEffect(() => {
    if (isRehydrated && isSessionExpired(user)) {
      dispatch(clearUser());
    }
  }, [isRehydrated, user, dispatch]);

  /**
   * Sets the authenticated user in the global state.
   * @param userData The user object to set.
   */
  const setAuth = (userData: User | null) => {
    if (userData) {
      const serializableUser = convertDatesToStrings(userData);
      dispatch(setUser(serializableUser));
    } else {
      dispatch(setUser(null));
    }
  };

  /**
   * Clears the authenticated user, effectively logging them out.
   */
  const clearAuth = () => {
    dispatch(clearUser());
  };

  // Derived state that components can use
  const isLoading = !isRehydrated;
  // A user is authenticated if the store is rehydrated and a valid user object exists.
  const isAuthenticated = !isLoading && !!user;

  return {
    /** The authenticated user object, or `null`. */
    user,
    /** `true` if the user is authenticated and the session is valid. */
    isAuthenticated,
    /** `true` if the auth state is being loaded from storage. */
    isLoading,
    /** Function to set the authenticated user. */
    setAuth,
    /** Function to clear the authenticated user. */
    clearAuth,
  };
};
