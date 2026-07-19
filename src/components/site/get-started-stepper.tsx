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
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Question flow
//
// A short qualifier that branches like a broker's opening chat: what you want
// to do, then a handful of purpose-specific questions, then a soft credit
// check. The answers are handed to /apply as search params so the full
// application form opens pre-filled. Wording here is our own — deliberately
// conversational rather than form-like.
// ---------------------------------------------------------------------------

type Screen =
  | "purpose"
  | "firstTime"
  | "btlType"
  | "stage"
  | "remoTiming"
  | "remoLender"
  | "remoChanges"
  | "remoDeals"
  | "credit";

type Answers = {
  purpose: "" | "Buy a home" | "Remortgage" | "Buy to let (investment)";
  firstTime: string;
  btlType: string;
  stage: string;
  remoTiming: string;
  remoLender: string;
  remoChanges: string;
  remoDeals: string;
};

const emptyAnswers: Answers = {
  purpose: "",
  firstTime: "",
  btlType: "",
  stage: "",
  remoTiming: "",
  remoLender: "",
  remoChanges: "",
  remoDeals: "",
};

// Map our friendly stage labels onto the canonical PURCHASE_STAGE_OPTIONS the
// application form understands.
const STAGE_TO_CANONICAL: Record<string, string> = {
  "Just starting to look": "Still looking",
  "Out viewing places": "Viewing properties",
  "I've made an offer": "Offer made",
  "My offer's been accepted": "Offer accepted",
};

// Common UK residential/BTL lenders, roughly by market share, for the "who's
// your mortgage with?" dropdown. "Other" reveals a free-text box so nobody is
// blocked if their lender isn't listed.
const LENDER_OPTIONS = [
  "Halifax",
  "Nationwide",
  "NatWest",
  "Santander",
  "Barclays",
  "HSBC",
  "Lloyds Bank",
  "TSB",
  "Coventry Building Society",
  "Yorkshire Building Society",
  "Virgin Money",
  "Skipton Building Society",
  "Leeds Building Society",
  "The Mortgage Works",
  "Accord Mortgages",
  "Bank of Ireland",
  "Clydesdale Bank",
  "Co-operative Bank",
  "Metro Bank",
  "Kensington Mortgages",
  "Precise Mortgages",
] as const;

const OTHER_LENDER = "Other / not listed";

// What "keep the same / borrow more / …" means for the remortgage purpose field.
const CHANGES_TO_PURPOSE: Record<string, string> = {
  "Keep my borrowing the same": "Keep borrowing the same",
  "Release some extra cash": "Borrow more — release funds",
  "Reduce what I owe": "Borrow less",
  "Change my term or repayment type": "Change term / repayment type",
};

// Build the ordered list of screens for the path the user is on, so the
// progress bar and Back button stay correct as branches open up.
function buildSequence(a: Answers): Screen[] {
  const seq: Screen[] = ["purpose"];
  if (a.purpose === "Buy a home") {
    seq.push("firstTime", "stage", "credit");
  } else if (a.purpose === "Remortgage") {
    seq.push("remoTiming", "remoLender", "remoChanges");
    if (a.remoChanges === "Keep my borrowing the same") seq.push("remoDeals");
    seq.push("credit");
  } else if (a.purpose === "Buy to let (investment)") {
    seq.push("btlType");
    if (a.btlType === "Buying a new investment property") {
      seq.push("stage", "credit");
    } else if (a.btlType === "Remortgaging one I already own") {
      seq.push("remoTiming", "remoLender", "remoChanges");
      if (a.remoChanges === "Keep my borrowing the same") seq.push("remoDeals");
      seq.push("credit");
    }
  }
  return seq;
}

