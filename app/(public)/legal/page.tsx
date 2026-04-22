import { BackButton } from "@/components/ui/BackButton"

export const metadata = {
    title: "Legal Notice — Kosmo",
    description: "Legal information about Kosmo and its publisher.",
}

export default function LegalNoticePage() {
    return (
        <main className="min-h-screen">
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
                <BackButton />

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Legal Notice</h1>
                    <p className="text-muted-foreground text-sm">
                        Mentions légales — pursuant to French Law n°2004-575 of June 21, 2004 (LCEN)
                    </p>
                </div>

                <Section title="Publisher">
                    <Row label="Name" value="Quentin Artaud" />
                    {/* <Row label="Legal status" value="Auto-entrepreneur (sole trader)" />
                    <Row label="SIRET" value="[YOUR SIRET NUMBER]" /> */}
                    <Row label="Address" value="Paris, France" />
                    <Row
                        label="Contact"
                        value={
                            <a
                                href="mailto:qtn.lab+kosmo@gmail.com"
                                className="underline underline-offset-2 hover:text-foreground"
                            >
                                qtn.lab+kosmo@gmail.com
                            </a>
                        }
                    />
                    <Row label="Publication director" value="Quentin Artaud" />
                </Section>

                <Section title="Hosting provider">
                    <Row label="Company" value="Vercel Inc." />
                    <Row label="Address" value="340 Pine Street, Suite 701, San Francisco, CA 94104, United States" />
                    <Row
                        label="Website"
                        value={
                            <a
                                href="https://vercel.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-foreground"
                            >
                                vercel.com
                            </a>
                        }
                    />
                </Section>

                <Section title="Database hosting">
                    <Row label="Company" value="Neon, Inc. (via AWS eu-central-1)" />
                    <Row label="Data location" value="Frankfurt, Germany (European Union)" />
                    <Row
                        label="Website"
                        value={
                            <a
                                href="https://neon.tech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-foreground"
                            >
                                neon.tech
                            </a>
                        }
                    />
                </Section>

                <Section title="Intellectual property">
                    <p className="text-sm leading-relaxed text-foreground/80">
                        The Kosmo name, logo, and all original content produced by its publisher are
                        protected by intellectual property law. Any reproduction, distribution, or
                        commercial use without prior written consent is prohibited.
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80">
                        User-generated content (posts, comments, profile information) remains the
                        property of its respective authors.
                    </p>
                </Section>
            </div>
        </main>
    )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="space-y-2">{children}</div>
    </section>
)

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground w-40 shrink-0">{label}</span>
        <span className="text-foreground/80">{value}</span>
    </div>
)
