import { BackButton } from "@/components/ui/BackButton"

export const metadata = {
    title: "Privacy Policy — Kosmo",
    description: "How Kosmo collects, uses, and protects your personal data.",
}

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen">
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
                <BackButton />

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground text-sm">Last updated: April 20, 2026</p>
                </div>

                <Section title="1. Who we are">
                    <p>
                        Kosmo (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a social network operated by{" "}
                        <strong>Quentin Artaud</strong>,{" "}
                        <strong>Paris, France</strong>.
                    </p>
                    <p>
                        For any privacy-related questions, contact us at:{" "}
                        <a href="mailto:qtn.lab+kosmo@gmail.com" className="underline underline-offset-2">
                            qtn.lab+kosmo@gmail.com
                        </a>
                    </p>
                    <p>
                        As the operator of this service, we act as the <strong>data controller</strong> for
                        your personal data within the meaning of the EU General Data Protection Regulation
                        (GDPR).
                    </p>
                </Section>

                <Section title="2. Data we collect">
                    <p>We collect the following categories of personal data:</p>
                    <SubSection title="Account data">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Email address (required to create an account)</li>
                            <li>Display name and username (optional, set by you)</li>
                            <li>Profile picture URL (optional, set by you)</li>
                            <li>Bio (optional, set by you)</li>
                        </ul>
                    </SubSection>
                    <SubSection title="Authentication & session data">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>IP address — collected when you sign in and stored with your session</li>
                            <li>User agent (browser / device information) — collected at sign-in</li>
                            <li>Session tokens — used to keep you signed in</li>
                            <li>Magic link tokens — short-lived (5 minutes), deleted after use</li>
                        </ul>
                    </SubSection>
                    <SubSection title="Content & activity">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Posts, comments, and votes you create</li>
                            <li>Communities you create or join</li>
                            <li>Accounts you follow</li>
                            <li>Feedback you submit</li>
                            <li>Privacy and appearance preferences</li>
                        </ul>
                    </SubSection>
                    <SubSection title="Technical data">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                Rate-limit counters — to prevent abuse; keyed by IP address and stored
                                temporarily
                            </li>
                        </ul>
                    </SubSection>
                    <p className="text-muted-foreground text-sm">
                        We do <strong>not</strong> use analytics trackers, advertising networks, or
                        fingerprinting tools. We do not sell your data.
                    </p>
                </Section>

                <Section title="3. How we use your data & legal basis">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="py-2 pr-4 font-semibold">Purpose</th>
                                <th className="py-2 pr-4 font-semibold">Legal basis (GDPR Art. 6)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="py-2 pr-4">Providing and operating the Kosmo service</td>
                                <td className="py-2">Contract — Art. 6(1)(b)</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4">Sending magic link sign-in emails</td>
                                <td className="py-2">Contract — Art. 6(1)(b)</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4">
                                    Storing IP address & user agent with sessions (security,
                                    abuse prevention)
                                </td>
                                <td className="py-2">Legitimate interests — Art. 6(1)(f)</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4">Rate limiting to prevent abuse</td>
                                <td className="py-2">Legitimate interests — Art. 6(1)(f)</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4">Storing user preferences</td>
                                <td className="py-2">Contract — Art. 6(1)(b)</td>
                            </tr>
                        </tbody>
                    </table>
                </Section>

                <Section title="4. Data retention">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                            <strong>Account data:</strong> retained for as long as your account is active.
                            Deleted upon account deletion.
                        </li>
                        <li>
                            <strong>Sessions:</strong> active sessions are deleted when you sign out or
                            when they expire. Expired sessions are purged automatically.
                        </li>
                        <li>
                            <strong>Magic link tokens:</strong> deleted immediately after use or after
                            5 minutes, whichever comes first.
                        </li>
                        <li>
                            <strong>Rate-limit counters:</strong> expire automatically after the rate
                            limit window (typically 30–60 seconds).
                        </li>
                        <li>
                            <strong>Content (posts, comments):</strong> retained until you delete it or
                            delete your account.
                        </li>
                    </ul>
                </Section>

                <Section title="5. Third-party processors">
                    <p>
                        We use a limited number of sub-processors. By using Kosmo, you acknowledge that
                        your data may be processed by these providers under their own privacy policies and
                        our data processing agreements with them.
                    </p>
                    <table className="w-full text-sm border-collapse mt-2">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="py-2 pr-4 font-semibold">Provider</th>
                                <th className="py-2 pr-4 font-semibold">Purpose</th>
                                <th className="py-2 font-semibold">Data location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="py-2 pr-4">Neon (via AWS eu-central-1)</td>
                                <td className="py-2 pr-4">Database hosting</td>
                                <td className="py-2">Frankfurt, Germany (EU)</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4">Vercel Inc.</td>
                                <td className="py-2 pr-4">Application hosting & edge delivery</td>
                                <td className="py-2">EU & USA (see Vercel DPA)</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4">Resend Inc.</td>
                                <td className="py-2 pr-4">Transactional email (magic links)</td>
                                <td className="py-2">USA (SCCs apply)</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-sm text-muted-foreground mt-2">
                        Resend is located in the United States. The transfer is governed by Standard
                        Contractual Clauses (SCCs) as provided under GDPR Article 46. Your email address
                        is transmitted to Resend solely for the purpose of delivering sign-in links.
                    </p>
                </Section>

                <Section title="6. Cookies & local storage">
                    <p>
                        Kosmo uses a single session cookie to keep you signed in. This cookie is:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                            <strong>Strictly necessary</strong> — the service cannot function without it
                        </li>
                        <li>Set only after you sign in</li>
                        <li>Deleted when you sign out</li>
                        <li>Not used for tracking or advertising</li>
                    </ul>
                    <p className="text-sm">
                        We do not use advertising cookies, analytics cookies, or any third-party tracking
                        cookies. No cookie consent banner is shown because the only cookie we set is
                        strictly necessary.
                    </p>
                </Section>

                <Section title="7. Your rights under GDPR">
                    <p>
                        If you are located in the European Economic Area (EEA), you have the following
                        rights regarding your personal data:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                            <strong>Right of access (Art. 15):</strong> request a copy of the data we
                            hold about you
                        </li>
                        <li>
                            <strong>Right to rectification (Art. 16):</strong> correct inaccurate data
                            — you can do this directly in your account settings
                        </li>
                        <li>
                            <strong>Right to erasure (Art. 17):</strong> request deletion of your account
                            and all associated data
                        </li>
                        <li>
                            <strong>Right to portability (Art. 20):</strong> receive your data in a
                            structured, machine-readable format
                        </li>
                        <li>
                            <strong>Right to object (Art. 21):</strong> object to processing based on
                            legitimate interests (e.g., IP logging)
                        </li>
                        <li>
                            <strong>Right to restriction (Art. 18):</strong> request that we limit
                            processing of your data
                        </li>
                    </ul>
                    <p className="text-sm">
                        To exercise any of these rights, contact us at{" "}
                        <a href="mailto:qtn.lab+kosmo@gmail.com" className="underline underline-offset-2">
                            qtn.lab+kosmo@gmail.com
                        </a>
                        . We will respond within 30 days.
                    </p>
                    <p className="text-sm">
                        You also have the right to lodge a complaint with your national data protection
                        authority. In France, this is the{" "}
                        <a
                            href="https://www.cnil.fr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                        >
                            CNIL
                        </a>
                        .
                    </p>
                </Section>

                <Section title="8. Data security">
                    <p>
                        We take reasonable technical and organisational measures to protect your personal
                        data, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>HTTPS-only communication</li>
                        <li>Passwordless authentication (no passwords stored)</li>
                        <li>Short-lived magic link tokens (5-minute expiry)</li>
                        <li>
                            Database hosted in an ISO 27001-certified AWS region (eu-central-1, Frankfurt)
                        </li>
                    </ul>
                    <p className="text-sm">
                        In the event of a personal data breach that risks your rights and freedoms, we
                        will notify the relevant supervisory authority within 72 hours as required by
                        GDPR Article 33.
                    </p>
                </Section>

                <Section title="9. Changes to this policy">
                    <p>
                        We may update this policy from time to time. When we do, we will update the
                        &quot;Last updated&quot; date at the top of this page. Continued use of the
                        service after changes constitutes acceptance of the updated policy.
                    </p>
                    <p>
                        For significant changes, we will notify you by email if you have an account.
                    </p>
                </Section>

                <Section title="10. Contact">
                    <p>
                        Questions or requests regarding your personal data:{" "}
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