export function GetStartedStepper({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("purpose");
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);

  const sequence = buildSequence(answers);
  const idx = Math.max(0, sequence.indexOf(screen));
  const stepNo = idx + 1;
  const totalSteps = sequence.length;

  function goNext(from: Screen, patch: Partial<Answers>) {
    const nextAnswers = { ...answers, ...patch };
    setAnswers(nextAnswers);
    const seq = buildSequence(nextAnswers);
    const here = seq.indexOf(from);
    const next = seq[here + 1];
    if (next) setScreen(next);
    else finish(nextAnswers);
  }

  function back() {
    if (idx > 0) setScreen(sequence[idx - 1]);
  }

  function finish(a: Answers, creditIssues?: string) {
    const isRemo = a.purpose === "Remortgage" || a.btlType === "Remortgaging one I already own";
    const isBtl = a.purpose === "Buy to let (investment)";

    const notes: string[] = [];
    if (a.remoTiming) notes.push(`Planned remortgage timing: ${a.remoTiming}.`);
    if (a.remoDeals) notes.push(`Deals to focus on: ${a.remoDeals}.`);

    onClose();
    navigate({
      to: "/apply",
      search: {
        purchaseOrRemortgage: isRemo ? "Remortgage" : "Purchase",
        residentialOrBtl: isBtl ? "Buy to Let" : "Residential",
        ...(a.purpose === "Buy a home"
          ? {
              firstTimeBuyer: a.firstTime === "Yes — I'm a first-time buyer" ? "Yes" : "No",
            }
          : {}),
        ...(a.stage && STAGE_TO_CANONICAL[a.stage]
          ? { purchaseStage: STAGE_TO_CANONICAL[a.stage] }
          : {}),
        ...(a.remoLender ? { currentLender: a.remoLender } : {}),
        ...(a.remoChanges && CHANGES_TO_PURPOSE[a.remoChanges]
          ? { remortgagePurpose: CHANGES_TO_PURPOSE[a.remoChanges] }
          : {}),
        ...(notes.length ? { enquiryNotes: notes.join(" ") } : {}),
        ...(creditIssues ? { creditIssues } : {}),
      },
    });
  }

  return (
    <ModalShell title="Let's get you started" onClose={onClose}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Step {stepNo} of {totalSteps}
          </span>
          {idx > 0 && (
            <button
              onClick={back}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" /> Back
            </button>
          )}
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all"
            style={{ width: `${(stepNo / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {screen === "purpose" && (
        <StepQuestion
          question="What are you hoping to do?"
          options={["Buy a home", "Remortgage", "Buy to let (investment)"]}
          onPick={(v) => goNext("purpose", { purpose: v as Answers["purpose"] })}
        />
      )}

      {screen === "firstTime" && (
        <StepQuestion
          question="Is this your first step onto the property ladder?"
          options={["Yes — I'm a first-time buyer", "No — I've owned a home before"]}
          onPick={(v) => goNext("firstTime", { firstTime: v })}
        />
      )}

      {screen === "btlType" && (
        <StepQuestion
          question="Are you buying a new rental or refinancing one you already have?"
          options={["Buying a new investment property", "Remortgaging one I already own"]}
          onPick={(v) => goNext("btlType", { btlType: v })}
        />
      )}

      {screen === "stage" && (
        <StepQuestion
          question="How far along are you so far?"
          options={[
            "Just starting to look",
            "Out viewing places",
            "I've made an offer",
            "My offer's been accepted",
          ]}
          onPick={(v) => goNext("stage", { stage: v })}
        />
      )}

      {screen === "remoTiming" && (
        <StepQuestion
          question="When are you looking to switch your deal?"
          options={[
            "Within the next 3 months",
            "3 to 6 months from now",
            "6 to 12 months from now",
            "More than a year away",
          ]}
          onPick={(v) => goNext("remoTiming", { remoTiming: v })}
        />
      )}

      {screen === "remoLender" && (
        <StepLender
          question="Who's your mortgage with at the moment?"
          value={answers.remoLender}
          onContinue={(lender) => goNext("remoLender", { remoLender: lender })}
        />
      )}

      {screen === "remoChanges" && (
        <StepQuestion
          question="With your new deal, what would you like to do?"
          options={[
            "Keep my borrowing the same",
            "Release some extra cash",
            "Reduce what I owe",
            "Change my term or repayment type",
          ]}
          onPick={(v) => goNext("remoChanges", { remoChanges: v })}
        />
      )}

      {screen === "remoDeals" && (
        <StepQuestion
          question="Which deals should we line up for you?"
          options={[
            "Just my current lender's offers",
            "The best from across the whole market",
            "Not sure yet — show me both",
          ]}
          onPick={(v) => goNext("remoDeals", { remoDeals: v })}
        />
      )}

      {screen === "credit" && (
        <StepQuestion
          question="In the last 6 years, have you run into any credit trouble — or taken a payday loan in the last 2 years?"
          options={["Yes", "No"]}
          onPick={(v) => finish(answers, v)}
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

// Lender picker: a dropdown of common UK lenders, with an "Other" choice that
// reveals a free-text box so an unlisted lender never blocks the journey.
function StepLender({
  question,
  value,
  onContinue,
}: {
  question: string;
  value: string;
  onContinue: (lender: string) => void;
}) {
  // Seed the internal state from any previously chosen value (e.g. after Back).
  const known = (LENDER_OPTIONS as readonly string[]).includes(value);
  const [choice, setChoice] = useState(value ? (known ? value : OTHER_LENDER) : "");
  const [other, setOther] = useState(known ? "" : value);

  const isOther = choice === OTHER_LENDER;
  const resolved = isOther ? other.trim() : choice;
  const canContinue = choice !== "" && (!isOther || other.trim().length > 0);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{question}</h3>

      <select
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-secondary/60 ring-1 ring-border focus:ring-brand focus:outline-none transition-all text-sm font-medium mb-4 appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Select your lender…
        </option>
        {LENDER_OPTIONS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
        <option value={OTHER_LENDER}>{OTHER_LENDER}</option>
      </select>

      {isOther && (
        <input
          type="text"
          value={other}
          placeholder="Type your lender's name"
          autoFocus
          onChange={(e) => setOther(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canContinue) onContinue(resolved);
          }}
          className="w-full px-4 py-3.5 rounded-xl bg-secondary/60 ring-1 ring-border focus:ring-brand focus:outline-none transition-all text-sm font-medium mb-4"
        />
      )}

      <button
        onClick={() => onContinue(resolved)}
        disabled={!canContinue}
        className="w-full px-4 py-3.5 rounded-xl bg-brand text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        Continue <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
