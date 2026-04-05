import Image from "next/image";
import Link from "next/link";
import { TestimonyForm } from "@/app/components/testimony-form";
import styles from "@/app/testimony/testimony.module.css";

export const metadata = {
  title: "Submit Testimony | BCM 2026",
  description:
    "Receive testimonies from people currently in Believers' Camp Meeting 2026.",
};

export default function TestimonyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.sectionEyebrow}>BCM 2026</p>
            <h1>Testimony Portal for everyone currently in camp meeting.</h1>
            <p className={styles.lead}>
              If the Lord has visited you in any session, service, or encounter,
              share it here so it can be recorded and, with your permission,
              published on the BCM testimony wall.
            </p>

            <div className={styles.heroLinks}>
              <Link href="/">Back to confessions</Link>
              <Link href="/bcm26-testimonies">View testimony wall</Link>
            </div>
          </div>

          <div className={styles.visualPanel}>
            <Image
              src="/bcm/bcm-logo.png"
              alt="BCM 2026 Deliverers Camp Meeting"
              width={1997}
              height={1443}
              className={styles.logo}
              priority
            />
            {/* <Image
              src="/bcm/lowerthird.png"
              alt="BCM lower third"
              width={4800}
              height={826}
              className={styles.lowerThird}
            /> */}
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <TestimonyForm />
      </section>
    </main>
  );
}
