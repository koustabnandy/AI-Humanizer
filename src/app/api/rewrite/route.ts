// src/app/api/rewrite/route.ts

import { NextResponse } from "next/server";
import { executeAiRewrite, RewriteOptions } from "@/lib/ai-providers";
import { prisma } from "@/lib/db";

// -----------------------------------------------------------------------------
// Temporary Authentication (Replace with NextAuth/Clerk in Production)
// -----------------------------------------------------------------------------
async function getAuthenticatedUser(req: Request) {
  return {
    id: "user_test_pro_id",
  };
}

export async function POST(req: Request) {
  try {
    // -------------------------------------------------------------------------
    // Authentication
    // -------------------------------------------------------------------------
    const user = await getAuthenticatedUser(req);

    console.log("Authenticated User:", user);

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized access",
        },
        {
          status: 401,
        }
      );
    }

    // -------------------------------------------------------------------------
    // Parse Request
    // -------------------------------------------------------------------------
    const body = await req.json();

    const {
      text,
      tone,
      length,
      creativity,
      modelProvider,
    } = body as RewriteOptions;

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Input text cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------------------------------------------------------
    // Check Subscription
    // -------------------------------------------------------------------------
    const accountSub = await prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
    });

    console.log("Subscription:", accountSub);

    if (!accountSub) {
      return NextResponse.json(
        {
          error: "Subscription not found.",
        },
        {
          status: 403,
        }
      );
    }

    if (accountSub.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "Subscription is not active.",
        },
        {
          status: 403,
        }
      );
    }

    if (accountSub.wordTokensRemaining <= 0) {
      return NextResponse.json(
        {
          error: "Insufficient word balance.",
        },
        {
          status: 403,
        }
      );
    }

    // -------------------------------------------------------------------------
    // Execute AI Rewrite
    // -------------------------------------------------------------------------
    const transformedText = await executeAiRewrite({
      text,
      tone,
      length,
      creativity,
      modelProvider,
    });

    const wordCount = transformedText
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    // -------------------------------------------------------------------------
    // Save History + Deduct Words
    // -------------------------------------------------------------------------
    await prisma.$transaction([
      prisma.rewriteHistory.create({
        data: {
          userId: user.id,
          originalText: text,
          transformedText,
          tone,
          lengthSetting: length,
          modelUsed: modelProvider,
          wordCount,
        },
      }),

      prisma.subscription.update({
        where: {
          userId: user.id,
        },
        data: {
          wordTokensRemaining: {
            decrement: Math.max(1, wordCount),
          },
        },
      }),
    ]);

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      transformedText,
      remainingWords:
        accountSub.wordTokensRemaining - Math.max(1, wordCount),
    });
  } catch (error: any) {
    console.error("========== REWRITE API ERROR ==========");
    console.error(error);
    console.error("=======================================");

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown Server Error",
      },
      {
        status: error?.status || 500,
      }
    );
  }
}