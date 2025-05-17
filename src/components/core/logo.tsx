import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="group">
      <h1 className="text-3xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
        Alpha Coders
      </h1>
    </Link>
  );
}
