import { Link } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";

export function ChatBubble() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        to="/chat"
        className="group flex items-center gap-3 bg-brand text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-xl ring-4 ring-background hover:scale-[1.03] active:scale-95 transition-transform"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75 animate-pulse-dot" />
          <span className="relative inline-flex rounded-full size-2 bg-brand-accent" />
        </span>
        <MessageSquareText className="size-4" />
        <span className="text-xs font-medium tracking-wide">Ask our AI Advisor</span>
      </Link>
    </div>
  );
}
