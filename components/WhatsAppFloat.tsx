import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/quote";

export function WhatsAppFloat({ label, message }: { label: string; message: string }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream shadow-[0_10px_30px_-8px_rgba(30,26,23,0.45)] ring-1 ring-gold/50 transition-colors duration-500 hover:bg-gold-ink md:end-8 md:bottom-8"
    >
      <WhatsAppIcon />
    </a>
  );
}
