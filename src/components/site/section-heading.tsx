import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}`}>
      {eyebrow && <div className="eyebrow mb-4 text-brand">{eyebrow}</div>}
      <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-balance mb-4">{title}</h2>
      {description && <p className="text-muted-foreground text-pretty leading-relaxed">{description}</p>}
    </div>
  );
}
