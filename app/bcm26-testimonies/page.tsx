import Image from "next/image";
import Link from "next/link";
import { TestimoniesGallery } from "@/app/components/testimonies-gallery";
import { getPublicTestimonies } from "@/app/lib/testimonies";
import styles from "@/app/bcm26-testimonies/testimonies.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "BCM 2026 Testimonies",
  description: "View public testimonies from Believers' Camp Meeting 2026.",
};

export default async function BCM26TestimoniesPage() {
  const testimonies = await getPublicTestimonies();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroTopline}>
          <Link href="/">Confessions</Link>
          <Link href="/testimony">Submit testimony</Link>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <p className={styles.sectionEyebrow}>Public Testimony Wall</p>
            <h1>BCM 2026 testimonies worth sharing.</h1>
            <p className={styles.heroText}>
              Every testimony here was submitted from camp meeting and marked
              safe for public sharing. Download each one as a BCM-branded social
              card.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/bcm/bcm-logo.png"
              alt="BCM 2026 Deliverers Camp Meeting"
              width={1997}
              height={1443}
              className={styles.heroLogo}
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.wallSection}>
        <div className={styles.wallHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Live Count</p>
            <h2>{testimonies.length} public testimonies</h2>
          </div>
          {/* <Image
            src="/bcm/lowerthird.png"
            alt="BCM lower third"
            width={4800}
            height={826}
            className={styles.wallRibbon}
          /> */}
        </div>

        <TestimoniesGallery testimonies={testimonies} />
      </section>
    </main>
  );
}
