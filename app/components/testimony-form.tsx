"use client";

import { useState, useTransition } from "react";
import styles from "@/app/testimony/testimony.module.css";

type FormState = {
  fullName: string;
  phone: string;
  location: string;
  session: string;
  testimony: string;
  consentToShare: boolean;
  anonymousMode: boolean;
};

const initialState: FormState = {
  fullName: "",
  phone: "",
  location: "",
  session: "",
  testimony: "",
  consentToShare: true,
  anonymousMode: false,
};

export function TestimonyForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/testimonies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Unable to submit testimony.");
        }

        setForm(initialState);
        setMessage("Your testimony has been received. Thank you for sharing what God has done.");
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to submit testimony right now.",
        );
      }
    });
  };

  return (
    <form className={styles.formPanel} onSubmit={handleSubmit}>
      <div className={styles.formIntro}>
        <p className={styles.sectionEyebrow}>BCM Testimony Desk</p>
        <h2 className={styles.formTitle}>Share what God has done for you in camp meeting.</h2>
        <p className={styles.formCopy}>
          We will save every testimony submitted here. Only testimonies with sharing permission
          are shown publicly on the testimony wall.
        </p>
      </div>

      <label className={styles.toggleCard}>
        <input
          type="checkbox"
          checked={form.anonymousMode}
          onChange={(event) => updateField("anonymousMode", event.target.checked)}
        />
        <div>
          <strong>Anonymous mode</strong>
          <span>
            Turn this on if you want your public testimony card to hide your name and location.
          </span>
        </div>
      </label>

      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span>Full name</span>
          <input
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Your full name"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Phone or WhatsApp</span>
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Optional contact"
          />
        </label>

        <label className={styles.field}>
          <span>Church / location</span>
          <input
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Where you came from"
          />
        </label>

        <label className={styles.field}>
          <span>Service / session</span>
          <input
            value={form.session}
            onChange={(event) => updateField("session", event.target.value)}
            placeholder="Optional session reference"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Your testimony</span>
        <textarea
          value={form.testimony}
          onChange={(event) => updateField("testimony", event.target.value)}
          placeholder="Tell us what the Lord has done for you in camp meeting..."
          rows={8}
          required
        />
      </label>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={form.consentToShare}
          onChange={(event) => updateField("consentToShare", event.target.checked)}
        />
        <span>I permit BCM to publish and share this testimony publicly.</span>
      </label>

      {message ? <p className={styles.successMessage}>{message}</p> : null}
      {error ? <p className={styles.errorMessage}>{error}</p> : null}

      <div className={styles.formActions}>
        <button className={styles.primaryButton} type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Testimony"}
        </button>
      </div>
    </form>
  );
}
