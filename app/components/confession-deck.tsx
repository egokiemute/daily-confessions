"use client";

import type { CSSProperties } from "react";
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import type { ConfessionEntry } from "@/app/confessions";
import { generateShareCard } from "@/app/lib/share-card";
import styles from "@/app/page.module.css";
import Link from "next/link";

type ConfessionDeckProps = {
  entries: ConfessionEntry[];
};

function getRandomIndex(currentIndex: number, total: number) {
  if (total <= 1) {
    return currentIndex;
  }

  let nextIndex = currentIndex;

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * total);
  }

  return nextIndex;
}

export function ConfessionDeck({ entries }: ConfessionDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pendingAction, setPendingAction] = useState<"download" | "share" | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  const entry = entries[activeIndex];
  const progress = ((activeIndex + 1) / entries.length) * 100;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(mediaQuery.matches);

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useLayoutEffect(() => {
    if (!shellRef.current || !cardRef.current || !numberRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const isMobileLayout = window.matchMedia("(max-width: 640px)").matches;
      const cardRotation = isMobileLayout ? -0.75 : -4;

      if (reducedMotion) {
        gsap.set([numberRef.current, cardRef.current], { clearProps: "all" });
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        numberRef.current,
        {
          opacity: 0,
          scale: 1.05,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
        },
      );

      timeline.fromTo(
        cardRef.current,
        {
          opacity: 0,
          yPercent: 10,
          rotate: cardRotation - 4,
          scale: 0.96,
        },
        {
          opacity: 1,
          yPercent: 0,
          rotate: cardRotation,
          scale: 1,
          duration: 0.9,
        },
        "-=0.55",
      );

      timeline.fromTo(
        "[data-animate]",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
        },
        "-=0.55",
      );
    }, shellRef);

    return () => ctx.revert();
  }, [activeIndex, reducedMotion]);

  const setIndex = (nextIndex: number) => {
    startTransition(() => {
      setActiveIndex(nextIndex);
    });
  };

  const showPrevious = () => {
    const nextIndex = activeIndex === 0 ? entries.length - 1 : activeIndex - 1;
    setIndex(nextIndex);
  };

  const showNext = () => {
    const nextIndex = activeIndex === entries.length - 1 ? 0 : activeIndex + 1;
    setIndex(nextIndex);
  };

  const shuffle = () => {
    setIndex(getRandomIndex(activeIndex, entries.length));
  };

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }

    if (event.key.toLowerCase() === "s") {
      shuffle();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!actionMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActionMessage(null);
    }, 3600);

    return () => window.clearTimeout(timeoutId);
  }, [actionMessage]);

  const getShareFile = async () => {
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const blob = await generateShareCard(entry, fontFamily);

    return new File([blob], `bcm-confession-${entry.number}.png`, {
      type: "image/png",
    });
  };

  const handleDownload = async () => {
    try {
      setPendingAction("download");
      setActionMessage(null);

      const file = await getShareFile();
      const objectUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(objectUrl);

      setActionMessage("Share card downloaded.");
    } catch {
      setActionMessage("Couldn't generate the download card right now.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleShare = async () => {
    try {
      setPendingAction("share");
      setActionMessage(null);

      const file = await getShareFile();
      const shareData = {
        title: `BCM Daily Confession ${entry.number}`,
        text: `${entry.title} — BCM Daily Confessions`,
        files: [file],
      };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setActionMessage("Share sheet opened.");
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: `BCM Daily Confession ${entry.number}`,
          text: `${entry.title} — ${window.location.href}`,
          url: window.location.href,
        });
        setActionMessage("Share sheet opened.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(objectUrl);

      setActionMessage("Sharing isn't supported here, so the card was downloaded instead.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setActionMessage("Share cancelled.");
      } else {
        setActionMessage("Couldn't open sharing right now.");
      }
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className={styles.experience} ref={shellRef}>
      <header className={styles.topbar}>
        <div className={styles.topbarCluster}>
          <span>Believers&apos; Camp</span>
          <span>Meeting</span>
        </div>
        <div className={styles.brand}>BCM Daily Confessions</div>
        <div className={styles.topbarCluster}>
          <Link href="https://www.morningstarword.org/" target="_blank">
            About MSCC
          </Link>
          <Link href="https://vomg.org/" target="_blank">
            VOMG
          </Link>
        </div>
      </header>

      <div className={styles.stage}>
        <div className={styles.stageBackdrop}>
          <span className={styles.backdropNumber} ref={numberRef}>
            {entry.number}
          </span>
          <div
            className={styles.glow}
            style={{ "--glow": entry.palette.glow } as CSSProperties}
          />
        </div>

        <aside className={styles.summaryPanel}>
          <p className={styles.summaryLabel}>Theme</p>
          <h1 className={styles.summaryTitle}>
            Daily Confessions About the Blood of Jesus
          </h1>
          <p className={styles.summaryText}>
            One confession per page, shaped after the editorial system in your
            PDF reference. Use the arrows, the buttons below, or press{" "}
            <span>←</span>, <span>→</span>, and <span>S</span>.
          </p>
        </aside>

        <article
          className={styles.card}
          ref={cardRef}
          style={
            {
              "--card": entry.palette.card,
            } as CSSProperties
          }
        >
          <div className={styles.cardGrid}>
            <div className={styles.cardMeta} data-animate="">
              <span>
                {entry.category} / {entry.theme}
              </span>
              <span>{entry.reference}</span>
            </div>

            <div className={styles.cardNumber} data-animate="">
              {entry.number}
            </div>

            <div className={styles.cardBody}>
              <p className={styles.kicker} data-animate="">
                {entry.category === "Power Declaration"
                  ? "Power Declaration"
                  : "Revelation 12:11"}
              </p>
              <h2 className={styles.cardTitle} data-animate="">
                {entry.title}
              </h2>
              <p className={styles.verse} data-animate="">
                {entry.verse}
              </p>

              <div className={styles.confessionBlock}>
                {entry.confession.map((line) => (
                  <p
                    key={line}
                    className={styles.confessionLine}
                    data-animate=""
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <footer className={styles.cardFooter} data-animate="">
              <div className={styles.footerTags}>
                <span>BCM Daily</span>
                <span>Blood of Jesus</span>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.shareButton}
                  type="button"
                  onClick={handleDownload}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === "download" ? "Preparing..." : "Download Card"}
                </button>
                <button
                  className={styles.shareButton}
                  type="button"
                  onClick={handleShare}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === "share" ? "Preparing..." : "Share Card"}
                </button>
              </div>
            </footer>
            {actionMessage ? (
              <p className={styles.actionMessage} data-animate="">
                {actionMessage}
              </p>
            ) : null}
          </div>
        </article>
      </div>

      <footer className={styles.controls}>
        <button
          className={styles.controlButton}
          type="button"
          onClick={showPrevious}
        >
          &larr; Prev
        </button>
        <div className={styles.progressCluster}>
          <span>{entry.number}</span>
          <div className={styles.progressTrack} aria-hidden="true">
            <span
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{entries[entries.length - 1].number}</span>
        </div>
        <button
          className={styles.controlButton}
          type="button"
          onClick={showNext}
        >
          Next &rarr;
        </button>
        <span className={styles.controlDivider} aria-hidden="true" />
        <button
          className={styles.controlButton}
          type="button"
          onClick={shuffle}
        >
          Shuffle
        </button>
      </footer>
    </div>
  );
}
