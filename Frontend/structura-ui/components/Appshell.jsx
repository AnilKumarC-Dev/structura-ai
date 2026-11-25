import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function Appshell({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/" className="app-brand" aria-label="StructuraAI home">
          <span>
            Structura<span className="app-brand-ai">AI</span>
          </span>
          <span className="app-brand-tag">Engineering Knowledge Platform</span>
        </Link>

        <div className="app-header-right">
          <ThemeToggle />
          <Image
            src="/honeywell-logo.svg"
            alt="Honeywell"
            width={113}
            height={20}
            className="app-logo"
            unoptimized
          />
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <NavLinks />
        </aside>

        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
