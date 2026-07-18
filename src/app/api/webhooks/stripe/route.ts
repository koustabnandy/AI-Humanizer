// src/app/api/webhooks/stripe/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

// -----------------------------------------------------------------------------
// Environment Validation
// -----------------------------------------------------------------------------

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

// -----------------------------------------------------------------------------
// Stripe Client
// -----------------------------------------------------------------------------

const stripe = new Stripe(stripeSecretKey);

// -----------------------------------------------------------------------------
// Webhook Handler
// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe Signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error("[STRIPE_WEBHOOK_ERROR]", err.message);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  const session = event.data.object as any;

  try {
    switch (event.type) {
      // ============================================================
      // Checkout Completed
      // ============================================================

      case "checkout.session.completed": {
        const customerUserId = session.metadata?.userId;

        if (!customerUserId) break;

        await prisma.$transaction([
          prisma.subscription.upsert({
            where: {
              userId: customerUserId,
            },

            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              tier: "PRO",
              status: "ACTIVE",
              wordTokensRemaining: 500000,
            },

            create: {
              userId: customerUserId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              tier: "PRO",
              status: "ACTIVE",
              wordTokensRemaining: 500000,
            },
          }),

          prisma.payment.create({
            data: {
              userId: customerUserId,
              stripeInvoiceId:
                session.payment_intent ??
                session.id,
              amount: session.amount_total ?? 0,
              currency: session.currency ?? "usd",
              status: "PAID",
            },
          }),
        ]);

        break;
      }

      // ============================================================
      // Monthly Renewal
      // ============================================================

      case "invoice.payment_succeeded": {
        if (!session.subscription) break;

        await prisma.subscription.updateMany({
          where: {
            stripeSubscriptionId: session.subscription,
          },

          data: {
            status: "ACTIVE",
            wordTokensRemaining: 500000,
          },
        });

        break;
      }

      // ============================================================
      // Subscription Cancelled
      // ============================================================

      case "customer.subscription.deleted":

      case "invoice.payment_failed": {
        if (!session.subscription) break;

        await prisma.subscription.updateMany({
          where: {
            stripeSubscriptionId: session.subscription,
          },

          data: {
            status: "CANCELED",
            tier: "FREE",
            wordTokensRemaining: 5000,
          },
        });

        break;
      }

      // ============================================================

      default:
        console.log(`Unhandled Event: ${event.type}`);
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("[WEBHOOK_DATABASE_ERROR]", err);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}