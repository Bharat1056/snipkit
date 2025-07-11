import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prettier from "prettier";

// Accept only these languages:
const formatSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.enum(["JAVASCRIPT", "TYPESCRIPT", "PYTHON", "GO", "RUST", "HTML", "CSS"]),
});

async function formatWithPrettier(code: string, language: "JAVASCRIPT" | "TYPESCRIPT" | "HTML" | "CSS") {
  const parser = language === "TYPESCRIPT" ? "typescript" : language === "HTML" ? "html" : language === "CSS" ? "css" : "babel";
  try {
    return await prettier.format(code, { parser });
  } catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // fallback to original code if prettier fails
    return code;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = formatSchema.parse(body);

    let formattedCode = validatedData.code;

    if (validatedData.language === "JAVASCRIPT" || validatedData.language === "TYPESCRIPT") {
      formattedCode = await formatWithPrettier(validatedData.code, validatedData.language);
    }
    // For PYTHON, GO, RUST: just return code as is

    return NextResponse.json({
      success: true,
      formattedCode,
    });
  } catch (error) {
    console.error("Code format error:", error);
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
