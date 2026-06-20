import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-8 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Fiker.dev
      </Link>
      <div className="flex gap-8 items-center">
        <Link href="#projects" className="text-muted hover:text-foreground transition-colors text-sm font-medium">
          Projects
        </Link>
        <Link href="#about" className="text-muted hover:text-foreground transition-colors text-sm font-medium">
          About
        </Link>
        <Link href="#contact" className="text-muted hover:text-foreground transition-colors text-sm font-medium">
          Contact
        </Link>
      </div>
    </nav>
  );
};
