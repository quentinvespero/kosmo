import { BackButton } from "@/components/ui/BackButton"

export const metadata = {
    title: "Terms of Service — Kosmo",
    description: "The rules and conditions governing your use of Kosmo.",
}

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen">
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
                <BackButton />

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground text-sm">Last updated: April 20, 2026</p>
                </div>

                <Section title="1. Acceptance of terms">
                    <p>
                        By creating an account or using Kosmo (&quot;the Service&quot;), you agree to
                        these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the
                        Service.
                    </p>
                    <p>
                        The Service is operated by{" "}
                        <strong>Quentin Artaud</strong> (&quot;we&quot;,
                        &quot;us&quot;, &quot;our&quot;), <strong>Paris, France</strong>.
                    </p>
                </Section>

                <Section title="2. Eligibility">
                    <p>You must be at least 13 years old to use Kosmo.</p>
                    <p>
                        If you are under 16 (or the minimum digital consent age in your country), you
                        confirm that you have obtained parental or guardian consent.
                    </p>
                    <p>
                        By using the Service, you represent that the information you provide is accurate
                        and that you have the legal capacity to enter into these Terms.
                    </p>
                </Section>

                <Section title="3. Your account">
                    <p>
                        You are responsible for maintaining the security of your account. Since Kosmo
                        uses passwordless authentication (magic links sent to your email), you should
                        ensure your email account is secure.
                    </p>
                    <p>
                        You must not share your sign-in links with others. You are responsible for all
                        activity that occurs under your account.
                    </p>
                    <p>
                        You may delete your account at any time from your account settings. Upon
                        deletion, your personal data will be removed as described in our{" "}
                        <a href="/privacy" className="underline underline-offset-2">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </Section>

                <Section title="4. User content">
                    <p>
                        &quot;Content&quot; means anything you post, submit, or share on Kosmo, including
                        posts, comments, votes, and profile information.
                    </p>
                    <SubSection title="Ownership">
                        <p>
                            You retain ownership of the content you create. By posting content on Kosmo,
                            you grant us a non-exclusive, worldwide, royalty-free licence to store,
                            display, and distribute that content solely for the purpose of operating and
                            improving the Service.
                        </p>
                    </SubSection>
                    <SubSection title="Your responsibilities">
                        <p>You are solely responsible for the content you post. You confirm that:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>you own or have the rights to share the content</li>
                            <li>
                                the content does not infringe any third-party intellectual property rights
                            </li>
                            <li>the content complies with applicable law</li>
                        </ul>
                    </SubSection>
                </Section>

                <Section title="5. Prohibited conduct">
                    <p>You agree not to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Post content that is illegal, hateful, defamatory, threatening, harassing, or
                            discriminatory
                        </li>
                        <li>
                            Post content that constitutes spam, unsolicited commercial messages, or
                            pyramid schemes
                        </li>
                        <li>
                            Post content that contains malware, phishing links, or other malicious code
                        </li>
                        <li>
                            Impersonate any person or entity, or misrepresent your affiliation with any
                            person or entity
                        </li>
                        <li>
                            Scrape, crawl, or otherwise systematically extract data from the Service
                            without our prior written consent
                        </li>
                        <li>
                            Attempt to gain unauthorised access to any part of the Service or its
                            infrastructure
                        </li>
                        <li>Use the Service in any way that could damage, disable, or impair it</li>
                        <li>
                            Create multiple accounts to evade a suspension or circumvent any restrictions
                        </li>
                        <li>Post sexual content involving minors</li>
                    </ul>
                    <p>
                        We reserve the right to remove content that violates these rules and to suspend
                        or terminate accounts that repeatedly or seriously breach them.
                    </p>
                </Section>

                <Section title="6. Content moderation">
                    <p>
                        We may (but are not obligated to) review, edit, or remove content that we
                        believe violates these Terms or applicable law.
                    </p>
                    <p>
                        If you believe content on Kosmo violates these Terms or your legal rights,
                        contact us at{" "}
                        <a href="mailto:qtn.lab+kosmo@gmail.com" className="underline underline-offset-2">
                            qtn.lab+kosmo@gmail.com
                        </a>
                        .
                    </p>
                </Section>

                <Section title="7. Intellectual property">
                    <p>
                        The Kosmo name, logo, and all software, design, and original content produced
                        by us are our intellectual property and may not be copied, reproduced, or
                        distributed without our prior written consent.
                    </p>
                </Section>

                <Section title="8. Disclaimers">
                    <p>
                        The Service is provided &quot;as is&quot; and &quot;as available&quot; without
                        warranties of any kind, express or implied.
                    </p>
                    <p>
                        We do not warrant that the Service will be uninterrupted, error-free, or free of
                        viruses or other harmful components.
                    </p>
                    <p>
                        We are not responsible for user-generated content published on the Service.
                    </p>
                </Section>

                <Section title="9. Limitation of liability">
                    <p>
                        To the maximum extent permitted by applicable law, we shall not be liable for
                        any indirect, incidental, special, consequential, or punitive damages arising
                        from your use of, or inability to use, the Service.
                    </p>
                    <p>
                        Our total aggregate liability to you for any claim arising out of these Terms
                        shall not exceed the amount you have paid us in the 12 months preceding the
                        claim (which may be zero, as Kosmo is currently free to use).
                    </p>
                </Section>

                <Section title="10. Termination">
                    <p>
                        You may stop using the Service at any time and delete your account from your
                        settings.
                    </p>
                    <p>
                        We may suspend or terminate your access if you breach these Terms, if required
                        by law, or at our discretion with reasonable notice where possible. In the event
                        of serious or illegal conduct, termination may be immediate.
                    </p>
                </Section>

                <Section title="11. Governing law & disputes">
                    <p>
                        These Terms are governed by the laws of France, without regard to its conflict
                        of laws provisions.
                    </p>
                    <p>
                        If you are a consumer resident in the EU, you also benefit from the mandatory
                        protections of the consumer law of your country of residence.
                    </p>
                    <p>
                        In the event of a dispute, we encourage you to contact us first at{" "}
                        <a href="mailto:qtn.lab+kosmo@gmail.com" className="underline underline-offset-2">
                            qtn.lab+kosmo@gmail.com
                        </a>{" "}
                        so we can try to resolve it amicably. You may also use the EU Online Dispute
                        Resolution platform at{" "}
                        <a
                            href="https://ec.europa.eu/consumers/odr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                        >
                            ec.europa.eu/consumers/odr
                        </a>
                        .
                    </p>
                </Section>

                <Section title="12. Changes to these terms">
                    <p>
                        We may update these Terms from time to time. We will notify you by email at
                        least 14 days before significant changes take effect. Continued use of the
                        Service after changes constitutes acceptance of the updated Terms.
                    </p>
                </Section>

                <Section title="13. Contact">
                    <p>
                        Questions about these Terms:{" "}
                        <a href="mailto:qtn.lab+kosmo@gmail.com" className="underline underline-offset-2">
                            qtn.lab+kosmo@gmail.com
                        </a>
                    </p>
                </Section>
            </div>
        </main>
    )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="space-y-3 text-sm leading-relaxed text-foreground/80">{children}</div>
    </section>
)

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-1">
        <h3 className="font-medium text-foreground">{title}</h3>
        {children}
    </div>
)
