"use client";

/* eslint-disable react-hooks/incompatible-library --
   react-hook-form manages its own subscription model; the React Compiler
   skipping memoization for this component is expected and harmless. */

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { submitLead } from "@/app/actions/lead";
import { budgetLabels, budgetOptions, leadInputSchema } from "@/lib/schemas/lead";
import { readAttribution } from "@/lib/analytics/client-ids";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/format";

const formSchema = z.object({
  name: leadInputSchema.shape.name,
  email: leadInputSchema.shape.email,
  services: z.array(z.string().max(80)),
  budget: leadInputSchema.shape.budget,
  message: leadInputSchema.shape.message,
});
type FormValues = z.infer<typeof formSchema>;

const inputClass = cn(
  "w-full rounded-2xl bg-white/[0.04] px-5 py-3.5 text-ink ring-1 ring-white/12",
  "placeholder:text-ink-faint transition-shadow duration-300 ease-swift",
  "focus:outline-none focus:ring-2 focus:ring-aurora-cyan/60",
);

/**
 * Two-step lead form: (1) name + work email, (2) services, budget, message.
 * Honeypot + time-trap ride along invisibly; attribution comes from the
 * first-party tracker's ids so every lead links to its visitor journey.
 */
export function LeadForm({
  services,
  calendlyUrl,
}: {
  services: { slug: string; name: string }[];
  calendlyUrl: string;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { services: [], message: "" },
    mode: "onTouched",
  });

  const chosen = watch("services");

  async function next() {
    const valid = await trigger(["name", "email"]);
    if (valid) setStep(1);
  }

  const onSubmit = handleSubmit(async (values) => {
    setState("submitting");
    setServerError("");
    const attribution = readAttribution();
    const result = await submitLead({
      ...values,
      website: honeypotRef.current?.value ?? "",
      startedAt: startedAt.current,
      attribution: {
        ...attribution,
        path: window.location.pathname + window.location.search,
        referrer: attribution.referrer ?? document.referrer ?? "",
      },
    });
    if (result.ok) {
      setState("done");
      try {
        window.dispatchEvent(new CustomEvent("mbt:track", { detail: { t: "form_submit" } }));
      } catch {}
    } else {
      setState("error");
      setServerError(result.error);
    }
  });

  if (state === "done") {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-5 p-2" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-aurora-teal/10 ring-1 ring-aurora-teal/40">
          <CheckCircle weight="light" className="size-7 text-aurora-teal" />
        </span>
        <h3 className="font-display text-2xl font-medium">Got it — thank you.</h3>
        <p className="max-w-sm leading-relaxed text-ink-muted">
          Your message is in our inbox. A senior engineer (not a sales rep) will reply within
          one business day.
        </p>
        {calendlyUrl && (
          <div className="mt-2">
            <p className="mb-3 text-sm text-ink-faint">Want to skip the queue?</p>
            <Button href={calendlyUrl} target="_blank" cta="success-calendly">
              Grab a slot now
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Project inquiry"
      onFocusCapture={() => {
        try {
          window.dispatchEvent(new CustomEvent("mbt:track", { detail: { t: "form_start" } }));
        } catch {}
      }}
    >
      {/* Honeypot — humans never see or fill this. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          ref={honeypotRef}
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mb-8 flex items-center gap-3" aria-hidden="true">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-400 ease-swift",
              i <= step ? "bg-gradient-to-r from-aurora-cyan to-aurora-violet" : "bg-white/10",
            )}
          />
        ))}
      </div>
      <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
        Step {step + 1} of 2 — {step === 0 ? "who you are" : "what you need"}
      </p>

      {step === 0 ? (
        <div className="space-y-5">
          <div>
            <label htmlFor="lead-name" className="mb-2 block text-sm text-ink-muted">
              Your name
            </label>
            <input
              id="lead-name"
              className={inputClass}
              placeholder="Ada Lovelace"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "lead-name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="lead-name-error" className="mt-2 text-sm text-[#ff9d9d]" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lead-email" className="mb-2 block text-sm text-ink-muted">
              Work email
            </label>
            <input
              id="lead-email"
              type="email"
              className={inputClass}
              placeholder="you@company.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "lead-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="lead-email-error" className="mt-2 text-sm text-[#ff9d9d]" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button type="button" onClick={next} className="mt-2" magnetic={false} cta="form-step1">
            Continue
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <fieldset>
            <legend className="mb-3 block text-sm text-ink-muted">
              What do you need? <span className="text-ink-faint">(pick any)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => {
                const active = chosen?.includes(s.slug);
                return (
                  <button
                    key={s.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setValue(
                        "services",
                        active
                          ? (chosen ?? []).filter((x) => x !== s.slug)
                          : [...(chosen ?? []), s.slug],
                        { shouldValidate: false },
                      )
                    }
                    className={cn(
                      "rounded-full px-4 py-2 text-sm ring-1 transition-all duration-300 ease-swift",
                      active
                        ? "bg-aurora-teal/15 text-aurora-teal ring-aurora-teal/50"
                        : "text-ink-muted ring-white/12 hover:bg-white/5 hover:text-ink",
                    )}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="lead-budget" className="mb-2 block text-sm text-ink-muted">
              Budget range <span className="text-ink-faint">(optional)</span>
            </label>
            <select
              id="lead-budget"
              className={cn(inputClass, "appearance-none bg-surface")}
              defaultValue=""
              {...register("budget", { setValueAs: (v) => (v === "" ? undefined : v) })}
            >
              <option value="">Prefer not to say</option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>
                  {budgetLabels[b]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lead-message" className="mb-2 block text-sm text-ink-muted">
              About the project
            </label>
            <textarea
              id="lead-message"
              rows={5}
              className={cn(inputClass, "resize-y")}
              placeholder="What are you building, and what should it change for your business?"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "lead-message-error" : undefined}
              {...register("message")}
            />
            {errors.message && (
              <p id="lead-message-error" className="mt-2 text-sm text-[#ff9d9d]" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="rounded-xl bg-[#3a1420]/60 px-4 py-3 text-sm text-[#ff9d9d] ring-1 ring-[#ff9d9d]/25" role="alert">
              {serverError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft weight="bold" className="size-4" aria-hidden="true" /> Back
            </button>
            <Button type="submit" disabled={state === "submitting"} magnetic={false} cta="form-submit">
              {state === "submitting" ? "Sending…" : "Send inquiry"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
