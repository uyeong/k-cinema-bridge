import Link from "next/link";
import type { Locale } from "@/i18n/config";

export function LanguageSwitcher({ current }: { current: Locale }) {
  return (
    <nav className="flex gap-1 text-sm" aria-label="Language">
      <Link
        href="/en"
        className={
          current === "en"
            ? "font-bold"
            : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        }
        aria-current={current === "en" ? "page" : undefined}
      >
        🇺🇸 EN
      </Link>
      <span className="text-zinc-300 dark:text-zinc-600">/</span>
      <Link
        href="/ko"
        className={
          current === "ko"
            ? "font-bold"
            : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        }
        aria-current={current === "ko" ? "page" : undefined}
      >
        🇰🇷 KO
      </Link>
    </nav>
  );
}
