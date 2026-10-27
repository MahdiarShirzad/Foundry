import Image from "next/image";

const LINKS = [
  { label: "The problem", href: "#problem" },
  { label: "Eight stages", href: "#stages" },
  { label: "Workflow", href: "#workflow" },
  { label: "Architecture", href: "#architecture" },
  { label: "Top", href: "#top" },
];

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col gap-8 px-6 py-12 sm:px-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4">
          {/* self-start: a flex-column parent would otherwise stretch the image
              across the column and distort the lockup's aspect ratio. */}
          <Image
            src="/logo.png"
            alt="Foundry"
            width={932}
            height={297}
            className="h-9 w-auto self-start"
          />
          <p className="font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.18em] text-faint">
            From idea to launch. One connected ecosystem.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-[11px] tracking-[0.14em] text-faint md:text-right">
          © 2026 Foundry
        </p>
      </div>
    </footer>
  );
}