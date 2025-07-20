import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Redirect errors to sign-in page
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const existingUser = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              username: true,
              fullName: true,
              password: true,
              createdAt: true,
            },
          });

          if (!existingUser) {
            throw new Error("No account found with this email address");
          }

          if (!existingUser.password) {
            throw new Error("This account was created using a different sign-in method");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          return {
            id: existingUser.id,
            username: existingUser.username,
            fullName: existingUser.fullName,
            email: existingUser.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Verify user still exists in database
        try {
          const userInDb = await db.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              username: true,
              fullName: true,
            },
          });

          if (!userInDb) {
            throw new Error("User not found");
          }

          session.user.id = userInDb.id;
          session.user.email = userInDb.email;
          session.user.username = userInDb.username;
          session.user.fullName = userInDb.fullName;
        } catch (error) {
          console.error("Session validation error:", error);
          throw new Error("Session invalid");
        }
      }
      return session;
    },
    async signIn({ user }) {
      // Additional sign-in validation can be added here
      return !!user;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      console.log(`User ${user.email} signed in${isNewUser ? ' (new user)' : ''}`);
    },
    async signOut({ token }) {
      console.log(`User ${token?.email} signed out`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};