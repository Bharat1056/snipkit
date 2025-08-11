export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: string;
  updatedAt: string;
  image?: string | null;
  username: string;
  expiresAt: string;
  ipAddress: string | null;
};

export type AuthState = {
  user: User | null;
  isRehydrated: boolean;
};

