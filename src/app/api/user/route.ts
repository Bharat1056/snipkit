import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
// import { hash } from "bcryptjs";
import bcrypt from "bcryptjs";

import * as z from "zod";

const userSchema = z.object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    fullName: z.string().min(1, "Full name is required"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must have at least 8 characters"),});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password, fullName } = userSchema.parse(body);

        // Check if a user with the same email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            return NextResponse.json(
                {
                    user: null,
                    message: "User with this email already exists",
                },
                { status: 409 }
            );
        }

        // Check if a user with the same username already exists
        const existingUserByUsername = await db.user.findUnique({
            where: { username },
        });

        if (existingUserByUsername) {
            return NextResponse.json(
                {
                    user: null,
                    message: "User with this username already exists",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                fullName,
            },
        });

        // Remove password before sending response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                user: userWithoutPassword,
                message: "User created successfully",
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}