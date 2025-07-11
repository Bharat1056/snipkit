import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/s3/function";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const uploadSchema = z.object({
    slug: z.string().min(1, "Slug is required"),
    filename: z.string().min(1, "Filename is required"),
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = uploadSchema.parse(body)

        if(!validatedData) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            )
        }

        const existingCode = await db.code.findFirst({
            where: {
                slug: validatedData.slug,
            }
        })

        if(!existingCode) {
            return NextResponse.json(
                { error: "Code doesn't exist" },
                { status: 400 }
            )
        }

        const signedUrl = await getSignedDownloadUrl({
            key: existingCode.s3Key,
        })

        await db.code.update({
            where: {
                id: existingCode.id,
            },
            data: {
                // Note: Code model doesn't have signedUrl field, so we'll skip this
                // The signed URL will be generated on-demand when needed
            }
        })

        return NextResponse.json({
            success: true,
            signedUrl,
        })

    } catch (error) {
        console.error("Code upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 