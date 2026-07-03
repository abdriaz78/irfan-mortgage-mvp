import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles, ThumbsUp, ThumbsDown, Copy } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Advisor — Ask anything · Vantage & Co." },
      { name: "description", content: "24/7 AI advisor for mortgage and insurance FAQs, eligibility, document requirements, and process guidance." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <section className="py-12">
      <div className="container-page grid lg:grid-cols-4 gap-8 max-w-5xl">
        <aside className="lg:col-span-1 space-y-6">
          <div>
            <div className="eyebrow mb-3 text-brand">AI Advisor</div>
            <h1 className="text-3xl font-semibold mb-2">Ask anything.</h1>
            <p className="text-sm text-muted-foreground">Trained on our advisory playbook. For regulated advice, we'll hand you to a human.</p>
          </div>
          <div className="p-5 bg-secondary/60 rounded-xl">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Popular questions</div>
            <ul className="space-y-2 text-sm">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button className="text-left w-full py-2 px-3 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-3 bg-card ring-1 ring-border rounded-3xl flex flex-col h-[70vh]">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="size-9 rounded-full bg-brand text-primary-foreground grid place-items-center">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Vantage AI</div>
              <div className="text-[10px] text-brand uppercase tracking-widest font-semibold">● Online</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {MESSAGES.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-8 rounded-full grid place-items-center shrink-0 text-xs font-semibold ${
                  m.role === "user" ? "bg-secondary" : "bg-brand text-primary-foreground"
                }`}>
                  {m.role === "user" ? "EV" : <Sparkles className="size-3.5" />}
                </div>
                <div className={`max-w-[75%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-foreground rounded-tl-sm"
                  }`}>
                    {m.text}
                  </div>
                  {m.role === "assistant" && (
                    <div className="mt-2 flex gap-3 text-muted-foreground">
                      <button className="text-xs inline-flex items-center gap-1 hover:text-foreground"><Copy className="size-3" /></button>
                      <button className="text-xs inline-flex items-center gap-1 hover:text-foreground"><ThumbsUp className="size-3" /></button>
                      <button className="text-xs inline-flex items-center gap-1 hover:text-foreground"><ThumbsDown className="size-3" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about eligibility, documents, rates…"
                className="w-full px-5 py-4 pr-14 bg-secondary/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 size-10 bg-brand text-primary-foreground rounded-xl grid place-items-center hover:opacity-90 transition-opacity">
                <Send className="size-4" />
              </button>
            </div>
            <div className="text-[10px] text-muted-foreground mt-2 text-center uppercase tracking-widest">
              AI responses are informational — not regulated financial advice.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SUGGESTIONS = [
  "How much deposit do I need?",
  "Do I need life insurance for my mortgage?",
  "What documents do self-employed applicants need?",
  "Can I overpay on a fixed-rate mortgage?",
  "How is stamp duty calculated for a second home?",
];

const MESSAGES = [
  { role: "assistant" as const, text: "Hi Eleanor — I'm the Vantage AI advisor. Ask me anything about your mortgage, insurance, or application progress." },
  { role: "user" as const, text: "How much deposit do I need for a £470,000 property?" },
  { role: "assistant" as const, text: "For a £470,000 property, most lenders require a minimum 5% deposit (£23,500), but you'll access materially better rates at 10% (£47,000) or 15% (£70,500). Based on your profile, I'd recommend targeting a 15% deposit to unlock our best fixed rates near 3.89%." },
  { role: "user" as const, text: "Do I need life insurance if my partner earns similarly?" },
  { role: "assistant" as const, text: "It's not legally required — but strongly recommended. If either of you passed away, the surviving partner would need to cover the full mortgage on one income. A 25-year decreasing term policy for £425k would cost approximately £14–£22/month for someone in good health. Want me to model a quote?" },
];
