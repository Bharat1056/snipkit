import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          username: profile.email.split('@')[0], 
          fullName: profile.name 
        };
      }
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }
        
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!existingUser) {
          throw new Error("No user found with this email");
        }
        
        if (!existingUser.password) {
          throw new Error("User has no password set");
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
          username: existingUser.username || null,
          fullName: existingUser.fullName || null,
          email: existingUser.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
        token.username = user.username || null;
        token.fullName = user.fullName || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Check if user exists in the database
        const userInDb = await db.user.findUnique({
          where: { id: token.id as string },
        });

        if (!userInDb) {
          // Invalidate session if user is not found
          throw new Error("User not found");
        }

        session.user.id = token.id as string;
        session.user.email = token.email || null;
        session.user.username = token.username;
        session.user.fullName = token.fullName;
      }
      return session;
    }
  }
};