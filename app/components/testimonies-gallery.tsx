"use client";

import { useEffect, useState } from "react";
import type { TestimonyRecord } from "@/app/lib/testimony-types";
import { generateTestimonyCard } from "@/app/lib/testimony-card";
import styles from "@/app/bcm26-testimonies/testimonies.module.css";

type TestimoniesGalleryProps = {
  testimonies: TestimonyRecord[];
};

export function TestimoniesGallery({ testimonies }: TestimoniesGalleryProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => setMessage(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const createFile = async (testimony: TestimonyRecord) => {
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const blob = await generateTestimonyCard(testimony, fontFamily);
    const safeName = testimony.fullName.replace(/\s+/g, "-").toLowerCase() || "anonymous";

    return new File([blob], `bcm-testimony-${safeName}.png`, { type: "image/png" });
  };

  const downloadTestimony = async (testimony: TestimonyRecord) => {
    try {
      setPendingId(testimony.id);
      setMessage(null);

      const file = await createFile(testimony);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);

      setMessage("Testimony card downloaded.");
    } catch {
      setMessage("Couldn't generate the testimony card right now.");
    } finally {
      setPendingId(null);
    }
  };

  const shareTestimony = async (testimony: TestimonyRecord) => {
    try {
      setPendingId(testimony.id);
      setMessage(null);

      const file = await createFile(testimony);
      const shareData = {
        title: `${testimony.fullName}'s BCM testimony`,
        text: testimony.testimony,
        files: [file],
      };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setMessage("Share sheet opened.");
        return;
      }

      await downloadTestimony(testimony);
      setMessage("Sharing is limited here, so the testimony card was downloaded instead.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setMessage("Share cancelled.");
      } else {
        setMessage("Couldn't open sharing right now.");
      }
    } finally {
      setPendingId(null);
    }
  };

  if (!testimonies.length) {
    return (
      <div className={styles.emptyState}>
        <h2>No public testimonies yet.</h2>
        <p>The testimony wall will light up here as camp meeting testimonies come in.</p>
      </div>
    );
  }

  return (
    <div className={styles.galleryShell}>
      {message ? <p className={styles.galleryMessage}>{message}</p> : null}
      <div className={styles.galleryGrid}>
        {testimonies.map((testimony) => (
          <article key={testimony.id} className={styles.testimonyCard}>
            <div className={styles.testimonyMeta}>
              <span>{new Date(testimony.createdAt).toLocaleDateString()}</span>
              <span>{testimony.session || "Camp meeting"}</span>
            </div>

            <h2>{testimony.fullName}</h2>

            <p className={styles.testimonyLocation}>
              {[testimony.location, testimony.phone].filter(Boolean).join(" // ") ||
                (testimony.anonymousMode ? "Shared anonymously at Believers' Camp Meeting" : "Believers' Camp Meeting")}
            </p>

            <p className={styles.testimonyText}>{testimony.testimony}</p>

            <div className={styles.galleryActions}>
              <button
                className={styles.galleryButton}
                type="button"
                onClick={() => downloadTestimony(testimony)}
                disabled={pendingId === testimony.id}
              >
                {pendingId === testimony.id ? "Preparing..." : "Download Card"}
              </button>
              <button
                className={styles.galleryButton}
                type="button"
                onClick={() => shareTestimony(testimony)}
                disabled={pendingId === testimony.id}
              >
                {pendingId === testimony.id ? "Preparing..." : "Share"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
