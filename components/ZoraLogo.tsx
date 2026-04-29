import Link from "next/link";

interface ZoraLogoProps {
  /** 'dark' = dunkler Text für helle Hintergründe (Navbar). 'light' = weißer Text für dunkle Hintergründe (Sidebar, Footer). */
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
}

const SIZE = {
  sm: { icon: "w-6 h-6", dot: "w-2.5 h-2.5", text: "text-base", gap: "gap-1.5" },
  md: { icon: "w-7 h-7", dot: "w-3 h-3", text: "text-xl", gap: "gap-2" },
  lg: { icon: "w-9 h-9", dot: "w-3.5 h-3.5", text: "text-2xl", gap: "gap-2.5" },
};

export function ZoraLogo({
  variant = "dark",
  size = "md",
  href = "/",
  onClick,
}: ZoraLogoProps) {
  const s = SIZE[size];
  const textColor = variant === "light" ? "text-white" : "text-[#1a1a1a]";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center ${s.gap} flex-shrink-0`}
    >
      <span
        className={`${s.icon} rounded-lg bg-[#1D9E75] flex items-center justify-center flex-shrink-0`}
      >
        <span className={`${s.dot} rounded-full bg-white`} />
      </span>
      <span className={`font-bold ${s.text} tracking-tight ${textColor}`}>
        Zora
      </span>
    </Link>
  );
}
