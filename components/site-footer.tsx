import { profile, tickerBottom } from '@/lib/content';
import { Marquee } from '@/components/marquee';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <Marquee
        items={tickerBottom}
        duration={80}
        className="py-4 text-muted-foreground"
      />

      <p className="mono-xs border-t border-border/70 py-5 text-muted-foreground">
        &copy; {new Date().getFullYear()} {profile.name}
        <span className="mx-2 opacity-40">/</span>
        next.js + shadcn/ui
      </p>
    </footer>
  );
}
