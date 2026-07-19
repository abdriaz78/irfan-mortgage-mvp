import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, X, ChevronLeft } from "lucide-react";

// Shared modal shell used by the Get Started stepper, the quick-message form,
// and the WhatsApp panel. Rendered through a portal to document.body so it is
// always centred on the viewport (and never trapped inside a `backdrop-blur`
// parent such as the sticky nav).
export function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto ring-1 ring-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b border-border p-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

// The "Get Started" qualifier: a few quick questions that route into the full
// public mortgage application (/apply), pre-filling the first answers.
export function GetStartedStepper({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<"purpose" | "firstTime" | "stage">("purpose");
  const [purpose, setPurpose] = useState("");
  const [firstTime, setFirstTime] = useState("");

  const totalSteps = purpose === "Buy a home" ? 3 : 2;
  const stepNo = screen === "purpose" ? 1 : screen === "firstTime" ? 2 : totalSteps;

  function finish() {
    const purchaseOrRemortgage = purpose === "Remortgage" ? "Remortgage" : "Purchase";
    const residentialOrBtl = purpose === "Buy to let (investment)" ? "Buy to Let" : "Residential";
    const firstTimeBuyer =
      purpose === "Buy a home"
        ? firstTime === "Yes, this is my first home"
          ? "Yes"
          : "No"
        : undefined;
    onClose();
    navigate({
      to: "/apply",
      search: {
        purchaseOrRemortgage,
        residentialOrBtl,
        ...(firstTimeBuyer ? { firstTimeBuyer } : {}),
      },
    });
  }

  function back() {
    if (screen === "stage") setScreen(purpose === "Buy a home" ? "firstTime" : "purpose");
    else if (screen === "firstTime") setScreen("purpose");
  }

  return (
    <ModalShell title="Let's get you started" onClose={onClose}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Step {stepNo} of {totalSteps}
          </span>
          {screen !== "purpose" && (
            <button
              onClick={back}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" /> Back
            </button>
          )}
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-brand transition-all" style={{ width: `${(stepNo / totalSteps) * 100}%` }} />
        </div>
      </div>

      {screen === "purpose" && (
        <StepQuestion
          question="What are you looking to do?"
          options={["Buy a home", "Remortgage", "Buy to let (investment)"]}
          onPick={(v) => {
            setPurpose(v);
            setScreen(v === "Buy a home" ? "firstTime" : "stage");
          }}
        />
      )}

      {screen === "firstTime" && (
        <StepQuestion
          question="Is this your first home?"
          options={["Yes, this is my first home", "No, I'm moving home"]}
          onPick={(v) => {
            setFirstTime(v);
            setScreen("stage");
          }}
        />
      )}

      {screen === "stage" && (
        <StepQuestion
          question="Where are you up to?"
          options={["Just researching", "Viewing properties", "I've made an offer"]}
          onPick={finish}
        />
      )}
    </ModalShell>
  );
}

function StepQuestion({
  question,
  options,
  onPick,
}: {
  question: string;
  options: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onPick(o)}
            className="w-full text-left px-4 py-3.5 rounded-xl bg-secondary/60 ring-1 ring-border hover:ring-brand hover:bg-brand-soft transition-all text-sm font-medium flex items-center justify-between group"
          >
            {o}
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-brand" />
          </button>
        ))}
      </div>
    </div>
  );
}
