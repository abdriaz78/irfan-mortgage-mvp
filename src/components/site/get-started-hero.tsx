import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Send, Sparkles, Check, Phone } from "lucide-react";
import { ModalShell, GetStartedStepper } from "./get-started-stepper";

const WHATSAPP_NUMBER = "923214216522";
const WHATSAPP_DISPLAY = "+92 321 4216522";

type ModalKind = null | "stepper" | "message" | "whatsapp";

export function GetStartedHero() {
  const [modal, setModal] = useState<ModalKind>(null);

  const options = [
    {
      key: "get-started",
      icon: <ArrowRight className="size-5" />,
      title: "Get Started",
      copy: "Answer a few quick questions and jump straight into your mortgage options.",
      onClick: () => setModal("stepper"),
    },
    {
      key: "whatsapp",
      icon: <MessageCircle className="size-5" />,
      title: "Contact Us on WhatsApp",
      copy: "Prefer to chat? Message an adviser directly on WhatsApp.",
      onClick: () => setModal("whatsapp"),
    },
    {
      key: "message",
      icon: <Send className="size-5" />,
      title: "Send a Quick Message",
      copy: "Leave your details and a short note — we'll get back to you.",
      onClick: () => setModal("message"),
    },
    {
      key: "ai",
      icon: <Sparkles className="size-5" />,
      title: "Ask our AI Assistant",
      copy: "Get instant answers to your mortgage and protection questions.",
      to: "/chat" as const,
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background image + overlay */}
      <img
        src="/images/hero-advice.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        width={1600}
        height={900}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40" />

      <div className="relative container-page py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90 mb-6 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-brand-accent" /> FCA regulated · Whole of market
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold leading-[0.98] text-white text-balance mb-5">
            Get Free Advice from Us
          </h1>
          <p className="text-lg text-zinc-200 max-w-[46ch] leading-relaxed">
            Impartial mortgage and protection advice, tailored to you. Pick the way that suits you best — we'll take
            it from there.
          </p>
        </div>

        {/* Four options */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
          {options.map((o) => {
            const inner = (
              <>
                <div className="size-11 rounded-xl bg-brand-soft text-brand grid place-items-center mb-4 group-hover:bg-brand group-hover:text-primary-foreground transition-colors">
                  {o.icon}
                </div>
                <h3 className="text-base font-semibold mb-1.5">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.copy}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  Continue <ArrowRight className="size-3" />
                </span>
              </>
            );
            const cardCls =
              "group text-left bg-card/95 backdrop-blur p-6 rounded-2xl ring-1 ring-white/10 hover:ring-brand/40 transition-all hover:shadow-xl flex flex-col";
            return o.to ? (
              <Link key={o.key} to={o.to} className={cardCls}>
                {inner}
              </Link>
            ) : (
              <button key={o.key} type="button" onClick={o.onClick} className={cardCls}>
                {inner}
              </button>
            );
          })}
        </div>
      </div>

      {modal === "stepper" && <GetStartedStepper onClose={() => setModal(null)} />}
      {modal === "message" && <QuickMessageModal onClose={() => setModal(null)} />}
      {modal === "whatsapp" && <WhatsAppModal onClose={() => setModal(null)} />}
    </section>
  );
}

// ---- Option 2: WhatsApp ----
function WhatsAppModal({ onClose }: { onClose: () => void }) {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Fasttrack Mortgages, I'd like some free advice.",
  )}`;
  return (
    <ModalShell title="Chat on WhatsApp" onClose={onClose}>
      <div className="text-center">
        <div className="size-14 rounded-2xl bg-brand-soft text-brand grid place-items-center mx-auto mb-4">
          <MessageCircle className="size-7" />
        </div>
        <p className="text-sm text-muted-foreground mb-4 max-w-[38ch] mx-auto">
          Message one of our advisers directly. Tap below and WhatsApp will open with a message ready to send.
        </p>
        <div className="inline-flex items-center gap-2 text-lg font-semibold mb-6">
          <Phone className="size-4 text-brand" /> {WHATSAPP_DISPLAY}
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
          <MessageCircle className="size-4" /> Chat on WhatsApp
        </a>
      </div>
    </ModalShell>
  );
}

// ---- Option 3: Quick message ----
function QuickMessageModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hi Fasttrack Mortgages, I'd like some advice.\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(link, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <ModalShell title="Message ready" onClose={onClose}>
        <div className="text-center py-4">
          <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mx-auto mb-4">
            <Check className="size-7" />
          </div>
          <p className="text-sm text-muted-foreground max-w-[38ch] mx-auto">
            WhatsApp should have opened with your message ready to send — just tap send and we'll be in touch.
          </p>
          <button onClick={onClose} className="btn-secondary mt-6">
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Send us a quick message" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Your name" value={name} onChange={setName} required />
        <Field label="Contact number" value={phone} onChange={setPhone} type="tel" required />
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            placeholder="How can we help?"
            className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
          />
        </div>
        <button type="submit" className="btn-primary w-full justify-center">
          Send via WhatsApp <ArrowRight className="size-4" />
        </button>
        <p className="text-[11px] text-muted-foreground text-center">
          Opens WhatsApp with your message pre-filled to {WHATSAPP_DISPLAY}.
        </p>
      </form>
    </ModalShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-secondary/60 border border-border rounded-lg text-sm focus:border-brand focus:outline-none transition-colors"
      />
    </div>
  );
}
