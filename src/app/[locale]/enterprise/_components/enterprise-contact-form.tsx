"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import React, { useState, useRef } from "react";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
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
    <div className="w-full rounded-none border border-zinc-900 bg-zinc-50 p-6 transition-all duration-200 md:p-8 dark:border-zinc-100 dark:bg-zinc-900/40">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-none border border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4" />
        </div>
        <div className="w-full space-y-4 text-sm">
          <div>
            <h3 className="font-mono text-sm font-bold tracking-widest text-zinc-900 uppercase dark:text-zinc-100">
              {successTitle}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {successMessageTemplate}
          </p>
          <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
            <button
              onClick={() => {
                setSubmitted(false);
                setErrorMessage(null);
                form.reset();
                turnstileRef.current?.reset();
              }}
              className="cursor-pointer font-mono text-sm text-zinc-500 underline decoration-dotted hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {submitAnotherButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <h3 className="font-mono text-sm font-bold tracking-widest text-zinc-900 uppercase dark:text-zinc-100">
        {formTitle}
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        {/* Error message banner */}
        {errorMessage && (
          <div className="border border-red-500 bg-red-500/10 p-3 font-mono text-xs text-red-500 dark:text-red-400">
            &gt; ERROR: {errorMessage}
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
              <label
                htmlFor={field.name}
                className="block font-mono text-sm font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
              >
                {labelFullName}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-none border border-zinc-300 bg-transparent px-3 py-2.5 text-sm text-zinc-900 transition-colors focus:border-black focus:ring-1 focus:ring-black focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 font-mono text-xs text-red-500 dark:text-red-400">
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
              <label
                htmlFor={field.name}
                className="block font-mono text-sm font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
              >
                {labelWorkEmail}
              </label>
              <input
                type="email"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-none border border-zinc-300 bg-transparent px-3 py-2.5 text-sm text-zinc-900 transition-colors focus:border-black focus:ring-1 focus:ring-black focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 font-mono text-xs text-red-500 dark:text-red-400">
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
              <label
                htmlFor={field.name}
                className="block font-mono text-sm font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
              >
                {labelOrganization}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-none border border-zinc-300 bg-transparent px-3 py-2.5 text-sm text-zinc-900 transition-colors focus:border-black focus:ring-1 focus:ring-black focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 font-mono text-xs text-red-500 dark:text-red-400">
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
              <label
                htmlFor={field.name}
                className="block font-mono text-sm font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
              >
                {labelQueryRequest}{" "}
              </label>
              <textarea
                id={field.name}
                name={field.name}
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full resize-none rounded-none border border-zinc-300 bg-transparent px-3 py-2.5 font-mono text-sm text-zinc-900 transition-colors focus:border-black focus:ring-1 focus:ring-black focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
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
              <div className="block font-mono text-sm font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                {turnstileLabel}
              </div>
              <div className="pt-2">
                <div className="border border-dashed border-zinc-300 bg-zinc-50 py-4 text-center font-mono text-sm text-zinc-500 select-none dark:border-zinc-800 dark:bg-zinc-900/40">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_PUBLIC_KEY}
                    onSuccess={(token) => field.handleChange(token)}
                    onExpire={() => field.handleChange("")}
                  />
                </div>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 text-center font-mono text-xs text-red-500 dark:text-red-400">
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
                <div className="mt-0.5 flex h-4 items-center">
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded-none border-zinc-300 bg-transparent text-black accent-black focus:ring-0 focus:ring-offset-0 focus:outline-none dark:border-zinc-800 dark:text-white dark:accent-white"
                  />
                </div>
                <label
                  htmlFor={field.name}
                  className="cursor-pointer text-sm leading-snug text-zinc-500 select-none dark:text-zinc-400"
                >
                  {consentText}
                </label>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 font-mono text-xs text-red-500 dark:text-red-400">
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
                <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                {buttonProcessing}
              </>
            ) : (
              <>
                {buttonSubmit}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
