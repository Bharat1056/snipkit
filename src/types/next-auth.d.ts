/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
export {};
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      username: string | null;
      fullName: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string | null;
    username: string | null;
    fullName: string | null;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string | null;
    username: string | null;
    fullName: string | null;
    name?: string | null;
    picture?: string | null;
  }
}
