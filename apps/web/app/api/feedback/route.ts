import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import db from "@repo/db";
import { feedback } from "@repo/db/schema";
import { auth } from "@/lib/auth";

const feedbackSchema = z.object({
  category: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the input data
    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid feedback data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { category, rating, comment } = result.data;

    // Get user session if available
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    const userId = session?.user?.id;

    // Insert feedback into the database
    await db.insert(feedback).values({
      id: randomUUID(),
      userId: userId || null,
      category,
      rating,
      comment,
      createdAt: new Date(),
      ipAddress: req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null,
      userAgent: req.headers.get("user-agent") || null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
} 