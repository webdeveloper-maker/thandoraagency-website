import type { Metadata } from "next";
import { ContactInfo } from "@/components/sections/contact/ContactInfo";
import { ContactIntro } from "@/components/sections/contact/ContactIntro";
import { EnquiryForm } from "@/components/sections/contact/EnquiryForm";
import styles from "@/styles/pages/contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Have something great in mind? We'd love to hear about it. Tell Thandora about your business goals.",
};

export default function ContactPage() {
  return (
    <>
      <section className={styles.top} aria-label="Enquiry">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.symbol} src="/images/contact-carved-symbol.svg" alt="" width={858} height={813} aria-hidden />
        <div className={styles.intro}>
          <ContactIntro />
        </div>
        <div className={styles.form}>
          <EnquiryForm />
        </div>
      </section>
      <ContactInfo />
    </>
  );
}
