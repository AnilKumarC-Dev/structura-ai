"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Knowledge Agent" },
  { href: "/upload", label: "Ingestion Center" },
  { href: "/map", label: "Knowledge Map" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="app-nav">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="app-nav-link"
          aria-current={pathname === link.href ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
