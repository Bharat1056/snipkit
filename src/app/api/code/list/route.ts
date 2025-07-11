import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/s3/function";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const slug = searchParams.get("slug");
    const session = await getServerSession(authOptions);

    const access = searchParams.get("access");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    // If access=public, return all public code snippets with pagination
    if (access === "public") {
      const [total, code] = await Promise.all([
        db.code.count({ where: { 
          access: "public",
          ...(slug ? { slug: { contains: slug, mode: 'insensitive' } } : {}),
        } }),
        db.code.findMany({
          where: { 
            access: "public",
            ...(slug ? { slug: { contains: slug, mode: 'insensitive' } } : {}),
          },
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            language: true,
            exploitLocation: true,
            access: true,
            createdAt: true,
            s3Key: true,
            user: { select: { username: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        })
      ]);
      const codeWithUrls = await Promise.all(code.map(async (item) => ({
        ...item,
        downloadUrl: item.s3Key ? await getSignedDownloadUrl({ key: item.s3Key }) : null,
      })));
      return NextResponse.json({
        success: true,
        code: codeWithUrls,
        total,
        page,
        pageSize,
      });
    }

    // If username is provided, show that user's public code
    if (username) {
      const user = await db.user.findUnique({
        where: { username },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const code = await db.code.findMany({
        where: {
          userId: user.id,
          access: "public",
          ...(slug ? { slug: { contains: slug, mode: 'insensitive' } } : {}),
        },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          language: true,
          exploitLocation: true,
          access: true,
          createdAt: true,
          s3Key: true,
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Generate signed download URLs
      const codeWithUrls = await Promise.all(code.map(async (item) => ({
        ...item,
        downloadUrl: item.s3Key ? await getSignedDownloadUrl({ key: item.s3Key }) : null,
      })));

      return NextResponse.json({
        success: true,
        code: codeWithUrls,
      });
    }

    // If no username provided, show current user's code (requires authentication)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const total = await db.code.count({
      where: {
        userId: session.user.id,
        ...(slug ? { slug: { contains: slug, mode: 'insensitive' } } : {}),
      },
    });

    const code = await db.code.findMany({
      where: {
        userId: session.user.id,
        ...(slug ? { slug: { contains: slug, mode: 'insensitive' } } : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        language: true,
        exploitLocation: true,
        access: true,
        createdAt: true,
        s3Key: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const codeWithUrls = await Promise.all(code.map(async (item) => ({
      ...item,
      downloadUrl: item.s3Key ? await getSignedDownloadUrl({ key: item.s3Key }) : null,
    })));

    return NextResponse.json({
      success: true,
      code: codeWithUrls,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Code list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 