import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const PAGE_SIZE = 9;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || `${PAGE_SIZE}`);

    const whereClause: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (type === "my" && session?.user?.id) {
      whereClause.authorId = session.user.id;
    } else {
      whereClause.access = "public";
    }

    const [total, codeList] = await Promise.all([
      db.code.count({ where: whereClause }),
      db.code.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: { username: true },
          },
          files: {
            select: {
              id: true,
              name: true,
              key: true,
              size: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        total,
        page,
        pageSize,
        data: codeList,
        totalPages: Math.ceil(total / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching code list:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
