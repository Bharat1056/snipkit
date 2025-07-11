import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { s3Service } from "@/s3/service";
import { db } from "@/lib/db";
import { z } from "zod";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  filename: z.string().min(1, "Filename is required"),
  contentType: z.string().min(1, "Content type is required"),
  fileSize: z.number().positive("File size must be positive"),
  access: z.enum(["public", "private"]).default("public"),
  exploitLocation: z.string().min(1, "Exploit location is required"),
  language: z.enum(["JAVASCRIPT", "TYPESCRIPT", "PYTHON", "GO", "RUST", "JAVA"]),
  codeContent: z.string().optional(),
});

export async function POST(request: NextRequest) {
  console.log("Code upload request received");  
  try {
    // check for session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = uploadSchema.parse(body);

    // Get user info
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // slug generation
    const slug = `@${user.username}_${validatedData.slug}`

    // Check if slug already exists
    const existingCode = await db.code.findUnique({
      where: { slug },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Get presigned URL for upload
    const uploadResponse = await s3Service.uploadFile({
      username: user.username,
      filename: validatedData.filename,
      slug: slug,
      contentType: validatedData.contentType,
      fileSize: validatedData.fileSize,
    });

    // Create code record in database
    await db.code.create({
      data: {
        slug: slug,
        title: validatedData.title,
        description: validatedData.description,
        s3Key: uploadResponse.key,
        language: validatedData.language,
        exploitLocation: validatedData.exploitLocation,
        access: validatedData.access,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      uploadUrl: uploadResponse.uploadUrl,
    });
  } catch (error) {
    console.error("Code upload error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, slug, access } = body;
    if (!id && !slug) {
      return NextResponse.json({ error: "id or slug required" }, { status: 400 });
    }
    if (!["public", "private"].includes(access)) {
      return NextResponse.json({ error: "Invalid access value" }, { status: 400 });
    }
    // Find code by id or slug and ensure ownership
    const code = await db.code.findFirst({
      where: {
        ...(id ? { id } : {}),
        ...(slug ? { slug } : {}),
        userId: session.user.id,
      },
    });
    if (!code) {
      return NextResponse.json({ error: "Code not found or not owned by user" }, { status: 404 });
    }
    await db.code.update({
      where: { id: code.id },
      data: { access },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Code access update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, slug } = body;
    if (!id && !slug) {
      return NextResponse.json({ error: "id or slug required" }, { status: 400 });
    }
    // Find code by id or slug and ensure ownership
    const code = await db.code.findFirst({
      where: {
        ...(id ? { id } : {}),
        ...(slug ? { slug } : {}),
        userId: session.user.id,
      },
    });
    if (!code) {
      return NextResponse.json({ error: "Code not found or not owned by user" }, { status: 404 });
    }
    // Delete from S3 if s3Key exists
    if (code.s3Key) {
      try {
        await s3Service.deleteFile({ key: code.s3Key });
      } catch (s3Error) {
        // Log but do not block DB deletion
        console.error("S3 deletion error:", s3Error);
      }
    }
    // Delete from DB
    await db.code.delete({ where: { id: code.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Code deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 