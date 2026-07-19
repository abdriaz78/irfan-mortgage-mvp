import { createFileRoute } from "@tanstack/react-router";
import { Video, MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import advisorPortrait from "@/assets/advisor-portrait.jpg";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { service?: string } => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a Consultation · Fasttrack Mortgages" },
      { name: "description", content: "Book a 45-minute consultation with a regulated mortgage or protection advisor — video, phone, or in person." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { service } = Route.useSearch();
  return (
    <section className="py-16">
      <div className="container-page grid lg:grid-cols-3 gap-8 max-w-6xl">
        <aside className="lg:col-span-1 space-y-6">
          <div>
            <div className="eyebrow mb-3 text-brand">Book a consultation</div>
            <h1 className="text-4xl font-semibold mb-4">45 minutes with a regulated advisor.</h1>
            {service && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-soft text-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
                Enquiry: {service}
              </div>
            )}
            <p className="text-muted-foreground">
              {service
                ? `Tell us about your ${service.toLowerCase()} needs. Free, no obligation, and fully confidential — we'll follow up by email with a summary.`
                : "Free, no obligation, and fully confidential. We'll follow up by email with a summary."}
            </p>
          </div>
          <div className="p-6 bg-card ring-1 ring-border rounded-2xl">
            <img src={advisorPortrait} alt="Your Fasttrack Mortgages adviser" className="size-16 rounded-full object-cover mb-4" width={800} height={1000} loading="lazy" />
            <div className="text-sm font-semibold">Your dedicated adviser</div>
            <div className="text-xs text-muted-foreground mb-4">Qualified Mortgage &amp; Protection Adviser · CeMAP</div>
            <div className="flex gap-0.5 text-brand-accent">
              {"★★★★★".split("").map((_, i) => <span key={i}>★</span>)}
              <span className="text-xs text-muted-foreground ml-2">5.0 · 81 Google reviews</span>
            </div>
          </div>
          <div className="p-6 bg-secondary/60 rounded-2xl">
            <div className="eyebrow mb-3">What to prepare</div>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>· Last 3 months' payslips</li>
              <li>· Current mortgage statement (if remortgaging)</li>
              <li>· ID (passport or driving licence)</li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-2 bg-card ring-1 ring-border rounded-3xl p-8">
          {/* Meeting type */}
          <div className="mb-8">
            <div className="eyebrow mb-3">Meeting type</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Video className="size-5" />, label: "Video call", active: true },
                { icon: <Phone className="size-5" />, label: "Phone" },
                { icon: <MapPin className="size-5" />, label: "In person" },
              ].map((m) => (
                <button key={m.label} className={`p-5 rounded-xl ring-1 flex flex-col items-center gap-2 transition-all ${
                  m.active ? "bg-brand text-primary-foreground ring-brand" : "bg-secondary/60 ring-border hover:ring-brand/30"
                }`}>
                  {m.icon}
                  <span className="text-sm font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="eyebrow">November 2026</div>
              <div className="flex gap-2">
                <button className="size-8 rounded-lg bg-secondary hover:bg-secondary/70 grid place-items-center"><ChevronLeft className="size-4" /></button>
                <button className="size-8 rounded-lg bg-secondary hover:bg-secondary/70 grid place-items-center"><ChevronRight className="size-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const disabled = i < 3 || i === 8 || i === 15 || [5, 6, 12, 13, 19, 20, 26, 27].includes(i);
                const selected = day === 12;
                return (
                  <button
                    key={i}
                    disabled={disabled}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-brand text-primary-foreground"
                        : disabled
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="mb-8">
            <div className="eyebrow mb-3">Available slots — Thursday, 12 Nov</div>
            <div className="grid grid-cols-4 gap-2">
              {["09:00", "09:45", "10:30", "11:15", "13:00", "14:30", "15:15", "16:00"].map((t, i) => (
                <button key={t} className={`py-3 rounded-lg text-sm font-medium transition-all ${
                  i === 3 ? "bg-brand text-primary-foreground" : "bg-secondary/60 hover:bg-secondary ring-1 ring-border"
                }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary w-full justify-center">Confirm appointment</button>
          <div className="text-[10px] text-muted-foreground text-center mt-3 uppercase tracking-widest">
            Confirmation sent via email &amp; WhatsApp · SMS reminder 24h before
          </div>
        </div>
      </div>
    </section>
  );
}
