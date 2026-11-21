"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import React, { useState, useRef } from "react";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClientTranslations } from "@/hooks/use-client-translations";
import { TURNSTILE_PUBLIC_KEY } from "@/utils/config";

import type { ContactFormData } from "./schema";

import { submitContactAction } from "../_actions/contact";
import { contactFormSchema } from "./schema";

export interface EnterpriseContactFormProps {
  successTitle: string;
  successMessageTemplate: string;
  submitAnotherButton: string;
  formTitle: string;
  labelFullName: string;
  labelWorkEmail: string;
  labelOrganization: string;
  labelQueryRequest: string;
  consentText: string;
  buttonProcessing: string;
  buttonSubmit: string;
  errorFailedSubmit: string;
  errorUnexpected: string;
  turnstileLabel: string;
}

export const EnterpriseContactForm = ({
  successTitle,
  successMessageTemplate,
  submitAnotherButton,
  formTitle,
  labelFullName,
  labelWorkEmail,
  labelOrganization,
  labelQueryRequest,
  consentText,
  buttonProcessing,
  buttonSubmit,
  errorFailedSubmit,
  errorUnexpected,
  turnstileLabel,
}: EnterpriseContactFormProps) => {
  const tErrors = useClientTranslations("errors");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Interactive Form States
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const translateError = (message: string) => {
    if (message.startsWith("errors.")) {
      const key = message.substring(7);
      // oxlint-disable-next-line typescript/no-explicit-any
      return tErrors(key as any);
    }
    return message;
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      queryRequest: "",
      consent: false,
      turnstileToken: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const result = await submitContactAction(value as ContactFormData);

        if (!result.success) {
          throw new Error(result.message || errorFailedSubmit);
        }

        setSubmitted(true);
        console.log("B2B waitlist registration succeeded:", result);
        // oxlint-disable-next-line typescript/no-explicit-any
      } catch (err: any) {
        console.error("Waitlist registration failed:", err);
        setErrorMessage(err.message || errorUnexpected);
        turnstileRef.current?.reset();
      } finally {
        setLoading(false);
      }
    },
  });

  return submitted ? (
    <div className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-6 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
          <Check className="size-4" />
        </div>
        <div className="w-full space-y-3 text-sm">
          <h3 className="text-base font-semibold tracking-tight">
            {successTitle}
          </h3>
          <p className="leading-relaxed">{successMessageTemplate}</p>
          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setErrorMessage(null);
                form.reset();
                turnstileRef.current?.reset();
              }}
              className="text-primary-700 dark:text-primary-400 cursor-pointer text-sm underline hover:no-underline"
            >
              {submitAnotherButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold tracking-tight">{formTitle}</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Error message banner */}
        {errorMessage && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Name Input */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const res = v.safeParse(contactFormSchema.entries.name, value);
              return res.success
                ? undefined
                : translateError(res.issues[0].message);
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label htmlFor={field.name} className="block text-sm font-medium">
                {labelFullName}
              </label>
              <Input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-9 px-3 text-sm md:text-sm"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Email Input */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const res = v.safeParse(contactFormSchema.entries.email, value);
              return res.success
                ? undefined
                : translateError(res.issues[0].message);
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label htmlFor={field.name} className="block text-sm font-medium">
                {labelWorkEmail}
              </label>
              <Input
                type="email"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-9 px-3 text-sm md:text-sm"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Organization Input */}
        <form.Field
          name="organization"
          validators={{
            onChange: ({ value }) => {
              const res = v.safeParse(
                contactFormSchema.entries.organization,
                value,
              );
              return res.success
                ? undefined
                : translateError(res.issues[0].message);
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label htmlFor={field.name} className="block text-sm font-medium">
                {labelOrganization}
              </label>
              <Input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-9 px-3 text-sm md:text-sm"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Textarea */}
        <form.Field name="queryRequest">
          {(field) => (
            <div className="space-y-1.5">
              <label htmlFor={field.name} className="block text-sm font-medium">
                {labelQueryRequest}
              </label>
              <Textarea
                id={field.name}
                name={field.name}
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="resize-none font-mono text-sm"
              />
            </div>
          )}
        </form.Field>

        {/* Cloudflare Turnstile */}
        <form.Field
          name="turnstileToken"
          validators={{
            onChange: ({ value }) => {
              const res = v.safeParse(
                contactFormSchema.entries.turnstileToken,
                value,
              );
              return res.success
                ? undefined
                : translateError(res.issues[0].message);
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <div className="block text-sm font-medium">{turnstileLabel}</div>
              <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 py-3 text-center select-none dark:border-zinc-800 dark:bg-zinc-900/40">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_PUBLIC_KEY}
                  onSuccess={(token) => field.handleChange(token)}
                  onExpire={() => field.handleChange("")}
                />
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="text-center text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Consent Checkbox */}
        <form.Field
          name="consent"
          validators={{
            onChange: ({ value }) => {
              const res = v.safeParse(contactFormSchema.entries.consent, value);
              return res.success
                ? undefined
                : translateError(res.issues[0].message);
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox
                  id={field.name}
                  name={field.name}
                  aria-labelledby={`${field.name}-label`}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                  className="mt-0.5 cursor-pointer"
                />
                <label
                  id={`${field.name}-label`}
                  htmlFor={field.name}
                  className="cursor-pointer text-sm leading-snug select-none"
                >
                  {consentText}
                </label>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            size={"lg"}
            className="w-full cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {buttonProcessing}
              </>
            ) : (
              <>
                {buttonSubmit}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
