"use server";

import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as v from "valibot";

import { ENTERPRISE_MAIL } from "@/utils/config";

import type { ContactFormData } from "../_components/schema";

import { contactFormSchema } from "../_components/schema";

export type SubmitResponse =
  | { success: true }
  | { success: false; message: string };

export async function submitContactAction(
  data: ContactFormData,
): Promise<SubmitResponse> {
  const context = getCloudflareContext();
  const env = context.env;

  try {
    if (!env.DONATION_WATCH_WAITLIST_DB) {
      throw new Error(
        "D1 Database binding (DONATION_WATCH_WAITLIST_DB) is not configured in this environment.",
      );
    }

    if (!env.TURNSTILE_SECRET_KEY) {
      throw new Error(
        "Turnstile secret key (TURNSTILE_SECRET_KEY) is not configured in environment variables.",
      );
    }

    if (!env.ENTERPRISE_EMAIL) {
      throw new Error(
        "Cloudflare Email binding (ENTERPRISE_EMAIL) is not configured in this environment.",
      );
    }

    // Server-side Valibot validation
    const payload = v.parse(contactFormSchema, data);

    // 1. Verify Turnstile Token
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: payload.turnstileToken,
        }),
      },
    );

    const verifyResult: { success: boolean } = await verifyResponse.json();
    if (!verifyResult.success) {
      return {
        success: false,
        message:
          "Security verification check failed. Please refresh and try again.",
      };
    }

    // 2. Store submission in Cloudflare D1 Database
    const db = env.DONATION_WATCH_WAITLIST_DB;
    await db
      .prepare(
        `INSERT INTO enterprise_waitlist (name, email, organization, query_request) 
         VALUES (?, ?, ?, ?)`,
      )
      .bind(
        payload.name,
        payload.email,
        payload.organization,
        payload.queryRequest || null,
      )
      .run();

    // 3. Compose plain text emails
    const fromAddress = ENTERPRISE_MAIL;

    // Admin notification Text
    const adminText = `NEW B2B LEAD REGISTERED
    
A new enterprise beta waitlist submission has been received:

Name:          ${payload.name}
Email:         ${payload.email}
Organization:  ${payload.organization}
Query Request: ${payload.queryRequest || "None specified"}
    `;

    // 4. Send email notification
    try {
      // Dispatch to admin team
      await env.ENTERPRISE_EMAIL.send({
        from: fromAddress,
        to: ENTERPRISE_MAIL,
        replyTo: payload.email,
        subject: `[New B2B Lead] ${payload.organization} - ${payload.name}`,
        text: adminText,
      });
    } catch (emailError) {
      console.error(
        "Failed to send emails via Cloudflare Email binding:",
        emailError,
      );
    }

    return { success: true };
    // oxlint-disable-next-line typescript/no-explicit-any
  } catch (error: any) {
    console.error("Contact Form Action Error:", error);

    // Custom Valibot schema error formatting
    if (v.isValiError(error)) {
      return {
        success: false,
        message: "Provided input data is invalid.",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred on the server. Please try again.",
    };
  }
}
