import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { isDisposableEmail } from "@/lib/validations/auth";

const userSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must not exceed 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email")
        .max(255, "Email is too long"),
    fullName: z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name is too long")
        .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, apostrophes, and hyphens"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Validate input data
        const validation = userSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    user: null,
                    message: "Invalid input data",
                    errors: validation.error.errors
                },
                { status: 400 }
            );
        }

        const { email, username, password, fullName } = validation.data;

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedUsername = username.trim();
        const normalizedFullName = fullName.trim();

        // Check for disposable email
        if (isDisposableEmail(normalizedEmail)) {
            return NextResponse.json(
                {
                    user: null,
                    message: "Temporary or disposable email addresses are not allowed. Please use a permanent email address.",
                },
                { status: 400 }
            );
        }

        // Check if a user with the same email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUserByEmail) {
            return NextResponse.json(
                {
                    user: null,
                    message: "An account with this email address already exists",
                },
                { status: 409 }
            );
        }

        // Check if a user with the same username already exists
        const existingUserByUsername = await db.user.findUnique({
            where: { username: normalizedUsername },
        });

        if (existingUserByUsername) {
            return NextResponse.json(
                {
                    user: null,
                    message: "This username is already taken",
                },
                { status: 409 }
            );
        }

        // Hash password with higher cost factor for better security
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await db.user.create({
            data: {
                email: normalizedEmail,
                username: normalizedUsername,
                password: hashedPassword,
                fullName: normalizedFullName,
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user; // eslint-disable-line @typescript-eslint/no-unused-vars

        return NextResponse.json(
            {
                user: userWithoutPassword,
                message: "Account created successfully",
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json(
            {
                user: null,
                message: "Internal server error. Please try again later.",
            },
            { status: 500 }
        );
    }
}